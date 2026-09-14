// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useThemeByAppearanceWithDefault} from '@context/theme';
import {usePropsFromParams} from '@hooks/props_from_params';
import IkLoginScreen from '@screens/ik_login';

import type {LaunchProps} from '@typings/launch';

export default function IkLoginRoute() {
    const {theme: themeProp, ...props} = usePropsFromParams<LaunchProps & {theme: Theme}>();
    const theme = useThemeByAppearanceWithDefault(themeProp);

    return (
        <IkLoginScreen
            {...props}
            theme={theme}
        />
    );
}
