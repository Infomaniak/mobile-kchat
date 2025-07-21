// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useCallback, useEffect, useRef, useState, type RefObject} from 'react';

/**
 * Return a callback that forces a re-render
 */
export const useRerender = () => {
    const [, setState] = useState(0);
    return useCallback(() => {
        setState((n) => n + 1);
    }, []);
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
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
}

const DELAY = 750;

export const usePreventDoubleTap = <T extends Function>(callback: T) => {
    const lastTapRef = useRef<number | null>(null);

    return useCallback((...args: unknown[]) => {
        const now = Date.now();
        if (lastTapRef.current && now - lastTapRef.current < DELAY) {
            return;
        }
        lastTapRef.current = now;
        callback(...args);
    }, [callback]);
};
