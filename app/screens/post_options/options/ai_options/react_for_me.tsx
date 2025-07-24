// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {reactForMe} from '@actions/remote/thread';
import {BaseOption} from '@components/common_post_options';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {t} from '@i18n';
import {dismissBottomSheet} from '@screens/navigation';

import IconReactForMe from '../../../../components/illustrations/icon_react_for_me';

import type PostModel from '@typings/database/models/servers/post';
import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    post: PostModel;
    bottomSheetId: AvailableScreens;
}

const ReactForMe = (props: Props) => {
    const {bottomSheetId, post} = props;
    const serverUrl = useServerUrl();
    const theme = useTheme();

    const handleReactForMe = (async () => {
        await reactForMe(serverUrl, post.id);
        await dismissBottomSheet(bottomSheetId);
    });

    return (
        <BaseOption
            i18nId={t('ai.react_for_me')}
            defaultMessage='React for me'
            customIcon={<IconReactForMe theme={theme}/>}
            onPress={handleReactForMe}
            testID='post_options.react_for_me_thread.option'
        />
    );
};

export default ReactForMe;
