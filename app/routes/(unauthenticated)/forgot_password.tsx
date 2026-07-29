// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useThemeByAppearanceWithDefault} from '@context/theme';
import {getLoginFlowHeaderOptions, useNavigationHeader} from '@hooks/navigation_header';
import {usePropsFromParams} from '@hooks/props_from_params';
import ForgotPasswordScreen from '@screens/login/forgot_password';

export default function ForgotPasswordRoute() {
    const {theme: themeProp, ...props} = usePropsFromParams<{theme: Theme}>();
    const theme = useThemeByAppearanceWithDefault(themeProp);

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: getLoginFlowHeaderOptions(theme),
    });

    return <ForgotPasswordScreen {...props} theme={theme}/>;
}
