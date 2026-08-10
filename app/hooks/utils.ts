// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useCallback, useEffect, useMemo, useRef, useState, type RefObject} from 'react';

/**
 * Return a callback that forces a re-render
 */
export const useRerender = () => {
    const [, setState] = useState(0);
    return useCallback(() => {
        setState((n) => n + 1);
    }, []);
};

export const useTransientRef = <T extends unknown>(value: T): RefObject<T> => {
    const ref = useRef<T>(value);
    ref.current = value;
    return ref;
};

export const useMountedRef = () => {
    const mountedRef = useRef(false);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    return mountedRef;
};

const DELAY = 400;

export const usePreventDoubleTap = <T extends Function>(callback: T) => {
    const lastTapRef = useRef<{time: number; key: string | null}>({time: 0, key: null});

    return useCallback((...args: unknown[]) => {
        const now = Date.now();
        const key = args[0] && typeof args[0] === 'object' && 'id' in args[0] ? (args[0] as {id: string}).id : null;
        const last = lastTapRef.current;
        if (last.key === key && now - last.time < DELAY) {
            return;
        }
        lastTapRef.current = {time: now, key};
        callback(...args);
    }, [callback]);
};

export const useDebounce = <T extends Function>(callback: T, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const execute = useCallback((...args: unknown[]) => {
        cancel();
        timeoutRef.current = setTimeout(() => callback(...args), delay);
    }, [callback, delay, cancel]);

    return useMemo(() => {
        return Object.assign(execute, {cancel});
    }, [execute, cancel]);
};
