// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PerformanceMonitor from '@managers/performance_monitor';
import {logDebug} from '@utils/log';

/**
 * Wraps a WatermelonDB SQLiteAdapter's dispatcher to instrument every
 * native call with performance.now() timing.
 * This is done at the adapter instance level, so it survives bundling
 * and requires zero changes to node_modules.
 */
export function instrumentAdapter(adapter: any): void {
    if (!PerformanceMonitor.isEnabled()) {
        return;
    }

    const dispatcher = adapter._dispatcher;
    if (!dispatcher || typeof dispatcher.call !== 'function') {
        return;
    }

    const originalCall = dispatcher.call.bind(dispatcher);
    dispatcher.call = function call(name: string, args: any[], callback: any) {
        const sqlInfo = ['query', 'queryAsArray', 'count', 'queryIds'].includes(name) && args[1] ? args[1] : name;
        const id = `wm_${name}_${sqlInfo}_${Math.random().toString(36).slice(2, 9)}`;
        PerformanceMonitor.startQuery(id);

        const wrappedCallback = (result: any) => {
            PerformanceMonitor.endQuery(id, `${name} ${sqlInfo}`);
            callback(result);
        };

        try {
            originalCall(name, args, wrappedCallback);
        } catch (e) {
            PerformanceMonitor.endQuery(id, `${name} ${sqlInfo}`);
            throw e;
        }
    };

    // Also wrap unsafeExecuteMultiple which bypasses call()
    const originalUnsafeExecute = adapter.unsafeExecuteMultiple;
    if (typeof originalUnsafeExecute === 'function') {
        adapter.unsafeExecuteMultiple = function unsafeExecuteMultiple(...execArgs: any[]) {
            const sqlInfo = 'unsafeExecuteMultiple';
            const id = `wm_unsafeExecuteMultiple_${Math.random().toString(36).slice(2, 9)}`;
            PerformanceMonitor.startQuery(id);
            try {
                const result = originalUnsafeExecute.apply(this, execArgs);
                PerformanceMonitor.endQuery(id, sqlInfo);
                return result;
            } catch (e) {
                PerformanceMonitor.endQuery(id, sqlInfo);
                throw e;
            }
        };
    }

    logDebug('PerformanceMonitor: Adapter instrumented');
}
