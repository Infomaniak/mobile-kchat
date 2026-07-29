// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {usePropsFromParams} from '@hooks/props_from_params';
import SelectTeamScreen from '@screens/select_team';

export default function SelectTeamRoute() {
    const props = usePropsFromParams<Record<string, any>>();
    return <SelectTeamScreen {...props}/>;
}
