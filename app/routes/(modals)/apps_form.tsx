// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {getModalHeaderOptions, useNavigationHeader} from '@hooks/navigation_header';
import {usePropsFromParams} from '@hooks/props_from_params';
import AppFormScreen from '@screens/apps_form';
import {navigateBack} from '@screens/navigation';

type Props = {
    form?: AppForm;
    context?: AppContext;
    title?: string;
}

export default function AppsFormRoute() {
    const theme = useTheme();
    const {title, ...props} = usePropsFromParams<Props>();

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: {
            headerTitle: title || '',
            ...getModalHeaderOptions(theme, navigateBack, 'close.apps_form.button'),
        },
    });

    return (
        <AppFormScreen
            componentId={Screens.APPS_FORM}
            {...props}
        />
    );
}
