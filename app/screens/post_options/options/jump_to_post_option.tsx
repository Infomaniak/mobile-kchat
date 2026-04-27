// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {defineMessages, useIntl} from 'react-intl';

import {showPermalink} from '@actions/remote/permalink';
import {BaseOption} from '@components/common_post_options';
import {useServerUrl} from '@context/server';
import {dismissBottomSheet} from '@screens/navigation';

import type {AvailableScreens} from '@typings/screens/navigation';
import type PostModel from '@typings/database/models/servers/post';

type Props = {
    bottomSheetId: AvailableScreens;
    post: PostModel;
}

const messages = defineMessages({
    jumpToPost: {
        id: 'post.options.jump_to_post',
        defaultMessage: 'Jump to message',
    },
});

const JumpToPostOption = ({bottomSheetId, post}: Props) => {
    const intl = useIntl();
    const serverUrl = useServerUrl();

    const onHandlePress = useCallback(async () => {
        await dismissBottomSheet(bottomSheetId);
        showPermalink(serverUrl, '', post.id);
    }, [bottomSheetId, post.id, serverUrl]);

    return (
        <BaseOption
            message={messages.jumpToPost}
            iconName='location-arrow'
            onPress={onHandlePress}
            testID='post_options.jump_to_post.option'
        />
    );
};

export default React.memo(JumpToPostOption);
