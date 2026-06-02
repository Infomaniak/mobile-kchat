// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {Alert} from 'react-native';

import {deletePost} from '@actions/remote/post';
import {BaseOption} from '@components/common_post_options';
import {useServerUrl} from '@context/server';
import {dismissBottomSheet} from '@screens/navigation';

import type PostModel from '@typings/database/models/servers/post';
import type UserModel from '@typings/database/models/servers/user';
import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    bottomSheetId: AvailableScreens;
    combinedPost?: Post | PostModel;
    post: PostModel;
    currentUser?: UserModel;
}

const messages = defineMessages({
    delete: {
        id: 'post_info.del',
        defaultMessage: 'Delete',
    },
});

const DeletePostOption = ({bottomSheetId, combinedPost, post}: Props) => {
    const serverUrl = useServerUrl();
    const {formatMessage} = useIntl();

    const onPress = useCallback(() => {
        const title = formatMessage({id: 'mobile.post.delete_title', defaultMessage: 'Delete Post'});
        const body = formatMessage({
            id: 'mobile.post.delete_question',
            defaultMessage: 'Are you sure you want to delete this post?',
        });

        Alert.alert(
            title,
            body,
            [{
                text: formatMessage({id: 'mobile.post.cancel', defaultMessage: 'Cancel'}),
                style: 'cancel',
            }, {
                text: formatMessage({id: 'post_info.del', defaultMessage: 'Delete'}),
                style: 'destructive',
                onPress: async () => {
                    await dismissBottomSheet(bottomSheetId);
                    deletePost(serverUrl, combinedPost || post);
                },
            }],
        );

    }, [bottomSheetId, combinedPost, formatMessage, post, serverUrl]);

    return (
        <BaseOption
            message={messages.delete}
            iconName='trash-can-outline'
            onPress={onPress}
            testID='post_options.delete_post.option'
            isDestructive={true}
        />
    );
};

export default DeletePostOption;
