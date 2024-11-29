// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';

import {Screens} from '@constants';
import {dismissBottomSheet, openAsBottomSheet} from '@screens/navigation';
import {BaseOption} from '@components/common_post_options';
import {useTheme} from '@context/theme';
import {t} from '@i18n';

import IconAI from '../../../components/illustrations/icon_ai';

import type PostModel from '@typings/database/models/servers/post';
import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    bottomSheetId: AvailableScreens;
    post: PostModel;
}
const AskAi = (props: Props) => {
    const {bottomSheetId, post} = props;
    const theme = useTheme();

    const onPress = useCallback(async () => {
        await dismissBottomSheet(bottomSheetId);

        openAsBottomSheet({
            closeButtonId: 'close-quota-exceeded',
            screen: Screens.AI_OPTIONS,
            theme,
            title: '',
            props: {
                post,
            },
        });
    }, [bottomSheetId, post]);
    return (
        <BaseOption
            i18nId={t('ai.actions')}
            defaultMessage='AI Actions'
            customIcon={<IconAI theme={theme}/>}
            onPress={onPress}
            testID='post_options.ask_ai.option'
        />
    );
};

export default AskAi;
