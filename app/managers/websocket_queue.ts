// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {InteractionManager} from 'react-native';

import {handleWebSocketEvent} from '@actions/websocket/event';
import {WebsocketEvents} from '@constants';
import {logDebug, logWarning} from '@utils/log';

interface QueuedEvent {
    id: number;
    serverUrl: string;
    msg: WebSocketMessage;
    priority: number;
}

export class WebSocketEventQueue {
    private readonly maxConcurrent = 3;
    private readonly maxQueueSize = 100;

    private queue: QueuedEvent[] = [];
    private running = 0;
    private nextId = 0;

    push(serverUrl: string, msg: WebSocketMessage): void {
        if (this.queue.length >= this.maxQueueSize) {
            logDebug('[WebSocketEventQueue] Queue full, dropping event', msg.event);
            return;
        }

        const priority = this.getPriority(msg.event);
        const event: QueuedEvent = {
            id: this.nextId++,
            serverUrl,
            msg,
            priority,
        };

        const insertIndex = this.queue.findIndex((e) => e.priority > priority);
        if (insertIndex === -1) {
            this.queue.push(event);
        } else {
            this.queue.splice(insertIndex, 0, event);
        }

        this.process();
    }

    private getPriority(eventType: string): number {
        switch (eventType) {
            case WebsocketEvents.POSTED:
            case WebsocketEvents.POST_EDITED:
                return 1;
            case WebsocketEvents.STATUS_CHANGED:
            case WebsocketEvents.TYPING:
                return 3;
            default:
                return 2;
        }
    }

    private process(): void {
        if (this.running >= this.maxConcurrent || this.queue.length === 0) {
            return;
        }

        const event = this.queue.shift();
        if (!event) {
            return;
        }

        this.running++;

        const isDbHeavy = this.isDbHeavyEvent(event.msg.event);
        const process = async () => {
            try {
                await handleWebSocketEvent(event.serverUrl, event.msg);
            } catch (error) {
                logWarning('[WebSocketEventQueue] Error processing event', event.msg.event, error);
            } finally {
                this.running--;
                this.process();
            }
        };

        if (isDbHeavy) {
            InteractionManager.runAfterInteractions(() => {
                process();
            });
        } else {
            process();
        }
    }

    private isDbHeavyEvent(eventType: string): boolean {
        switch (eventType) {
            case WebsocketEvents.POSTED:
            case WebsocketEvents.POST_EDITED:
            case WebsocketEvents.POST_DELETED:
            case WebsocketEvents.POST_UNREAD:
            case WebsocketEvents.POST_ACKNOWLEDGEMENT_ADDED:
            case WebsocketEvents.POST_ACKNOWLEDGEMENT_REMOVED:
            case WebsocketEvents.CHANNEL_CREATED:
            case WebsocketEvents.CHANNEL_DELETED:
            case WebsocketEvents.CHANNEL_UPDATED:
            case WebsocketEvents.USER_ADDED:
            case WebsocketEvents.USER_REMOVED:
            case WebsocketEvents.CHANNEL_MEMBER_UPDATED:
            case WebsocketEvents.THREAD_UPDATED:
            case WebsocketEvents.THREAD_READ_CHANGED:
            case WebsocketEvents.THREAD_FOLLOW_CHANGED:
                return true;
            default:
                return false;
        }
    }
}
