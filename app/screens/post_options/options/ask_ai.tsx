// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';

import {BaseOption} from '@components/common_post_options';
import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {dismissBottomSheet, navigateToScreen} from '@screens/navigation';

import IconAI from '../../../components/illustrations/icon_ai';

import type PostModel from '@typings/database/models/servers/post';

const AskAi = ({post}: {post: PostModel}) => {
    const theme = useTheme();

    const onPress = useCallback(async () => {
        await dismissBottomSheet();
        navigateToScreen(Screens.AI_OPTIONS, {post});
    }, [post]);

    return (
        <BaseOption
            message={{id: 'ai.actions', defaultMessage: 'AI Actions'}}
            customIcon={<IconAI theme={theme}/>}
            onPress={onPress}
            testID='post_options.ask_ai.option'
        />
    );
};

export default AskAi;
