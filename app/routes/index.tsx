// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import useDidMount from '@hooks/did_mount';
import {start} from '@init/app';
import {initialLaunch} from '@init/launch';
import {logError, logInfo} from '@utils/log';
import {captureException} from '@utils/sentry';

export default function InitialRoute() {
    useDidMount(() => {
        logInfo('[ExpoRouterBoot] InitialRoute mounted: start initialization');

        start().
            then(() => {
                logInfo('[ExpoRouterBoot] start() resolved: running initialLaunch()');
                return initialLaunch();
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
