// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';

import {BaseOption} from '@components/common_post_options';
import {Screens} from '@constants';
import {dismissBottomSheet, navigateToScreen} from '@screens/navigation';

import type PostModel from '@typings/database/models/servers/post';

type Props = {
    post: PostModel;
}

const IKReminderOption = ({post}: Props) => {
    const onPress = useCallback(async () => {
        await dismissBottomSheet();

        navigateToScreen(Screens.IK_REMINDER, {postId: post.id});
    }, [post.id]);

    return (
        <BaseOption
            message={{id: 'infomaniak.post_info.post_reminder.menu', defaultMessage: 'Remind'}}
            onPress={onPress}
            iconName='bell-outline'
            testID='infomaniak.post_info.post_reminder.menu'
        />
    );
};

export default IKReminderOption;
