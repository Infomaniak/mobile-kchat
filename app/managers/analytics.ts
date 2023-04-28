// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import MatomoTracker from 'matomo-tracker-react-native';
import {logInfo} from '@utils/log';

export class Analytics {
    matomoTracker: MatomoTracker | null = null;
    context: any;
    diagnosticId: string | undefined;

    userRoles: string | null = null;
    userId = '';
    tracker: Record<string, number> = {
        initialLoad: 0,
        channelSwitch: 0,
        teamSwitch: 0,
    };

    async init(config: ClientConfig) {
        this.diagnosticId = config.DiagnosticId;
    }

    async reset() {
        this.userId = '';
        this.userRoles = null;
    }

    setUserId(userId: string) {
        this.userId = userId;
        this.matomoTracker = new MatomoTracker({
            urlBase: 'https://analytics.infomaniak.com/',
            siteId: 13,
            userId: this.userId,
        });
    }

    setUserRoles(roles: string) {
        this.userRoles = roles;
    }

    trackEvent(category: string, event: string, props?: any) {
        if (!this.matomoTracker) {
            return;
        }

        this.matomoTracker.trackEvent({
            category,
            action: event,
            userInfo: {
                uid: this.userId,
            },
        });
    }

    recordTime(screenName: string, category: string, userId: string) {
        if (this.matomoTracker) {
            this.tracker[category] = 0;
            this.matomoTracker.trackScreenView({
                name: screenName,
                userInfo: {
                    uid: userId,
                },
            });
        }
    }

    trackAPI(event: string, props?: any) {
        if (!this.matomoTracker) {
            return;
        }

        this.trackEvent('api', event, props);
    }

    trackCommand(event: string, command: string, errorMessage?: string) {
        if (!this.matomoTracker) {
            return;
        }

        const sanitizedCommand = this.sanitizeCommand(command);
        let props: any;
        if (errorMessage) {
            props = {command: sanitizedCommand, error: errorMessage};
        } else {
            props = {command: sanitizedCommand};
        }

        this.trackEvent('command', event, props);
    }

    trackAction(event: string, props?: any) {
        if (!this.matomoTracker) {
            return;
        }
        this.trackEvent('action', event, props);
    }

    sanitizeCommand(userInput: string): string {
        const commandList = ['agenda', 'autolink', 'away', 'bot-server', 'code', 'collapse',
            'dnd', 'echo', 'expand', 'export', 'giphy', 'github', 'groupmsg', 'header', 'help',
            'invite', 'invite_people', 'jira', 'jitsi', 'join', 'kick', 'leave', 'logout', 'me',
            'msg', 'mute', 'nc', 'offline', 'online', 'open', 'poll', 'poll2', 'post-mortem',
            'purpose', 'recommend', 'remove', 'rename', 'search', 'settings', 'shortcuts',
            'shrug', 'standup', 'todo', 'wrangler', 'zoom'];
        const index = userInput.indexOf(' ');
        if (index === -1) {
            return userInput[0];
        }
        const command = userInput.substring(1, index);
        if (commandList.includes(command)) {
            return command;
        }
        return 'custom_command';
    }
}

const client = new Analytics();

export function create(): Analytics {
    return client;
}

export function get(): Analytics {
    return client;
}

export function invalidate(serverUrl: string) {
}

export default {
    create,
    get,
    invalidate,
};
