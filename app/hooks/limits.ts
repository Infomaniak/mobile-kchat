// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useEffect, useMemo, useState} from 'react';

import {fetchCloudLimits} from '@actions/remote/cloud';
import {useServerUrl} from '@app/context/server';
import {logError} from '@app/utils/log';

import type LimitsModel from '@app/database/models/server/limits';
import type {Limits} from '@typings/components/cloud';

export function useGetLimits(limits?: LimitsModel | undefined): [Limits | undefined, boolean] {
    const [limitsLoaded, setLimitsLoaded] = useState(false);
    const serverUrl = useServerUrl();

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                if (limits) {
                    await fetchCloudLimits(serverUrl);
                    setLimitsLoaded(true);
                }
            } catch (e) {
                logError('useGetLimits - ERROR', e);
                if (isMounted) {
                    setLimitsLoaded(false);
                }
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [serverUrl]);

    const result: [LimitsModel | undefined, boolean] = useMemo(() => {
        return [limits, limitsLoaded];
    }, [limits, limitsLoaded]);

    return result;
}
