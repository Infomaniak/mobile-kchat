// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useNavigation} from 'expo-router';
import {useIntl} from 'react-intl';

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {getModalHeaderOptions, useNavigationHeader} from '@hooks/navigation_header';
import BrowseChannelsScreen from '@screens/browse_channels';

export default function BrowseChannelsRoute() {
    const navigation = useNavigation();
    const intl = useIntl();
    const theme = useTheme();

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: {
            headerTitle: intl.formatMessage({id: 'browse_channels.title', defaultMessage: 'Browse channels'}),
            ...getModalHeaderOptions(theme, navigation.goBack, 'close.browse_channels.button'),
        },
    });

    return (
        <BrowseChannelsScreen
            componentId={Screens.BROWSE_CHANNELS}
            {...({closeButton: null, currentUserId: ''} as any)}
        />
    );
}
