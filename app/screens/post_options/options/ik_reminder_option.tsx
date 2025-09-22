// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';

import {BaseOption} from '@components/common_post_options';
import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {t} from '@i18n';
import {dismissBottomSheet, openAsBottomSheet} from '@screens/navigation';

import type {CloudUsageModel, LimitModel} from '@database/models/server';
import type PostModel from '@typings/database/models/servers/post';
import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    bottomSheetId: AvailableScreens;
    post: PostModel;
    limits: LimitModel;
    usage: CloudUsageModel;
}
const IKReminderOption = ({bottomSheetId, post, usage, limits}: Props) => {
    const theme = useTheme();

    const onPress = useCallback(async () => {
        await dismissBottomSheet(bottomSheetId);

        openAsBottomSheet({
            closeButtonId: 'close-quota-exceeded',
            screen: Screens.INFOMANIAK_REMINDER,
            theme,
            title: '',
            props: {
                post,
                usage,
                limits,
            },
        });
    }, [bottomSheetId, post]);

    return (
        <BaseOption
            i18nId={t('infomaniak.post_info.post_reminder.menu')}
            defaultMessage='Remind'
            onPress={onPress}
            iconName='bell-outline'
            testID='infomaniak.post_info.post_reminder.menu'
        />
    );
};

export default IKReminderOption;
