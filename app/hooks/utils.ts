// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useEffect, useRef, type RefObject} from 'react';

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
};
