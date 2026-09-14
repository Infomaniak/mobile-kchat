// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {usePropsFromParams} from '@hooks/props_from_params';
import CustomStatusClearAfterScreen from '@screens/custom_status_clear_after';

export default function CustomStatusClearAfterRoute() {
    const props = usePropsFromParams<any>();
    return <CustomStatusClearAfterScreen {...props}/>;
}
