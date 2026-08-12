// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useNavigation} from 'expo-router';

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {getModalHeaderOptions, useNavigationHeader} from '@hooks/navigation_header';
import {usePropsFromParams} from '@hooks/props_from_params';
import ChannelInfoScreen from '@screens/channel_info';

type ChannelInfoRouteProps = {
    title: string;
    channelId: string;
}

export default function ChannelInfoRoute() {
    const navigation = useNavigation();
    const {title, channelId} = usePropsFromParams<ChannelInfoRouteProps>();
    const theme = useTheme();

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: {
            headerTitle: title,
            ...getModalHeaderOptions(theme, navigation.goBack, 'close.channel_info.button'),
        },
    });

    return (
        <ChannelInfoScreen
            channelId={channelId}
            componentId={Screens.CHANNEL_INFO as any}
            closeButtonId='close-channel-info'
        />
    );
}
