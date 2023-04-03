// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';

import {BaseOption} from '@components/common_post_options';
import {useServerUrl} from '@context/server';
import {t} from '@i18n';
import NetworkManager from '@managers/network_manager';
import {dismissBottomSheet} from '@screens/navigation';

import type PostModel from '@typings/database/models/servers/post';
import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    bottomSheetId: AvailableScreens;
    post: PostModel;
}
const IKTranslateOption = ({bottomSheetId, post}: Props) => {
    const serverUrl = useServerUrl();

    const onPress = useCallback(async () => {
        await dismissBottomSheet(bottomSheetId);
        try {
            const client = NetworkManager.getClient(serverUrl);
            await client.translatePost(post.id);
        } catch (e) {
            // do nothing
        }
    }, [bottomSheetId, post]);

    return (
        <BaseOption
            i18nId={t('infomaniak.post_info.post_translate.menu')}
            defaultMessage='Translate'
            onPress={onPress}
            iconName='format-letter-case'
            testID='infomaniak.post_info.post_translate.menu'
        />
    );
};

export default IKTranslateOption;
