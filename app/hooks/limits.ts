// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useEffect, useState} from 'react';

import {fetchCloudLimits} from '@actions/remote/cloud';
import {useServerUrl} from '@app/context/server';
import {logError} from '@app/utils/log';

import type {Limits} from '@typings/components/cloud';

export function useGetLimits(): [Limits, boolean] {
    const [limits, setLimits] = useState<Limits>();
    const serverUrl = useServerUrl();
    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const result = await fetchCloudLimits(serverUrl);
                if (isMounted && result && typeof result === 'object') {
                    setLimits(result);
                }
                throw new Error('Invalid limits response');
            } catch (e) {
                logError('searchGroupsByName - ERROR', e);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [serverUrl]);

    return [limits, true];
}
