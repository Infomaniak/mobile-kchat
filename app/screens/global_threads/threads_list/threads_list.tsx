// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {FlatList, type ListRenderItemInfo, StyleSheet} from 'react-native';

import {loadEarlierThreads, rescanTeamThreads, syncTeamThreads} from '@actions/remote/thread';
import Loading from '@components/loading';
import {General, Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {logDebug} from '@utils/log';

import EmptyState from './empty_state';
import EndOfList from './end_of_list';
import Thread from './thread';

import type ThreadModel from '@typings/database/models/servers/thread';

// The rescan downloads the whole team thread list, so throttle it: at most one per 30 minutes.
const RESCAN_INTERVAL = 30 * 60 * 1000;

type Props = {
    tab: GlobalThreadsTab;
    teamId: string;
    teammateNameDisplay: string;
    testID: string;
    threads: ThreadModel[];
    flatListRef: React.RefObject<FlatList<ThreadModel> | null>;
};

const styles = StyleSheet.create({
    messagesContainer: {
        flexGrow: 1,
    },
    empty: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center',
    },
    loadingStyle: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingTop: 16,
        paddingBottom: 8,
    },
});

const ThreadsList = ({
    tab,
    teamId,
    teammateNameDisplay,
    testID,
    threads,
    flatListRef,
}: Props) => {
    const serverUrl = useServerUrl();
    const theme = useTheme();

    const hasFetchedOnce = useRef(false);
    const lastRescanAtRef = useRef(0);
    const [isLoading, setIsLoading] = useState(false);
    const [endReached, setEndReached] = useState(false);
    const [isRefreshing, setRefreshing] = useState(false);

    const noThreads = !threads?.length;
    const lastThread = threads?.length > 0 ? threads[threads.length - 1] : null;

    const mountTimeRef = useRef(Date.now());
    const hasLoggedFirstRender = useRef(false);
    useEffect(() => {
        if (threads.length > 0 && !hasLoggedFirstRender.current) {
            hasLoggedFirstRender.current = true;
            const elapsed = Date.now() - mountTimeRef.current;
            logDebug('[ThreadsList] first render:', threads.length, 'threads in', elapsed, 'ms');
        }
    }, [threads.length]);

    useEffect(() => {
        if (hasFetchedOnce.current || tab !== 'all') {
            return;
        }

        // Display loading only when there are no threads
        if (!noThreads) {
            setIsLoading(true);
        }
        syncTeamThreads(serverUrl, teamId).then(() => {
            hasFetchedOnce.current = true;
        });
        if (!noThreads) {
            setIsLoading(false);
        }
    }, [noThreads, serverUrl, tab, teamId]);

    const listEmptyComponent = useMemo(() => {
        if (isLoading) {
            return (
                <Loading
                    color={theme.buttonBg}
                    containerStyle={styles.loadingStyle}
                />
            );
        }
        return (
            <EmptyState isUnreads={tab === 'unreads'}/>
        );
    }, [isLoading, theme, tab]);

    const hasThreads = threads.length > 0;

    const listFooterComponent = useMemo(() => {
        if (tab === 'unreads' || !hasThreads) {
            return null;
        }

        if (endReached) {
            return (
                <EndOfList/>
            );
        } else if (isLoading) {
            return (
                <Loading
                    color={theme.buttonBg}
                    containerStyle={styles.loadingStyle}
                />
            );
        }

        return null;
    }, [tab, hasThreads, endReached, isLoading, theme.buttonBg]);

    const triggerRescan = useCallback(() => {
        if (Date.now() - lastRescanAtRef.current <= RESCAN_INTERVAL) {
            return;
        }
        lastRescanAtRef.current = Date.now();
        rescanTeamThreads(serverUrl, teamId).then((result) => {
            if (result.error) {
                // Reset the throttle so the next pull retries a failed rescan
                lastRescanAtRef.current = 0;
            }
        });
    }, [serverUrl, teamId]);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);

        syncTeamThreads(serverUrl, teamId).finally(() => {
            setRefreshing(false);

            // Sequenced after the incremental sync so the two sync flows never race on the same
            // rows, and throttled since it downloads the whole team thread list. The UI never
            // awaits it: the loader stays fast (RM-625222). On failure the throttle is reset so
            // the next pull retries, and an in-flight rescan drops concurrent ones.
            triggerRescan();
        });
    }, [serverUrl, teamId, triggerRescan]);

    const handleEndReached = useCallback(() => {
        if (tab === 'unreads' || endReached || !lastThread) {
            return;
        }

        setIsLoading(true);
        loadEarlierThreads(serverUrl, teamId, lastThread.id).then((response) => {
            if (response.threads) {
                setEndReached(response.threads.length < General.CRT_CHUNK_SIZE);
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }, [endReached, serverUrl, tab, teamId, lastThread]);

    const renderItem = useCallback(({item}: ListRenderItemInfo<ThreadModel>) => (
        <Thread
            location={Screens.GLOBAL_THREADS}
            key={item.id}
            testID={testID}
            teammateNameDisplay={teammateNameDisplay}
            thread={item}
        />
    ), [teammateNameDisplay, testID]);

    return (
        <FlatList
            ListEmptyComponent={listEmptyComponent}
            ListFooterComponent={listFooterComponent}
            contentContainerStyle={threads.length ? styles.messagesContainer : styles.empty}
            data={threads}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            onEndReached={handleEndReached}
            onRefresh={handleRefresh}
            ref={flatListRef}
            refreshing={isRefreshing}
            renderItem={renderItem}
            testID={`${testID}.flat_list`}
            windowSize={7}
        />
    );
};

export default ThreadsList;
