// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {fetchAndSwitchToThread, summarizeThread} from '@actions/remote/thread';
import {BaseOption} from '@components/common_post_options';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {t} from '@i18n';
import {dismissBottomSheet} from '@screens/navigation';

import IconThreadSummarization from '../../../../components/illustrations/icon_thread_summarization';

import type PostModel from '@typings/database/models/servers/post';
import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    post: PostModel;
    bottomSheetId: AvailableScreens;
}

const SummarizeThread = ({post, bottomSheetId}: Props) => {
    const serverUrl = useServerUrl();
    const theme = useTheme();

    const handleSummarizeThread = (async () => {
        const summarizePost = await summarizeThread(serverUrl, post.id, 'euria');
        await dismissBottomSheet(bottomSheetId);
        fetchAndSwitchToThread(serverUrl, summarizePost.data.postid);
    });

    return (
        <BaseOption
            i18nId={t('ai.summarizeThread')}
            defaultMessage='Summarize Thread'
            customIcon={<IconThreadSummarization theme={theme}/>}
            onPress={handleSummarizeThread}
            testID='post_options.ai_summarize_thread.option'
        />
    );
};

export default SummarizeThread;
