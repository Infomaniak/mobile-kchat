// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Redirect, type Href} from 'expo-router';
import {useEffect, useState} from 'react';

import {determineInitialExpoRoute, type ExpoRouterLaunchResult} from '@init/launch';

export default function RootIndex() {
    const [launchResult, setLaunchResult] = useState<ExpoRouterLaunchResult | null>(null);

    useEffect(() => {
        async function initializeLaunch() {
            const result = await determineInitialExpoRoute();
            setLaunchResult(result);
        }

        initializeLaunch();
    }, []);

    if (!launchResult) {
        return null;
    }

    const href: Href = {pathname: launchResult.route, params: launchResult.params};
    return <Redirect href={href}/>;
}
