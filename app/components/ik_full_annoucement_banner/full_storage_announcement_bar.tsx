// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {

} from 'react-native';
import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';

import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {getQuotaDescription, type PackName} from '@hooks/plans';
import {useGetUsageDeltas} from '@hooks/usage';
import {openAsBottomSheet} from '@screens/navigation';

import AnnouncementBanner from '../announcement_banner/announcement_banner';

import WarningIcon from './alert';

import type {CloudUsageModel, LimitModel} from '@database/models/server';

type Props = {
    currentPackName?: PackName;
    isAdmin: boolean;
    limits: LimitModel;
    usage: CloudUsageModel;
}

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
        const quotaDescription = getQuotaDescription(currentPackName, isAdmin);

        openAsBottomSheet({
            closeButtonId: 'close-quota-exceeded',
            screen: Screens.INFOMANIAK_QUOTA_EXCEEDED,
            theme,
            title: '',
            props: {
                quotaType: {
                    title: 'infomaniak.size_quota_exceeded.title',
                    description: quotaDescription,
                    image: 'storage',
                },
            },
        });
    }, []);

    if (!isFull) {
        return null;
    }

    return (

        <AnnouncementBanner
            bannerColor={'#FFCCC8'}
            bannerDismissed={false}
            allowDismissal={false}
            bannerText={bannerText}
            icon={<WarningIcon/>}
            onCustomBannerAction={handlePress}
        />

    );
};

export default FullStorageAnnouncementBar;
