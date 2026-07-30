// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {usePropsFromParams} from '@hooks/props_from_params';
import Screen from '@screens/convert_gm_to_channel';

export default function Route() {
    const props = usePropsFromParams<any>();
    return <Screen {...props}/>;
}
