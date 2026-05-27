// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useDatabase} from '@nozbe/watermelondb/react';
import React, {useCallback, useEffect} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import CompassIcon from '@components/compass_icon';
import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import {usePreventDoubleTap} from '@hooks/utils';
import PerformanceMonitor from '@managers/performance_monitor';
import {popTopScreen} from '@screens/navigation';
import {PerformanceProvider, usePerformanceData} from '@store/performance_store';
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
