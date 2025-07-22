// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {

} from 'react-native';
import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';

import {Screens} from '@app/constants';
import {useTheme} from '@app/context/theme';
import {isPaidPlan, type PackName} from '@app/hooks/plans';
import {useGetUsageDeltas} from '@app/hooks/usage';
import {openAsBottomSheet} from '@app/screens/navigation';

import AnnouncementBanner from '../announcement_banner/announcement_banner';

import WarningIcon from './alert';

import type {CloudUsageModel, LimitModel} from '@app/database/models/server';

type Props = {
    currentPackName?: PackName;
    isAdmin?: boolean;
    limits: LimitModel;
    usage: CloudUsageModel;
}

const quotaMessages = new Map<string, string>([
    ['admin|paid', 'file_upload.quota.exceeded.paidPlan.admin'],
    ['admin|free', 'file_upload.quota.exceeded.freePlan.admin'],
    ['user|_', 'file_upload.quota.exceeded'],
]);

const FullStorageAnnouncementBar = ({
    currentPackName,
    isAdmin,
    limits,
    usage,
}: Props) => {
    const intl = useIntl();
    const bannerText = intl.formatMessage({
        id: 'full_storage_announcement_bar.message',
        defaultMessage: 'Storage limit reached',
    });

    const theme = useTheme();

    const {storage} = useGetUsageDeltas(usage, limits);

    const isFull = storage >= 0;

    const handlePress = useCallback(() => {
        const isPaid = isPaidPlan(currentPackName);

        let role = 'user';
        let plan = '_';

        if (isAdmin) {
            role = 'admin';
            plan = isPaid ? 'paid' : 'free';
        }
        openAsBottomSheet({
            closeButtonId: 'close-quota-exceeded',
            screen: Screens.INFOMANIAK_QUOTA_EXCEEDED,
            theme,
            title: '',
            props: {
                quotaType: {
                    title: 'infomaniak.size_quota_exceeded.title',
                    description: quotaMessages.get(`${role}|${plan}`) ?? '',
                    image: 'storage',
                },
            },
        });
    }, []);

    // if (!isFull) {
    //     return null;
    // }

    return (

        <AnnouncementBanner
            bannerColor={'#FFCCC8'} // #FFE7A5
            bannerDismissed={false}
            bannerEnabled={true}
            allowDismissal={false}
            bannerText={bannerText}
            icon={<WarningIcon/>}
            onHandlePress={handlePress}
        />

    );
};

export default FullStorageAnnouncementBar;
