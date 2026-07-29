// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useLocalSearchParams} from 'expo-router';
import {useTheme} from '@context/theme';
import {useServerUrl} from '@context/server';
import {getHeaderOptions, useNavigationHeader} from '@hooks/navigation_header';
import ChannelScreen from '@screens/channel';
import {useIntl} from 'react-intl';

export default function ChannelRoute() {
    const theme = useTheme();
    const intl = useIntl();
    const serverUrl = useServerUrl();
    const {channelId, displayName} = useLocalSearchParams<{channelId: string; displayName?: string}>();

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: {
            headerTitle: displayName || '',
            ...getHeaderOptions(theme),
        },
    });

    return (
        <ChannelScreen
            channelId={channelId}
            serverUrl={serverUrl}
        />
    );
}
