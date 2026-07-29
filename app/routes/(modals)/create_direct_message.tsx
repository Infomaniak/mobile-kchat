// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {usePropsFromParams} from '@hooks/props_from_params';
import Screen from '@screens/create_direct_message';

export default function Route() {
    const props = usePropsFromParams<Record<string, any>>();
    return <Screen {...props}/>;
}
