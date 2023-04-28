// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import ServerIcon from '@components/server_icon';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {subscribeAllServers} from '@database/subscription/servers';
import {subscribeUnreadAndMentionsByServer, type UnreadObserverArgs} from '@database/subscription/unreads';
import {useIsTablet} from '@hooks/device';
import {BUTTON_HEIGHT, TITLE_HEIGHT} from '@screens/bottom_sheet';
import {bottomSheet} from '@screens/navigation';
import {bottomSheetSnapPoint} from '@utils/helpers';
import {sortServersByDisplayName} from '@utils/server';

import ServerList, {AddServerButton} from './servers_list';

import type {BottomSheetProps} from '@gorhom/bottom-sheet';
import type ServersModel from '@typings/database/models/app/servers';
import type {UnreadMessages, UnreadSubscription} from '@typings/database/subscriptions';

export type ServersRef = {
    openServers: () => void;
}

export const SERVER_ITEM_HEIGHT = 72;
const subscriptions: Map<string, UnreadSubscription> = new Map();

const styles = StyleSheet.create({
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 10,
        top: 10,
        left: 16,
        width: 40,
        height: 40,
    },
});

const Servers = React.forwardRef<ServersRef>((_, ref) => {
    const intl = useIntl();
    const [total, setTotal] = useState<UnreadMessages>({mentions: 0, unread: false});
    const registeredServers = useRef<ServersModel[]|undefined>();
    const currentServerUrl = useServerUrl();
    const isTablet = useIsTablet();
    const {bottom} = useSafeAreaInsets();
    const theme = useTheme();

    const updateTotal = () => {
        let unread = false;
        let mentions = 0;
        subscriptions.forEach((value) => {
            unread = unread || value.unread;
            mentions += value.mentions;
        });
        setTotal({mentions, unread});
    };

    const unreadsSubscription = (serverUrl: string, {myChannels, settings, threadMentionCount, threadUnreads}: UnreadObserverArgs) => {
        const unreads = subscriptions.get(serverUrl);
        if (unreads) {
            let mentions = 0;
            let unread = Boolean(threadUnreads);
            for (const myChannel of myChannels) {
                const isMuted = settings?.[myChannel.id]?.mark_unread === 'mention';
                mentions += isMuted ? 0 : myChannel.mentionsCount;
                unread = unread || (myChannel.isUnread && !isMuted);
            }

            unreads.mentions = mentions + threadMentionCount;
            unreads.unread = unread;
            subscriptions.set(serverUrl, unreads);
            updateTotal();
        }
    };

    const serversObserver = async (servers: ServersModel[]) => {
        registeredServers.current = sortServersByDisplayName(servers, intl);

        // unsubscribe mentions from servers that were removed
        const allUrls = new Set(servers.map((s) => s.url));
        const subscriptionsToRemove = [...subscriptions].filter(([key]) => !allUrls.has(key));
        for (const [key, map] of subscriptionsToRemove) {
            map.subscription?.unsubscribe();
            subscriptions.delete(key);
            updateTotal();
        }

        for (const server of servers) {
            const {lastActiveAt, url} = server;
            if (lastActiveAt && (url !== currentServerUrl) && !subscriptions.has(url)) {
                const unreads: UnreadSubscription = {
                    mentions: 0,
                    unread: false,
                };
                subscriptions.set(url, unreads);
                unreads.subscription = subscribeUnreadAndMentionsByServer(url, unreadsSubscription);
            } else if ((!lastActiveAt || (url === currentServerUrl)) && subscriptions.has(url)) {
                subscriptions.get(url)?.subscription?.unsubscribe();
                subscriptions.delete(url);
                updateTotal();
            }
        }
    };

    const onPress = useCallback(() => {
        if (registeredServers.current?.length) {
            const renderContent = () => {
                return (
                    <ServerList servers={registeredServers.current!}/>
                );
            };

            const snapPoints: BottomSheetProps['snapPoints'] = [
                1,
                bottomSheetSnapPoint(Math.min(2.5, registeredServers.current.length), 72, bottom) + TITLE_HEIGHT + BUTTON_HEIGHT,
            ];
            if (registeredServers.current.length > 1) {
                snapPoints.push('80%');
            }

            const closeButtonId = 'close-your-servers';
            bottomSheet({
                closeButtonId,
                renderContent,
                snapPoints,
                theme,
                title: intl.formatMessage({id: 'your.servers', defaultMessage: 'Your servers'}),
            });
        }
    }, [bottom, isTablet, theme]);

    useImperativeHandle(ref, () => ({
        openServers: onPress,
    }), [onPress]);

    useEffect(() => {
        const subscription = subscribeAllServers(serversObserver);

        return () => {
            subscription?.unsubscribe();
            subscriptions.forEach((unreads) => {
                unreads.subscription?.unsubscribe();
            });
            subscriptions.clear();
        };
    }, []);

    return (
        <ServerIcon
            hasUnreads={total.unread}
            mentionCount={total.mentions}
            onPress={onPress}
            style={styles.icon}
            testID={'channel_list.servers.server_icon'}
        />
    );
});

Servers.displayName = 'Servers';

export default Servers;
