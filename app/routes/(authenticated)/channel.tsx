// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useLocalSearchParams} from 'expo-router';

import {useTheme} from '@context/theme';
import {getHeaderOptions, useNavigationHeader} from '@hooks/navigation_header';
import ChannelScreen from '@screens/channel';

export default function ChannelRoute() {
    const theme = useTheme();
    const {displayName} = useLocalSearchParams<{channelId: string; displayName?: string}>();

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: {
            headerTitle: displayName || '',
            ...getHeaderOptions(theme),
        },
    });

    return (
        <ChannelScreen/>
    );
}
