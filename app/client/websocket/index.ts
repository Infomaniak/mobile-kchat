// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {type ClientHeaders, getOrCreateWebSocketClient, WebSocketReadyState} from '@mattermost/react-native-network-client';
import Pusher, {ConnectionManager, type Channel} from 'pusher-js/react-native';

import {WebsocketEvents} from '@app/constants';
import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';
import {getConfigValue} from '@queries/servers/system';
import {toMilliseconds} from '@utils/datetime';
import {logDebug, logError, logInfo, logWarning} from '@utils/log';

const MAX_WEBSOCKET_FAILS = 7;
const WEBSOCKET_TIMEOUT = toMilliseconds({seconds: 30});
const MIN_WEBSOCKET_RETRY_TIME = toMilliseconds({seconds: 3});
const MAX_WEBSOCKET_RETRY_TIME = toMilliseconds({minutes: 5});
const PING_INTERVAL = toMilliseconds({seconds: 30});
const DEFAULT_OPTIONS = {
    forceConnection: true,
};
const TLS_HANDSHARE_ERROR = 1015;

Pusher.logToConsole = false;

type PusherEvent = {[k: string]: any} | undefined;

export default class WebSocketClient {
    private conn?: Pusher;
    private connectionTimeout: NodeJS.Timeout | undefined;
    private connectionId = '';
    private token: string;
    private stop = false;
    private url = '';
    private serverUrl: string;
    private connectFailCount = 0;

    private pingInterval: NodeJS.Timeout | undefined;
    private waitingForPong: boolean = false;

    // The first time we connect to a server (on init or login)
    // we do the sync out of the websocket lifecycle.
    // This is used to avoid calling twice to the sync logic.
    private shouldSkipSync = false;

    // responseSequence is the number to track a response sent
    // via the websocket. A response will always have the same sequence number
    // as the request.
    private responseSequence = 1;

    // serverSequence is the incrementing sequence number from the
    // server-sent event stream.
    private serverSequence = 0;

    // Callbacks
    private eventCallback?: Function;
    private firstConnectCallback?: () => void;
    private missedEventsCallback?: () => void;
    private reconnectCallback?: () => void;
    private reliableReconnectCallback?: () => void;
    private errorCallback?: Function;
    private closeCallback?: (connectFailCount: number) => void;
    private connectingCallback?: () => void;

    // INFOMANIAK
    // Current Pusher channel the user is connected to
    private presenceChannel?: Channel;

    // Recording polling ws event
    private recordingInterval: ReturnType<typeof setInterval> | null = null;

    constructor(serverUrl: string, token: string) {
        this.token = token;
        this.serverUrl = serverUrl;
    }

    public async initialize(opts = {}, shouldSkipSync = false) {
        const {forceConnection} = Object.assign({}, DEFAULT_OPTIONS, opts);

        if (forceConnection) {
            this.stop = false;
        }

        if (this.conn && this.connState !== WebSocketReadyState.CLOSED) {
            return;
        }

        const database = DatabaseManager.serverDatabases[this.serverUrl]?.database;
        if (!database) {
            return;
        }

        const websocketUrl = await getConfigValue(database, 'WebsocketURL');
        const connectionUrl = (websocketUrl || this.serverUrl);

        if (this.connectingCallback) {
            this.connectingCallback();
        }

        this.url = connectionUrl;

        if (this.connectFailCount === 0) {
            logInfo('websocket connecting to ' + this.url);
        }

        this.shouldSkipSync = shouldSkipSync;

        try {
            const headers: ClientHeaders = {};
            headers.Authorization = `Bearer ${this.token}`;

            const {client} = await getOrCreateWebSocketClient(this.url, this.serverUrl, {headers, timeoutInterval: WEBSOCKET_TIMEOUT});

            // Check again if the client is the same, to avoid race conditions
            if (this.conn === client) {
                // In case turning on/off Wi-fi on Samsung devices
                // the websocket will call onClose then onError then initialize again with readyState CLOSED, we need to open it again
                if (this.connState === WebSocketReadyState.CLOSED) {
                    clearTimeout(this.connectionTimeout);
                    this.connOpen();
                }
                return;
            }
            this.conn = client;
        } catch (error) {
            return;
        }

        this.bindConnection('connected', () => {
            clearTimeout(this.connectionTimeout);

            // No need to reset sequence number here.
            this.serverSequence = 0;

            if (this.token) {
                // we check for the platform as a workaround until we fix on the server that further authentications
                // are ignored
                //this.sendMessage('authentication_challenge', {token: this.token});
            }

            if (this.shouldSkipSync) {
                logInfo('websocket connected to', this.url);
                this.firstConnectCallback?.();
            } else {
                logInfo('websocket re-established connection to', this.url);
                if (this.reconnectCallback) {
                    this.reconnectCallback();
                }
            }

            this.connectFailCount = 0;
        });

        this.bindConnection('disconnected', () => {
            clearTimeout(this.connectionTimeout);
            this.conn = undefined;
            this.responseSequence = 1;

            // We skip the sync on first connect, since we are syncing along
            // the init logic. If the connection closes at any point after that,
            // we don't want to skip the sync. If we keep the same connection and
            // reliable websockets are enabled this won't trigger a new sync.
            this.shouldSkipSync = false;

            if (this.connectFailCount === 0) {
                logInfo('websocket closed', this.serverUrl);
            }

            this.connectFailCount++;

            if (this.closeCallback) {
                this.closeCallback(this.connectFailCount);
            }

            if (this.stop) {
                return;
            }

            let retryTime = MIN_WEBSOCKET_RETRY_TIME;

            // If we've failed a bunch of connections then start backing off
            if (this.connectFailCount > MAX_WEBSOCKET_FAILS) {
                retryTime = Math.min(MIN_WEBSOCKET_RETRY_TIME * this.connectFailCount, MAX_WEBSOCKET_RETRY_TIME);
            }

            if (this.connectionTimeout) {
                clearTimeout(this.connectionTimeout);
            }

            this.connectionTimeout = setTimeout(
                () => {
                    if (this.stop) {
                        clearTimeout(this.connectionTimeout);
                        return;
                    }
                    this.initialize(opts);
                },
                retryTime,
            );
        });

        this.bindConnection('error', (evt: PusherEvent) => {
            if (evt?.url === this.url) {
                this.onError(evt);
            }
        });

        // Infomaniak - this.conn.open();
        this.connOpen();
    }

    private async connOpen() {
        if (typeof this.conn !== 'undefined') {
            if (this.connState !== WebSocketReadyState.OPEN) {
                this.conn.connect();
            }

            const client = NetworkManager.getClient(this.serverUrl);
            const user = await client.getMe();
            if (!user) {
                return;
            }

            this.bindChannel(`private-team.${user.team_id}`, false);
            this.bindChannel(`presence-user.${user.user_id}`, false);
            this.bindChannel(`presence-teamUser.${user.id}`);
        }
    }

    private get connState() {
        // Convert Pusher.js connection state to WebSocketReadyState
        // Ref. https://pusher.com/docs/channels/using_channels/connection/#available-states
        switch (this.conn?.connection.state) {
            case 'initialized':
            case 'connecting':
                return WebSocketReadyState.CONNECTING;
            case 'connected':
                return WebSocketReadyState.OPEN;
            case 'unavailable':
            case 'failed':
            case 'disconnected':
                return WebSocketReadyState.CLOSED;
            default:
                return undefined;

            // No Pusher.js equivalent
            // return WebSocketReadyState.CLOSING;
        }
    }

    private onError(evt: PusherEvent) {
        if (this.connectFailCount <= 1) {
            logError('websocket error', this.url);
            logError('WEBSOCKET ERROR EVENT', evt);
        }

        if (this.errorCallback) {
            this.errorCallback(evt);
        }
    }

    private onMessage(event: string, evt: PusherEvent) {
        const msg = evt;

        // This indicates a reply to a websocket request.
        // We ignore sequence number validation of message responses
        // and only focus on the purely server side event stream.
        if (msg?.seq_reply) {
            if (msg.error) {
                logWarning(msg);
            }
        } else if (this.eventCallback) {
            this.serverSequence = msg?.seq + 1;
            this.eventCallback({event, data: msg});
        }
    }

    private bindConnection(...args: Parameters<ConnectionManager['bind']>) {
        const [eventName, fn, ...rest] = args;

        if (typeof this.conn !== 'undefined') {
            // Assign the eventName to the function to differentiate from
            // pusher's own callbacks
            const callback = Object.assign(fn, {fnRef: this.serverUrl});

            // Verify that this callback is not already bound
            const callbacks = this.conn!.connection.callbacks.get(eventName);
            if (!callbacks.find((cb) => (cb.fn as typeof callback).fnRef === this.serverUrl)) {
                this.conn.connection.bind(eventName, callback, ...rest);
            }

            // If we try to bind a 'connected' event listener
            // we need to fire it immediately if it listen for the expected current state
            // This is used to ensure compatibility of Pusher.connection.bind
            // with mattermost's .onOpen()
            if (
                (eventName === 'connected') &&
                (this.connState === WebSocketReadyState.OPEN)
            ) {
                fn();
            }
        }
    }

    public bindChannel(channelName: string, ignoreSubscriptionErrors = true) {
        let channel: Channel | undefined;
        if (typeof this.conn !== 'undefined') {
            if (!this.conn.channel(channelName)) {
                channel = this.conn.subscribe(channelName);
                channel.bind_global((...args: Parameters<WebSocketClient['onMessage']>) => {
                    this.onMessage(...args);
                });
                if (!ignoreSubscriptionErrors) {
                    channel.bind('pusher:subscription_error', this.onError);
                }
            }
        }

        return channel;
    }

    public unbindChannel(channelOrName: Channel | string) {
        if (typeof this.conn !== 'undefined') {
            const channelName = typeof channelOrName === 'string' ? channelOrName : channelOrName.name;
            this.conn.unsubscribe(channelName);
        }
    }

    /**
     * Save on which channel the user is currently present on
     */
    private static getPresenceChannelName(channelId: string) {
        return `presence-channel.${channelId}`;
    }
    public bindPresenceChannel(channelId: string) {
        this.presenceChannel = this.bindChannel(WebSocketClient.getPresenceChannelName(channelId));
    }
    public unbindPresenceChannel() {
        if (typeof this.presenceChannel !== 'undefined') {
            this.unbindChannel(this.presenceChannel);
            delete this.presenceChannel;
        }
    }

    public setConnectingCallback(callback: () => void) {
        this.connectingCallback = callback;
    }

    public setEventCallback(callback: Function) {
        this.eventCallback = callback;
    }

    public setFirstConnectCallback(callback: () => void) {
        this.firstConnectCallback = callback;
    }

    public setMissedEventsCallback(callback: () => void) {
        this.missedEventsCallback = callback;
    }

    public setReconnectCallback(callback: () => void) {
        this.reconnectCallback = callback;
    }

    public setReliableReconnectCallback(callback: () => void) {
        this.reliableReconnectCallback = callback;
    }

    public setErrorCallback(callback: Function) {
        this.errorCallback = callback;
    }

    public setCloseCallback(callback: (connectFailCount: number) => void) {
        this.closeCallback = callback;
    }

    public close(stop = false) {
        this.stop = stop;
        this.connectFailCount = 0;
        this.responseSequence = 1;
        clearTimeout(this.connectionTimeout);
        clearInterval(this.pingInterval);
        this.conn?.disconnect();
    }

    public invalidate() {
        clearTimeout(this.connectionTimeout);

        // this.conn?.invalidate();
        this.conn = undefined;
    }

    private sendMessage(action: string, data: any, channel?: Channel) {
        const msg = {
            action,
            seq: this.responseSequence++,
            data,
        };

        if (this.conn && this.connState === WebSocketReadyState.OPEN) {
            if (typeof channel === 'undefined') {
                // Global message
                this.conn.send_event(action, msg);
            } else {
                // Channel message
                channel.trigger(action, msg);
            }
        } else if (!this.conn || this.connState === WebSocketReadyState.CLOSED) {
            this.conn = undefined;
            this.initialize(this.token);
        }
    }

    /**
     * Send a message on the current channel the user is currently present on
     */
    private sendPresenceMessage(action: string, data: any) {
        if (typeof this.presenceChannel !== 'undefined') {
            this.sendMessage(action, data, this.presenceChannel);
        }
    }

    public sendUserTypingEvent(userId: string, channelId: string, parentId?: string) {
        this.sendPresenceMessage(WebsocketEvents.TYPING, {
            channel_id: channelId,
            parent_id: parentId,
            user_id: userId,
        });
    }

    public sendUserRecordingEvent(userId: string, channelId: string, parentId?: string) {
        const TIMER = 1000;
        this.recordingInterval = setInterval(() => {
            this.sendPresenceMessage(WebsocketEvents.RECORDING, {
                channel_id: channelId,
                parent_id: parentId,
                user_id: userId,
            });
        }, TIMER);
    }

    public stopRecordingEvent() {
        if (this.recordingInterval !== null) {
            clearInterval(this.recordingInterval);
        }
    }

    public isConnected(): boolean {
        return this.connState === WebSocketReadyState.OPEN;
    }

    public getConnectionId(): string {
        return this.connectionId;
    }

    public getServerSequence(): number {
        return this.serverSequence;
    }
}
