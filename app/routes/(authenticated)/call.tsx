// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import CallScreen from '@calls/screens/call_screen';
import {usePropsFromParams} from '@hooks/props_from_params';

export default function CallRoute() {
    const props = usePropsFromParams<any>();
    return <CallScreen {...props}/>;
}
