// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {getFreeDiskStorage, getTotalDiskCapacity, getTotalMemory, getUsedMemory} from 'react-native-device-info';

import PerformanceMonitor, {type MemoryInfo} from '@managers/performance_monitor';

import type {Database} from '@nozbe/watermelondb';

const REFRESH_INTERVAL = 3000;

interface SqliteQueryMetric {
    query: string;
    count: number;
    totalTime: number;
    maxTime: number;
    lastTime: number;
    lastTimestamp: number;
}

interface NetworkCallMetric {
    url: string;
    count: number;
    totalTime: number;
    maxTime: number;
    lastTime: number;
    lastTimestamp: number;
}

interface DbCountItem {
    table: string;
    count: number;
    lastUpdated: number;
}

interface PerformanceData {
    sqliteQueries: SqliteQueryMetric[];
    databaseCounts: DbCountItem[];
    networkCalls: NetworkCallMetric[];
    summary: {
        sqliteQueries: number;
        databaseRows: number;
        networkCalls: number;
        avgSqliteTime: number;
        avgNetworkTime: number;
        memoryInfo: MemoryInfo | null;
    };
    isLoading: boolean;
}

const defaultPerformanceData: PerformanceData = {
    sqliteQueries: [],
    databaseCounts: [],
    networkCalls: [],
    summary: {
        sqliteQueries: 0,
        databaseRows: 0,
        networkCalls: 0,
        avgSqliteTime: 0,
        avgNetworkTime: 0,
        memoryInfo: null,
    },
    isLoading: false,
};

const DB_TABLES = [
    'Post',
    'Channel',
    'MyChannel',
    'Thread',
    'User',
    'Team',
    'Preference',
    'File',
    'Reaction',
    'ChannelBookmark',
    'PostsInChannel',
    'PostsInThread',
    'Draft',
    'Category',
    'CategoryChannel',
    'CustomEmoji',
    'Config',
    'Group',
    'GroupMembership',
    'GroupChannel',
    'GroupTeam',
    'Conference',
    'ConferenceParticipant',
    'Role',
    'ScheduledPost',
    'TeamChannelHistory',
    'TeamSearchHistory',
    'ThreadsInTeam',
    'ThreadParticipant',
    'TeamThreadsSync',
    'MyChannelSettings',
    'MyTeam',
    'System',
    'ChannelInfo',
    'ChannelMembership',
    'TeamMembership',
];

function buildPerformanceData(): PerformanceData {
    if (!PerformanceMonitor.isEnabled()) {
        return {...defaultPerformanceData, isLoading: false};
    }
    return {
        sqliteQueries: PerformanceMonitor.getSqliteMetrics(),
        databaseCounts: PerformanceMonitor.getDbCounts(),
        networkCalls: PerformanceMonitor.getNetworkMetrics(),
        summary: PerformanceMonitor.getSummary(),
        isLoading: false,
    };
}

interface PerformanceContextValue {
    data: PerformanceData;
    refresh: () => void;
    refreshDbCounts: () => Promise<void>;
}

const PerformanceContext = createContext<PerformanceContextValue>({
    data: defaultPerformanceData,
    refresh: () => {}, // eslint-disable-line no-empty-function
    refreshDbCounts: () => Promise.resolve(), // eslint-disable-line no-empty-function
});

export function usePerformanceData() {
    return useContext(PerformanceContext);
}

export function PerformanceProvider({children, database}: {children: React.ReactNode; database?: Database}) {
    const [data, setData] = useState<PerformanceData>(defaultPerformanceData);
    const isFetchingRef = useRef(false);

    const refresh = useCallback(() => {
        setData(buildPerformanceData());
    }, []);

    const refreshDbCounts = useCallback(async () => {
        if (!database || !PerformanceMonitor.isEnabled() || isFetchingRef.current) {
            return;
        }
        isFetchingRef.current = true;
        setData((prev) => ({...prev, isLoading: true}));
        try {
            const counts = await Promise.all(
                DB_TABLES.map(async (table) => {
                    try {
                        const collection = database.get(table);
                        const records = await collection.query().fetch();
                        return {table, count: records.length};
                    } catch {
                        return {table, count: 0};
                    }
                }),
            );
            PerformanceMonitor.setDbCounts(counts);
            refresh();
        } catch (err) {
            // ignore
        } finally {
            isFetchingRef.current = false;
            setData((prev) => ({...prev, isLoading: false}));
        }
    }, [database, refresh]);

    useEffect(() => {
        if (!PerformanceMonitor.isEnabled()) {
            return undefined;
        }
        refresh();
        refreshDbCounts();
        const interval = setInterval(() => {
            refresh();
        }, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [refresh, refreshDbCounts]);

    useEffect(() => {
        if (!PerformanceMonitor.isEnabled()) {
            return undefined;
        }

        const pollMemory = async () => {
            try {
                const [usedMem, totalMem, freeDisk, totalDisk] = await Promise.all([
                    getUsedMemory(),
                    getTotalMemory(),
                    getFreeDiskStorage(),
                    getTotalDiskCapacity(),
                ]);

                PerformanceMonitor.setMemoryInfo({
                    usedMemoryMB: usedMem / (1024 * 1024),
                    totalMemoryMB: totalMem / (1024 * 1024),
                    freeDiskMB: freeDisk / (1024 * 1024),
                    totalDiskMB: totalDisk / (1024 * 1024),
                    timestamp: Date.now(),
                });
            } catch {
                // Device info may not be available on all platforms
            }
        };

        pollMemory();
        const memoryInterval = setInterval(pollMemory, REFRESH_INTERVAL);
        return () => clearInterval(memoryInterval);
    }, []);

    return (
        <PerformanceContext.Provider value={{data, refresh, refreshDbCounts}}>
            {children}
        </PerformanceContext.Provider>
    );
}
