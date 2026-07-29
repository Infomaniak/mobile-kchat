// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useThemeByAppearanceWithDefault} from '@context/theme';
import {usePropsFromParams} from '@hooks/props_from_params';
import IkNoTeamsScreen from '@screens/ik_no_teams';

export default function IkNoTeamsRoute() {
    const {theme: themeProp, ...props} = usePropsFromParams<{theme: Theme}>();
    const theme = useThemeByAppearanceWithDefault(themeProp);

    return <IkNoTeamsScreen {...props} theme={theme}/>;
}
