// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import useDidMount from '@hooks/did_mount';
import {start} from '@init/app';
import {initialLaunch} from '@init/launch';
import {captureException} from '@utils/sentry';

export default function InitialRoute() {
    useDidMount(() => {
        start().
            then(initialLaunch).
            catch(captureException);
    });

    return null;
}
