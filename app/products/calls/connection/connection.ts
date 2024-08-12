// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {RTCPeer} from '@mattermost/calls/lib';
import {DeviceEventEmitter, type EmitterSubscription} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {mediaDevices, MediaStream, MediaStreamTrack} from 'react-native-webrtc';

import {type CallsConnection} from '@calls/types/calls';
import {WebsocketEvents} from '@constants';
import {getServerCredentials} from '@init/credentials';
import NetworkManager from '@managers/network_manager';
import {logDebug, logError} from '@utils/log';

import {WebSocketClient, wsReconnectionTimeoutErr} from './websocket_client';

import type {EmojiData} from '@mattermost/calls/lib/types';

const peerConnectTimeout = 5000;

export async function newConnection(
    serverUrl: string,
    channelID: string,
    closeCb: (err?: Error) => void,
    setScreenShareURL: (url: string) => void,
    hasMicPermission: boolean,
    title?: string,
    rootId?: string,
) {
    let peer: RTCPeer | null = null;
    let stream: MediaStream;
    let voiceTrackAdded = false;
    let voiceTrack: MediaStreamTrack | null = null;
    let isClosed = false;
    let onCallEnd: EmitterSubscription | null = null;
    const streams: MediaStream[] = [];

    const initializeVoiceTrack = async () => {
        if (voiceTrack) {
            return;
        }

        try {
            stream = await mediaDevices.getUserMedia({
                video: false,
                audio: true,
            }) as MediaStream;
            voiceTrack = stream.getAudioTracks()[0];
            voiceTrack.enabled = false;
            streams.push(stream);
        } catch (err) {
            logError('calls: unable to get media device:', err);
        }
    };

    // getClient can throw an error, which will be handled by the caller.
    const client = NetworkManager.getClient(serverUrl);
    const credentials = await getServerCredentials(serverUrl);

    const ws = new WebSocketClient(serverUrl, client.getWebSocketUrl(), credentials?.token);

    // Throws an error, to be caught by caller.
    await ws.initialize();

    if (hasMicPermission) {
        initializeVoiceTrack();
    }

    const disconnect = (err?: Error) => {
        if (isClosed) {
            return;
        }
        isClosed = true;

        ws.send('leave');
        ws.close();

        if (onCallEnd) {
            onCallEnd.remove();
            onCallEnd = null;
        }

        streams.forEach((s) => {
            s.getTracks().forEach((track: MediaStreamTrack) => {
                track.stop();
                track.release();
            });
        });

        peer?.destroy();
        peer = null;
        InCallManager.stop();

        if (closeCb) {
            closeCb(err);
        }
    };

    onCallEnd = DeviceEventEmitter.addListener(WebsocketEvents.CALLS_CALL_END, ({channelId}: { channelId: string }) => {
        if (channelId === channelID) {
            disconnect();
        }
    });

    const mute = () => {
        if (!peer || !voiceTrack) {
            return;
        }

        try {
            if (voiceTrackAdded) {
                peer.replaceTrack(voiceTrack.id, null);
            }
        } catch (e) {
            logError('calls: from RTCPeer, error on mute:', e);
            return;
        }

        voiceTrack.enabled = false;
        if (ws) {
            ws.send('mute');
        }
    };

    const unmute = () => {
        if (!peer || !voiceTrack) {
            return;
        }

        try {
            if (voiceTrackAdded) {
                peer.replaceTrack(voiceTrack.id, voiceTrack);
            } else {
                peer.addStream(stream);
                voiceTrackAdded = true;
            }
        } catch (e) {
            logError('calls: from RTCPeer, error on unmute:', e);
            return;
        }

        voiceTrack.enabled = true;
        if (ws) {
            ws.send('unmute');
        }
    };

    const raiseHand = () => {
        if (ws) {
            ws.send('raise_hand');
        }
    };

    const unraiseHand = () => {
        if (ws) {
            ws.send('unraise_hand');
        }
    };

    const sendReaction = (emoji: EmojiData) => {
        if (ws) {
            ws.send('react', {
                data: JSON.stringify(emoji),
            });
        }
    };

    ws.on('error', (err: Error) => {
        logDebug('calls: ws error', err);
        if (err === wsReconnectionTimeoutErr) {
            disconnect();
        }
    });

    ws.on('close', (event: WebSocketCloseEvent) => {
        logDebug('calls: ws close, code:', event?.code, 'reason:', event?.reason, 'message:', event?.message);
    });

    ws.on('open', (originalConnID: string, prevConnID: string, isReconnect: boolean) => {
        if (isReconnect) {
            logDebug('calls: ws reconnect, sending reconnect msg');
            ws.send('reconnect', {
                channelID,
                originalConnID,
                prevConnID,
            });
        } else {
            logDebug('calls: ws open, sending join msg');
            ws.send('join', {
                channelID,
                title,
                threadID: rootId,
            });
        }
    });

    ws.on('message', ({data}: { data: string }) => {
        const msg = JSON.parse(data);
        if (!msg) {
            return;
        }
        if (msg.type !== 'ping') {
            logDebug('calls: remote signal', data);
        }
        if (msg.type === 'answer' || msg.type === 'candidate' || msg.type === 'offer') {
            peer?.signal(data);
        }
    });

    const waitForPeerConnection = () => {
        const waitForReadyImpl = (callback: () => void, fail: (reason: string) => void, timeout: number) => {
            if (timeout <= 0) {
                fail('timed out waiting for peer connection');
                return;
            }
            setTimeout(() => {
                if (peer?.connected) {
                    callback();
                } else {
                    waitForReadyImpl(callback, fail, timeout - 200);
                }
            }, 200);
        };

        return new Promise<void>((resolve, reject) => {
            waitForReadyImpl(resolve, reject, peerConnectTimeout);
        });
    };

    const connection: CallsConnection = {
        disconnect,
        mute,
        unmute,
        waitForPeerConnection,
        raiseHand,
        unraiseHand,
        sendReaction,
        initializeVoiceTrack,
    };

    return connection;
}
