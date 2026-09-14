// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useIntl} from 'react-intl';

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {useIsTablet} from '@hooks/device';
import {getModalHeaderOptions, useNavigationHeader} from '@hooks/navigation_header';
import {usePropsFromParams} from '@hooks/props_from_params';
import EditServerScreen from '@screens/edit_server';
import {navigateBack} from '@screens/navigation';

import type ServersModel from '@typings/database/models/app/servers';

type Props = {
    closeButtonId?: string;
    server: ServersModel;
}

export default function EditServerRoute() {
    const intl = useIntl();
    const theme = useTheme();
    const isTablet = useIsTablet();
    const props = usePropsFromParams<Props>();

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: {
            headerTitle: isTablet ? intl.formatMessage({id: 'edit_server.title', defaultMessage: 'Edit Server'}) : '',
            ...getModalHeaderOptions(theme, navigateBack, 'close.edit_server.button'),
            headerTransparent: !isTablet,
            headerStyle: {
                backgroundColor: isTablet ? theme.sidebarBg : 'transparent',
            },
        },
    });

    return (
        <EditServerScreen
            componentId={Screens.EDIT_SERVER}
            theme={theme}
            {...props}
        />
    );
}
