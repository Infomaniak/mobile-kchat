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

import WarningIcon from './warning';

import type {CloudUsageModel, LimitModel, PreferenceModel} from '@database/models/server';

type Props = {
    visibility?: PreferenceModel[];
    currentPackName: PackName |undefined;
    isAdmin: boolean;
    limits: LimitModel;
    usage: CloudUsageModel;
}

const TRESHOLD_ALMOST_FULL = -1073741824;

const AlmostFullStorageAnnouncementBar = ({
    visibility,
    currentPackName,
    isAdmin,
    limits,
    usage,
}: Props) => {
    const intl = useIntl();
    const bannerText = intl.formatMessage({
        id: 'almost_full_storage_announcement_bar.message',
        defaultMessage: 'Storage limit almost reached',
    });
    const theme = useTheme();

    const {storage} = useGetUsageDeltas(usage, limits);

    const isFull = storage >= 0;
    const isAlmostFull = !isFull && storage >= TRESHOLD_ALMOST_FULL;
    const shouldShow = isAlmostFull && visibility?.[0]?.value !== 'dismissed';
    const handlePress = useCallback(() => {
        const quotaDescription = getQuotaDescription(currentPackName, isAdmin);

        openAsBottomSheet({
            closeButtonId: 'close-quota-exceeded',
            screen: Screens.INFOMANIAK_QUOTA_EXCEEDED,
            theme,
            title: '',
            props: {
                quotaType: {
                    title: 'infomaniak.size_quota_almost_exceeded.title',
                    description: quotaDescription,
                    image: 'storage',
                },
            },
        });
    }, []);

    if (!shouldShow) {
        return null;
    }

    return (
        <AnnouncementBanner
            bannerColor={'#FFE7A5'}
            bannerDismissed={false}
            allowDismissal={false}
            bannerText={bannerText}
            icon={<WarningIcon/>}
            onCustomBannerAction={handlePress}
        />

    );
};

export default AlmostFullStorageAnnouncementBar;
