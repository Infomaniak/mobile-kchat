// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import RNUtils from '@mattermost/rnutils';
import {Q} from '@nozbe/watermelondb';
import {useDatabase} from '@nozbe/watermelondb/react';
import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {Notifications} from 'react-native-notifications';
import {combineLatest} from 'rxjs';
import {distinctUntilChanged, map as map$} from 'rxjs/operators';

import {MM_TABLES} from '@constants/database';
import {useAppState} from '@hooks/device';
import useDidUpdate from '@hooks/did_update';
import {observeAllMyChannelNotifyProps} from '@queries/servers/channel';
import {observeUnreadsAndMentions} from '@queries/servers/thread';
import {logDebug} from '@utils/log';

import type MyChannelModel from '@typings/database/models/servers/my_channel';

const {SERVER: {CHANNEL, MY_CHANNEL}} = MM_TABLES;

// Mirrors the legacy Home tab badge update (home.tsx): keep the iOS app icon
// badge in sync with the mention count, but never clear it while delivered
// notifications are still present in the notification center.
const updateAppIconBadge = (mentions: number) => {
    if (Platform.OS !== 'ios') {
        return;
    }

    RNUtils.getDeliveredNotifications().then((delivered) => {
        if (mentions === 0 && delivered.length > 0) {
            logDebug('Not updating badge count, since we have no mentions in the database, and the number of notifications in the notification center is', delivered.length);
            return;
        }

        logDebug('Setting the badge count based on database values to', mentions);
        Notifications.ios.setBadgeCount(mentions);
    });
};

export type TotalUnreadAndMentions = {
    unread: boolean;
    mentions: number;
};

// Observes the total unread and mention counts for the active server, mirroring
// the behavior of the legacy Home tab badge: mentions and unreads from all
// channels (excluding deleted ones) are combined with thread mentions and
// unreads (including DMs and GMs). Channels marked as "mention only"
// (mark_unread: 'mention') are muted, so they don't contribute to the counts.
// The legacy badge aggregated totals across all connected servers via
// subscribeAllServers; this hook intentionally scopes to the active server,
// as kChat connects to a single server in practice.
export const useTotalUnreadAndMentions = (): TotalUnreadAndMentions => {
    const database = useDatabase();
    const appState = useAppState();
    const [state, setState] = useState<TotalUnreadAndMentions>({unread: false, mentions: 0});

    useEffect(() => {
        const myChannels = database.get<MyChannelModel>(MY_CHANNEL).
            query(Q.on(CHANNEL, Q.where('delete_at', Q.eq(0)))).
            observeWithColumns(['is_unread', 'mentions_count']);
        const settings = observeAllMyChannelNotifyProps(database);
        const threads = observeUnreadsAndMentions(database, {includeDmGm: true});

        const subscription = combineLatest([myChannels, settings, threads]).pipe(
            map$(([mycs, notifyProps, threadUnreads]) => {
                let mentions = 0;
                let unread = false;
                for (const myChannel of mycs) {
                    const isMuted = notifyProps?.[myChannel.id]?.mark_unread === 'mention';
                    mentions += isMuted ? 0 : myChannel.mentionsCount;
                    unread = unread || (myChannel.isUnread && !isMuted);
                }

                return {unread: unread || threadUnreads.unreads, mentions: mentions + threadUnreads.mentions};
            }),
            distinctUntilChanged((prev, next) => prev.unread === next.unread && prev.mentions === next.mentions),
        ).subscribe(setState);

        return () => {
            subscription.unsubscribe();
        };
    }, [database]);

    useEffect(() => {
        updateAppIconBadge(state.mentions);
    }, [state.mentions]);

    // Re-sync the badge on background transitions (legacy behavior): a user
    // can swipe delivered notifications away from the Notification Center
    // without any DB change; the badge only catches up at the next
    // transition to background.
    useDidUpdate(() => {
        if (appState !== 'active') {
            updateAppIconBadge(state.mentions);
        }
    }, [state.mentions, appState !== 'active']);

    return state;
};
