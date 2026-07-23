// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import useDidMount from '@hooks/did_mount';
import {logError, logInfo} from '@utils/log';
import {captureException} from '@utils/sentry';

export default function InitialRoute() {
    useDidMount(() => {
        logInfo('[ExpoRouterBoot] InitialRoute mounted: start initialization');

        Promise.resolve().
            then(async () => {
                logInfo('[ExpoRouterBoot] InitialRoute: importing @init/app');
                const appModule = await import('@init/app');
                logInfo('[ExpoRouterBoot] InitialRoute: imported @init/app', {
                    keys: Object.keys(appModule),
                    startType: typeof appModule.start,
                });

                logInfo('[ExpoRouterBoot] InitialRoute: importing @init/launch');
                const launchModule = await import('@init/launch');
                logInfo('[ExpoRouterBoot] InitialRoute: imported @init/launch', {
                    initialLaunchType: typeof launchModule.initialLaunch,
                    keys: Object.keys(launchModule),
                });

                logInfo('[ExpoRouterBoot] InitialRoute: calling start()');
                await appModule.start();

                logInfo('[ExpoRouterBoot] start() resolved: running initialLaunch()');
                await launchModule.initialLaunch();
            }).
            then(() => {
                logInfo('[ExpoRouterBoot] initialLaunch() resolved');
            }).
            catch((error) => {
                logError('[ExpoRouterBoot] InitialRoute boot failed', error);
                captureException(error);
            });
    });

    return null;
}
