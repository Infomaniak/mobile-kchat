// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useIntl} from 'react-intl';

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {getModalHeaderOptions, useNavigationHeader} from '@hooks/navigation_header';
import {usePropsFromParams} from '@hooks/props_from_params';
import LeaveChannelModalScreen from '@screens/leave_channel_modal';
import {navigateBack} from '@screens/navigation';

type Props = {
    channelId: string;
}

export default function LeaveChannelMembersRoute() {
    const intl = useIntl();
    const theme = useTheme();
    const props = usePropsFromParams<Props>();

    useNavigationHeader({
        showWhenPushed: true,
        headerOptions: {
            headerTitle: intl.formatMessage({id: 'channel_info.leave_channel', defaultMessage: 'Leave channel'}),
            ...getModalHeaderOptions(theme, navigateBack, 'close.leave_channel_members.button'),
        },
    });

    return (
        <LeaveChannelModalScreen
            {...props}
            componentId={Screens.LEAVE_CHANNEL_MEMBERS}
            inModal={true}
        />
    );
}
