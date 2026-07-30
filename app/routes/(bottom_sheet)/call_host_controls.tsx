// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Screen from '@calls/screens/call_host_controls';
import {usePropsFromParams} from '@hooks/props_from_params';

export default function Route() {
    const props = usePropsFromParams<any>();
    return <Screen {...props}/>;
}
