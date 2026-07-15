// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useDatabase} from '@nozbe/watermelondb/react';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, DeviceEventEmitter, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import CompassIcon from '@components/compass_icon';
import {Events} from '@constants';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import DatabaseManager from '@database/manager';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import {usePreventDoubleTap} from '@hooks/utils';
import PerformanceMonitor from '@managers/performance_monitor';
import {popTopScreen} from '@screens/navigation';
import {PerformanceProvider, usePerformanceData} from '@store/performance_store';
import {clearPerfPostsAndThreads, injectPerfPostsAndThreads} from '@utils/perf_data_injection';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type {AvailableScreens} from '@typings/screens/navigation';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.centerChannelBg,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: changeOpacity(theme.centerChannelColor, 0.16),
        },
        title: {
            ...typography('Heading', 300, 'SemiBold'),
            color: theme.centerChannelColor,
        },
        closeButton: {
            padding: 4,
        },
        section: {
            marginTop: 24,
            paddingHorizontal: 16,
        },
        sectionTitle: {
            ...typography('Body', 200, 'SemiBold'),
            color: theme.centerChannelColor,
            marginBottom: 12,
            textTransform: 'uppercase',
            opacity: 0.72,
        },
        metricCard: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.06),
            borderRadius: 8,
            padding: 16,
            marginBottom: 8,
        },
        metricRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 4,
        },
        metricLabel: {
            ...typography('Body', 200, 'Regular'),
            color: theme.centerChannelColor,
            opacity: 0.8,
        },
        metricValue: {
            ...typography('Body', 200, 'SemiBold'),
            color: theme.centerChannelColor,
        },
        button: {
            backgroundColor: theme.buttonBg,
            borderRadius: 4,
            paddingVertical: 8,
            paddingHorizontal: 16,
            alignSelf: 'center',
            marginTop: 24,
            marginBottom: 24,
        },
        buttonText: {
            ...typography('Body', 200, 'SemiBold'),
            color: theme.buttonColor,
        },
        disabledText: {
            ...typography('Body', 300, 'Regular'),
            color: theme.centerChannelColor,
            textAlign: 'center',
            marginTop: 40,
            opacity: 0.48,
        },
    };
});

interface MetricsSummaryProps {
    componentId: AvailableScreens;
}

function formatTime(ms: number): string {
    return `${ms.toFixed(1)}ms`;
}

// Simulate database corruption by emitting the exact event the real corruption path uses.
// This triggers the same recovery flow (GlobalEventHandler → attemptServerDatabaseRecovery).
async function simulateDatabaseCorruption(serverUrl: string): Promise<void> {
    const serverDb = DatabaseManager.serverDatabases[serverUrl];
    if (!serverDb) {
        throw new Error(`No active database found for server ${serverUrl}`);
    }

    const fakeError = new Error('database disk image is malformed');
    DeviceEventEmitter.emit(Events.DATABASE_CORRUPTION_DETECTED, {
        database: serverDb.database,
        error: fakeError,
        source: 'debug_simulation',
    });
}

function MetricsSummary({componentId}: MetricsSummaryProps) {
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const database = useDatabase();
    const {data, refreshDbCounts} = usePerformanceData();

    const close = useCallback(() => {
        popTopScreen(componentId);
    }, [componentId]);

    useAndroidHardwareBackHandler(componentId, close);

    useEffect(() => {
        if (PerformanceMonitor.isEnabled() && database) {
            refreshDbCounts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClear = usePreventDoubleTap(useCallback(() => {
        PerformanceMonitor.clearAll();
    }, []));

    const [injectionStatus, setInjectionStatus] = useState<string>('');
    const [isInjecting, setIsInjecting] = useState(false);
    const [corruptionStatus, setCorruptionStatus] = useState<string>('');
    const serverUrl = useServerUrl();
    const isPreprod = serverUrl?.includes('preprod.dev.infomaniak.ch') ?? false;

    const handleSimulateCorruption = useCallback(() => {
        if (!serverUrl) {
            return;
        }
        Alert.alert(
            'Simulate Database Corruption',
            'This will corrupt the current server database file to trigger the automatic recovery flow. The app will attempt to recover on the next database operation.\n\n⚠️ This is for testing only and requires a restart or navigation to trigger recovery.',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Corrupt DB',
                    style: 'destructive',
                    onPress: async () => {
                        setCorruptionStatus('Corrupting database file...');
                        try {
                            await simulateDatabaseCorruption(serverUrl);
                            setCorruptionStatus('Database corrupted successfully. Recovery will trigger on next DB access.');
                        } catch (err: any) {
                            const message = err?.message ?? String(err);
                            setCorruptionStatus(`Error: ${message}`);
                        }
                    },
                },
            ],
            {cancelable: true},
        );
    }, [serverUrl]);

    const handleInjectData = useCallback(() => {
        if (isInjecting) {
            return;
        }
        Alert.alert(
            'Inject Performance Data',
            'This will insert 200,000 posts and threads. This operation is irreversible. Continue?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Inject',
                    style: 'destructive',
                    onPress: async () => {
                        setIsInjecting(true);
                        setInjectionStatus('Injecting...');
                        try {
                            const result = await injectPerfPostsAndThreads(serverUrl, 200000);
                            setInjectionStatus(`Injected ${result.postsInserted} rows in ${result.durationMs.toFixed(0)}ms`);
                            await refreshDbCounts();
                        } catch (err: any) {
                            const message = err?.message ?? String(err);
                            setInjectionStatus(`Error: ${message}`);
                        } finally {
                            setIsInjecting(false);
                        }
                    },
                },
            ],
            {cancelable: true},
        );
    }, [isInjecting, serverUrl, refreshDbCounts]);

    const handleClearPerfData = useCallback(() => {
        if (isInjecting) {
            return;
        }
        Alert.alert(
            'Clear Performance Data',
            'This will remove all perf-test posts and threads. Continue?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        setIsInjecting(true);
                        setInjectionStatus('Clearing...');
                        try {
                            await clearPerfPostsAndThreads(serverUrl);
                            setInjectionStatus('Cleared perf data');
                            await refreshDbCounts();
                        } catch (err: any) {
                            const message = err?.message ?? String(err);
                            setInjectionStatus(`Error: ${message}`);
                        } finally {
                            setIsInjecting(false);
                        }
                    },
                },
            ],
            {cancelable: true},
        );
    }, [isInjecting, serverUrl, refreshDbCounts]);

    if (!PerformanceMonitor.isEnabled()) {
        return (
            <SafeAreaView
                style={styles.container}
                edges={['bottom']}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>{'Performance Monitor'}</Text>
                    <TouchableOpacity
                        onPress={close}
                        style={styles.closeButton}
                        testID='debug_performance.close.button'
                    >
                        <CompassIcon
                            name='close'
                            size={24}
                            color={theme.centerChannelColor}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.disabledText}>
                    {'Performance monitoring is disabled.'}
                </Text>
            </SafeAreaView>
        );
    }

    const summary = data.summary;
    const topQueries = data.sqliteQueries.slice(0, 10);
    const topNetworkCalls = data.networkCalls.slice(0, 10);
    const dbCounts = data.databaseCounts;
    const memoryInfo = summary.memoryInfo;

    return (
        <SafeAreaView
            style={styles.container}
            edges={['bottom']}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{'Performance Monitor'}</Text>
                <TouchableOpacity
                    onPress={close}
                    style={styles.closeButton}
                    testID='debug_performance.close.button'
                >
                    <CompassIcon
                        name='close'
                        size={24}
                        color={theme.centerChannelColor}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView>
                {/* Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{'Summary'}</Text>
                    <View style={styles.metricCard}>
                        <View style={styles.metricRow}>
                            <Text style={styles.metricLabel}>{'SQLite queries'}</Text>
                            <Text style={styles.metricValue}>{summary.sqliteQueries}</Text>
                        </View>
                        <View style={styles.metricRow}>
                            <Text style={styles.metricLabel}>{'DB rows tracked'}</Text>
                            <Text style={styles.metricValue}>{summary.databaseRows}</Text>
                        </View>
                        <View style={styles.metricRow}>
                            <Text style={styles.metricLabel}>{'Network calls tracked'}</Text>
                            <Text style={styles.metricValue}>{summary.networkCalls}</Text>
                        </View>
                        <View style={styles.metricRow}>
                            <Text style={styles.metricLabel}>{'Avg SQLite time'}</Text>
                            <Text style={styles.metricValue}>{formatTime(summary.avgSqliteTime)}</Text>
                        </View>
                        <View style={styles.metricRow}>
                            <Text style={styles.metricLabel}>{'Avg Network time'}</Text>
                            <Text style={styles.metricValue}>{formatTime(summary.avgNetworkTime)}</Text>
                        </View>
                    </View>
                </View>

                {/* Memory */}
                {memoryInfo && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{'Memory'}</Text>
                        <View style={styles.metricCard}>
                            <View style={styles.metricRow}>
                                <Text style={styles.metricLabel}>{'Used Memory'}</Text>
                                <Text style={styles.metricValue}>{`${memoryInfo.usedMemoryMB.toFixed(1)} MB / ${memoryInfo.totalMemoryMB.toFixed(1)} MB`}</Text>
                            </View>
                            <View style={styles.metricRow}>
                                <Text style={styles.metricLabel}>{'Free Disk'}</Text>
                                <Text style={styles.metricValue}>{`${memoryInfo.freeDiskMB.toFixed(1)} MB / ${memoryInfo.totalDiskMB.toFixed(1)} MB`}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Database Counts */}
                {dbCounts.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.metricRow}>
                            <Text style={styles.sectionTitle}>{'Database Counts'}</Text>
                        </View>
                        <View style={styles.metricCard}>
                            {dbCounts.map(({table, count}) => (
                                <View
                                    key={table}
                                    style={styles.metricRow}
                                >
                                    <Text style={styles.metricLabel}>{table}</Text>
                                    <Text style={styles.metricValue}>{count}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Slowest SQL Queries */}
                {topQueries.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{'Slowest SQL Queries (top 10)'}</Text>
                        {topQueries.map((query, idx) => (
                            <View
                                key={idx}
                                style={styles.metricCard}
                            >
                                <Text style={[styles.metricLabel, {marginBottom: 8, opacity: 1}]}>{query.query}</Text>
                                <View style={styles.metricRow}>
                                    <Text style={styles.metricLabel}>{'Avg / Max / Last'}</Text>
                                    <Text style={styles.metricValue}>
                                        {`${formatTime(query.totalTime / query.count)} / ${formatTime(query.maxTime)} / ${formatTime(query.lastTime)}`}
                                    </Text>
                                </View>
                                <View style={styles.metricRow}>
                                    <Text style={styles.metricLabel}>{'Count'}</Text>
                                    <Text style={styles.metricValue}>{query.count}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Slowest Network Calls */}
                {topNetworkCalls.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{'Slowest Network Calls (top 10)'}</Text>
                        {topNetworkCalls.map((call, idx) => (
                            <View
                                key={idx}
                                style={styles.metricCard}
                            >
                                <Text style={[styles.metricLabel, {marginBottom: 8, opacity: 1}]}>{call.url}</Text>
                                <View style={styles.metricRow}>
                                    <Text style={styles.metricLabel}>{'Avg / Max / Last'}</Text>
                                    <Text style={styles.metricValue}>
                                        {`${formatTime(call.totalTime / call.count)} / ${formatTime(call.maxTime)} / ${formatTime(call.lastTime)}`}
                                    </Text>
                                </View>
                                <View style={styles.metricRow}>
                                    <Text style={styles.metricLabel}>{'Count'}</Text>
                                    <Text style={styles.metricValue}>{call.count}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Perf Data Injection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{'Perf Data Injection'}</Text>
                    {!isPreprod && (
                        <Text style={[styles.metricLabel, {textAlign: 'center', marginBottom: 8}]}>
                            {'This action is only available in preprod environments.'}
                        </Text>
                    )}
                    {isInjecting && (
                        <Text style={[styles.metricLabel, {textAlign: 'center', marginBottom: 8}]}>
                            {'Loading...'}
                        </Text>
                    )}
                    <TouchableOpacity
                        style={[styles.button, (!isPreprod || isInjecting) && {opacity: 0.5}]}
                        onPress={isPreprod && !isInjecting ? handleInjectData : undefined}
                        testID='debug_performance.inject.button'
                    >
                        <Text style={styles.buttonText}>{'Inject 200k Posts + Threads'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, {marginTop: 8}, (!isPreprod || isInjecting) && {opacity: 0.5}]}
                        onPress={isPreprod && !isInjecting ? handleClearPerfData : undefined}
                        testID='debug_performance.clear_perf.button'
                    >
                        <Text style={styles.buttonText}>{'Clear Perf Data'}</Text>
                    </TouchableOpacity>
                    {injectionStatus !== '' && (
                        <Text style={[styles.metricLabel, {textAlign: 'center', marginTop: 8}]}>{injectionStatus}</Text>
                    )}
                </View>

                {/* Database Corruption Simulation (Dev only) */}
                {__DEV__ && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{'Database Corruption Test'}</Text>
                        {corruptionStatus !== '' && (
                            <Text style={[styles.metricLabel, {textAlign: 'center', marginBottom: 8}]}>
                                {corruptionStatus}
                            </Text>
                        )}
                        <TouchableOpacity
                            style={[styles.button, {backgroundColor: '#C92A2A'}]}
                            onPress={handleSimulateCorruption}
                            testID='debug_performance.corrupt_db.button'
                        >
                            <Text style={styles.buttonText}>{'Simulate DB Corruption'}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleClear}
                    testID='debug_performance.clear.button'
                >
                    <Text style={styles.buttonText}>{'Clear Metrics'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

type DebugPerformanceProps = {
    componentId: AvailableScreens;
}

function DebugPerformanceWithContext(props: DebugPerformanceProps) {
    const database = useDatabase();
    return (
        <PerformanceProvider database={database}>
            <MetricsSummary componentId={props.componentId}/>
        </PerformanceProvider>
    );
}

export default DebugPerformanceWithContext;
