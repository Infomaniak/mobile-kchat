// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {usePropsFromParams} from '@hooks/props_from_params';
import CallScreen from '@calls/screens/call_screen';

export default function CallRoute() {
    const props = usePropsFromParams<Record<string, any>>();
    return <CallScreen {...props}/>;
}
