// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ENABLE_PERF_MONITOR} from '@constants/dev_config';
import {logDebug} from '@utils/log';

interface SqliteMetric {
    query: string;
    count: number;
    totalTime: number;
    maxTime: number;
    lastTime: number;
    lastTimestamp: number;
}

interface DbCount {
    table: string;
    count: number;
    lastUpdated: number;
}

interface MemoryInfo {
    usedMemoryMB: number;
    totalMemoryMB: number;
    freeDiskMB: number;
    totalDiskMB: number;
    timestamp: number;
}

interface NetworkCallMetric {
    url: string;
    count: number;
    totalTime: number;
    maxTime: number;
    lastTime: number;
    lastTimestamp: number;
}

class PerformanceMonitorSingleton {
    private sqliteTimings: Map<string, SqliteMetric> = new Map();
    private dbCounts: Map<string, DbCount> = new Map();
    private networkCalls: Map<string, NetworkCallMetric> = new Map();
    private timeStarts: Map<string, number> = new Map();
    private isActive = ENABLE_PERF_MONITOR;
    private memoryInfo: MemoryInfo | null = null;
    public isEnabled(): boolean {
        return this.isActive;
    }

    public register(): void {
        (globalThis as any).__PERFORMANCE_MONITOR__ = this;
    }

    public startQuery(qId: string): void {
        if (!this.isActive) {
            return;
        }
        this.timeStarts.set(`sql_${qId}`, performance.now());
    }

    public endQuery(qId: string, sql: string): void {
        if (!this.isActive) {
            return;
        }
        const start = this.timeStarts.get(`sql_${qId}`);
        if (!start) {
            return;
        }
        const ms = performance.now() - start;
        this.timeStarts.delete(`sql_${qId}`);
        if (ms < 0.1) {
            return;
        }

        // Truncate very long SQL to keep it readable
        const cleaned = sql.length > 200 ? `${sql.substring(0, 197)}...` : sql;
        const prev = this.sqliteTimings.get(cleaned);
        if (prev) {
            prev.count++;
            prev.totalTime += ms;
            prev.maxTime = Math.max(prev.maxTime, ms);
            prev.lastTime = ms;
            prev.lastTimestamp = Date.now();
        } else {
            this.sqliteTimings.set(cleaned, {
                query: cleaned,
                count: 1,
                totalTime: ms,
                maxTime: ms,
                lastTime: ms,
                lastTimestamp: Date.now(),
            });
        }
    }

    public startNetworkCall(id: string): void {
        if (!this.isActive) {
            return;
        }
        this.timeStarts.set(`net_${id}`, performance.now());
    }

    public endNetworkCall(id: string, url: string): void {
        if (!this.isActive) {
            return;
        }
        const start = this.timeStarts.get(`net_${id}`);
        if (!start) {
            return;
        }
        const ms = performance.now() - start;
        this.timeStarts.delete(`net_${id}`);
        if (ms < 1) {
            return;
        }
        const prev = this.networkCalls.get(url);
        if (prev) {
            prev.count++;
            prev.totalTime += ms;
            prev.maxTime = Math.max(prev.maxTime, ms);
            prev.lastTime = ms;
            prev.lastTimestamp = Date.now();
        } else {
            this.networkCalls.set(url, {
                url,
                count: 1,
                totalTime: ms,
                maxTime: ms,
                lastTime: ms,
                lastTimestamp: Date.now(),
            });
        }
    }

    public setDbCounts(rows: Array<{table: string; count: number}>): void {
        if (!this.isActive) {
            return;
        }
        for (const {table, count} of rows) {
            this.dbCounts.set(table, {
                table,
                count,
                lastUpdated: Date.now(),
            });
        }
    }

    public setMemoryInfo(info: MemoryInfo): void {
        this.memoryInfo = info;
    }

    public getSqliteMetrics(): SqliteMetric[] {
        return Array.from(this.sqliteTimings.values()).
            sort((a, b) => b.maxTime - a.maxTime).
            slice(0, 20);
    }

    public getNetworkMetrics(): NetworkCallMetric[] {
        return Array.from(this.networkCalls.values()).
            sort((a, b) => b.maxTime - a.maxTime).
            slice(0, 20);
    }

    public getDbCounts(): DbCount[] {
        return Array.from(this.dbCounts.values()).
            sort((a, b) => b.count - a.count);
    }

    public getSummary(): {
        sqliteQueries: number;
        databaseRows: number;
        networkCalls: number;
        avgSqliteTime: number;
        avgNetworkTime: number;
        memoryInfo: MemoryInfo | null;
        } {
        const sqliteArray = Array.from(this.sqliteTimings.values());
        const totalSqliteTime = sqliteArray.reduce((sum, m) => sum + m.totalTime, 0);
        const totalSqliteCount = sqliteArray.reduce((sum, m) => sum + m.count, 0);
        const networkArray = Array.from(this.networkCalls.values());
        const totalNetworkTime = networkArray.reduce((sum, m) => sum + m.totalTime, 0);
        const totalNetworkCount = networkArray.reduce((sum, m) => sum + m.count, 0);
        return {
            sqliteQueries: this.sqliteTimings.size,
            databaseRows: Array.from(this.dbCounts.values()).reduce((sum, d) => sum + d.count, 0),
            networkCalls: this.networkCalls.size,
            avgSqliteTime: totalSqliteCount > 0 ? totalSqliteTime / totalSqliteCount : 0,
            avgNetworkTime: totalNetworkCount > 0 ? totalNetworkTime / totalNetworkCount : 0,
            memoryInfo: this.memoryInfo,
        };
    }

    public clearAll(): void {
        this.sqliteTimings.clear();
        this.dbCounts.clear();
        this.networkCalls.clear();
        this.timeStarts.clear();
        this.memoryInfo = null;
        logDebug('PerformanceMonitor: cleared');
    }
}

const instance = new PerformanceMonitorSingleton();
instance.register();
export default instance;
export type {SqliteMetric, DbCount, MemoryInfo, NetworkCallMetric};
