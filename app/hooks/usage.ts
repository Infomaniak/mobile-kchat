// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useEffect, useState} from 'react';

import {fetchCloudLimits} from '@actions/remote/cloud';
import {useServerUrl} from '@app/context/server';

export function useGetUsage(): any {
    // const isLoggedIn = useIsLoggedIn();
    // const cloudLimits = useSelector(getCloudLimits);

    // const cloudLimitsReceived = useSelector(getCloudLimitsLoaded);
    // const dispatch = useDispatch();
    const [usage, setUsage] = useState(undefined);
    const serverUrl = useServerUrl();
    useEffect(() => {
        let isMounted = true;
        (async () => {
            const result = await fetchCloudLimits(serverUrl);
            if (isMounted) {
                setUsage(result);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [serverUrl]);
    console.log('🚀 ~ useGetLimits ~ limits:', usage);
    return usage;

    // const result: [Limits, boolean] = useMemo(() => {
    //     return [cloudLimits, cloudLimitsReceived];
    // }, [cloudLimits, cloudLimitsReceived]);
    // return result;
}

export function useGetUsageDeltas(): any {
    // const isLoggedIn = useIsLoggedIn();
    // const cloudLimits = useSelector(getCloudLimits);

    // const cloudLimitsReceived = useSelector(getCloudLimitsLoaded);
    // const dispatch = useDispatch();
    const [limits, setLimits] = useState(undefined);
    const serverUrl = useServerUrl();
    useEffect(() => {
        let isMounted = true;
        (async () => {
            const result = await fetchCloudLimits(serverUrl);
            if (isMounted) {
                setLimits(result);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [serverUrl]);
    console.log('🚀 ~ useGetLimits ~ limits:', limits);
    return limits;

    // const result: [Limits, boolean] = useMemo(() => {
    //     return [cloudLimits, cloudLimitsReceived];
    // }, [cloudLimits, cloudLimitsReceived]);
    // return result;
}
