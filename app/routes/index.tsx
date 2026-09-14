// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Redirect, type Href} from 'expo-router';
import {useEffect, useState} from 'react';

import {determineInitialExpoRoute, type ExpoRouterLaunchResult} from '@init/launch';
import {propsToParams} from '@screens/navigation';
import {logError, logInfo} from '@utils/log';

export default function RootIndex() {
    const [launchResult, setLaunchResult] = useState<ExpoRouterLaunchResult | null>(null);

    useEffect(() => {
        async function initializeLaunch() {
            try {
                const result = await determineInitialExpoRoute();
                setLaunchResult(result);
            } catch (error) {
                logError('RootIndex: determineInitialExpoRoute failed', error);
                setLaunchResult({route: '/(unauthenticated)/ik_login', params: {}});
            }
        }

        initializeLaunch();
    }, []);

    if (!launchResult) {
        return null;
    }

    logInfo('RootIndex: redirecting to', launchResult.route);
    const href: Href = {pathname: launchResult.route, params: propsToParams(launchResult.params)};
    return <Redirect href={href}/>;
}
