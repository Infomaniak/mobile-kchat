// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Pusher, {Channel} from 'pusher-js/react-native';

import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';
import {getConfig} from '@queries/servers/system';
import {toMilliseconds} from '@utils/datetime';
import {logError, logInfo} from '@utils/log';

const MAX_WEBSOCKET_FAILS = 7;
const MIN_WEBSOCKET_RETRY_TIME = toMilliseconds({seconds: 3});
const MAX_WEBSOCKET_RETRY_TIME = toMilliseconds({minutes: 5});

enum ConnectionState {
    initialized = 'initialized',
    connecting = 'connecting',
    connected = 'connected',
    unavailable = 'unavailable',
    failed = 'failed',
    disconnected = 'disconnected',
}

export default class WebSocketClient {
    private pusher?: Pusher;
    private teamChannel?: Channel;
    private userChannel?: Channel;
    private teamUserChannel?: Channel;
    private presenceChannel?: Channel;
    private connectionTimeout: any;
    private connectionId: string;

    // responseSequence is the number to track a response sent
    // via the websocket. A response will always have the same sequence number
    // as the request.
    private responseSequence: number;

    // serverSequence is the incrementing sequence number from the
    // server-sent event stream.
    private serverSequence: number;
    private connectFailCount: number;
    private eventCallback?: Function;
    private firstConnectCallback?: () => void;
    private missedEventsCallback?: () => void;
    private reconnectCallback?: () => void;
    private reliableReconnectCallback?: () => void;
    private errorCallback?: Function;
    private closeCallback?: (connectFailCount: number, lastDisconnect: number) => void;
    private connectingCallback?: () => void;
    private stop: boolean;
    private lastConnect: number;
    private lastDisconnect: number;
    private url = '';

    private serverUrl: string;
    private hasReliablyReconnect = false;

    constructor(serverUrl: string, lastDisconnect = 0) {
        this.connectionId = '';
        this.responseSequence = 1;
        this.serverSequence = 0;
        this.connectFailCount = 0;
        this.stop = false;
        this.serverUrl = serverUrl;
        this.lastConnect = 0;
        this.lastDisconnect = lastDisconnect;
    }

    public async initialize(opts = {}) {
        const defaults = {
            forceConnection: true,
        };

        const {forceConnection} = Object.assign({}, defaults, opts);

        if (forceConnection) {
            this.stop = false;
        }

        if (this.pusher && this.pusher.connection.state !== ConnectionState.disconnected) {
            return;
        }

        const database = DatabaseManager.serverDatabases[this.serverUrl]?.database;
        if (!database) {
            return;
        }

        const client = NetworkManager.getClient(this.serverUrl);
        const user = await client.getMe();
        if (!user) {
            return;
        }
        const bearerToken = client.getCurrentBearerToken();

        const config = await getConfig(database);
        const connectionUrl = (config.WebsocketURL || this.serverUrl);

        if (this.connectingCallback) {
            this.connectingCallback();
        }

        this.url = connectionUrl;

        Pusher.logToConsole = false;

        this.pusher = new Pusher('kchat-key', {
            wsHost: connectionUrl,
            httpHost: connectionUrl,
            authEndpoint: `${this.serverUrl}/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: bearerToken,
                },
            },
            enabledTransports: ['ws', 'wss'],
            disabledTransports: ['xhr_streaming', 'xhr_polling', 'sockjs'],
            activityTimeout: 10000,
            pongTimeout: 5000,
            unavailableTimeout: 3000,
            cluster: 'eu',
        });

        const reliableWebSockets = config.EnableReliableWebSockets === 'true';
        if (reliableWebSockets) {
            // Add connection id, and last_sequence_number to the query param.
            // We cannot also send it as part of the auth_challenge, because the session cookie is already sent with the request.
            this.url = `${connectionUrl}?connection_id=${this.connectionId}&sequence_number=${this.serverSequence}`;
        }

        if (this.connectFailCount === 0) {
            logInfo('websocket connecting to ' + this.url);
        }

        this.pusher!.connection.bind('connected', () => {
            this.lastConnect = Date.now();

            // No need to reset sequence number here.
            if (!reliableWebSockets) {
                this.serverSequence = 0;
            }

            if (this.connectFailCount > 0) {
                logInfo('websocket re-established connection to', this.url);
                if (!reliableWebSockets && this.reconnectCallback) {
                    this.reconnectCallback();
                } else if (reliableWebSockets) {
                    this.reliableReconnectCallback?.();
                    if (this.serverSequence && this.missedEventsCallback) {
                        this.missedEventsCallback();
                    }
                    this.hasReliablyReconnect = true;
                }
            } else if (this.firstConnectCallback) {
                logInfo('websocket connected to', this.url);
                this.firstConnectCallback();
            }

            this.connectFailCount = 0;
        });

        this.pusher!.connection.bind('disconnected', () => {
            const now = Date.now();
            if (this.lastDisconnect < this.lastConnect) {
                this.lastDisconnect = now;
            }

            this.pusher = undefined;
            this.responseSequence = 1;
            this.hasReliablyReconnect = false;

            if (this.connectFailCount === 0) {
                logInfo('websocket closed', this.serverUrl);
            }

            this.connectFailCount++;

            if (this.closeCallback) {
                this.closeCallback(this.connectFailCount, this.lastDisconnect);
            }

            if (this.stop) {
                return;
            }

            let retryTime = MIN_WEBSOCKET_RETRY_TIME;

            // If we've failed a bunch of connections then start backing off
            if (this.connectFailCount > MAX_WEBSOCKET_FAILS) {
                retryTime = MIN_WEBSOCKET_RETRY_TIME * this.connectFailCount;
                if (retryTime > MAX_WEBSOCKET_RETRY_TIME) {
                    retryTime = MAX_WEBSOCKET_RETRY_TIME;
                }
            }

            if (this.connectionTimeout) {
                clearTimeout(this.connectionTimeout);
            }

            this.connectionTimeout = setTimeout(
                () => {
                    if (this.stop) {
                        if (this.connectionTimeout) {
                            clearTimeout(this.connectionTimeout);
                        }
                        return;
                    }
                    this.initialize(opts);
                },
                retryTime,
            );
        });

        this.pusher!.connection.bind('error', (evt: any) => {
            if (evt.url === this.url) {
                this.hasReliablyReconnect = false;
                if (this.connectFailCount <= 1) {
                    logError('websocket error', this.url);
                    logError('WEBSOCKET ERROR EVENT', evt);
                }

                if (this.errorCallback) {
                    this.errorCallback(evt);
                }
            }
        });

        const onSubscriptionError = (error: any) => {
            if (this.connectFailCount <= 1) {
                logError('websocket error', this.url);
                logError('WEBSOCKET ERROR EVENT', error);
            }

            if (this.errorCallback) {
                this.errorCallback(error);
            }
        };

        this.teamChannel = this.pusher?.subscribe(`private-team.${user.team_id}`);
        this.userChannel = this.pusher?.subscribe(`presence-user.${user.user_id}`);
        this.teamUserChannel = this.pusher!.subscribe(`presence-teamUser.${user.id}`);

        this.bindChannelGlobally(this.teamChannel, onSubscriptionError);
        this.bindChannelGlobally(this.userChannel, onSubscriptionError);
        this.bindChannelGlobally(this.teamUserChannel);
    }

    subscribeAndBindPresenceChannel(channelId: string) {
        this.presenceChannel = this.pusher?.subscribe(`presence-channel.${channelId}`);
        if (this.presenceChannel) {
            this.bindChannelGlobally(this.presenceChannel);
        }
    }

    unsubscribeFromPresenceChannel(channelId: string) {
        this.pusher?.unsubscribe(`presence-channel.${channelId}`);
    }

    bindChannelGlobally(channel: Channel | undefined, onSubscriptionError: ((error: any) => void) | undefined = undefined) {
        channel?.bind_global((evt: any, data: any) => {
            /*
            console.log(`The event ${evt} was triggered with data`);
            console.log(data);
            */
            if (!data) {
                return;
            }

            // This indicates a reply to a websocket request.
            // We ignore sequence number validation of message responses
            // and only focus on the purely server side event stream.
            if (data.seq_reply) {
                if (data.error) {
                    console.warn(data); //eslint-disable-line no-console
                }
            } else if (this.eventCallback) {
                this.serverSequence = data.seq + 1;
                this.eventCallback({event: evt, data});
            }
        });
        if (onSubscriptionError) {
            channel?.bind('pusher:subscription_error', onSubscriptionError);
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

    public setCloseCallback(callback: (connectFailCount: number, lastDisconnect: number) => void) {
        this.closeCallback = callback;
    }

    public close(stop = false) {
        this.stop = stop;
        this.connectFailCount = 0;
        this.responseSequence = 1;
        this.hasReliablyReconnect = false;

        if (this.pusher && (this.pusher.connection.state === ConnectionState.connected || this.pusher.connection.state === ConnectionState.connecting)) {
            this.pusher.disconnect();
        }
    }

    public invalidate() {
        this.pusher = undefined;
    }

    private sendMessage(action: string, data: any) {
        const msg = {
            action,
            seq: this.responseSequence++,
            data,
        };

        if (this.pusher && this.pusher.connection.state === ConnectionState.connected) {
            this.presenceChannel?.trigger(action, msg);
        } else if (!this.pusher?.connection || this.pusher.connection.state === ConnectionState.disconnected) {
            this.pusher = undefined;
            this.initialize();
        }
    }

    public sendUserTypingEvent(userId: string, channelId: string, parentId?: string) {
        this.sendMessage('client-user_typing', {
            channel_id: channelId,
            parent_id: parentId,
            user_id: userId,
        });
    }

    public isConnected(): boolean {
        return this.pusher?.connection.state === ConnectionState.connected; // || (!this.stop && this.connectFailCount <= 2);
    }
}
