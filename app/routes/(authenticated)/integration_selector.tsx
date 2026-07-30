// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {usePropsFromParams} from '@hooks/props_from_params';
import IntegrationSelectorScreen from '@screens/integration_selector';

export default function IntegrationSelectorRoute() {
    const props = usePropsFromParams<any>();
    return <IntegrationSelectorScreen {...props}/>;
}
