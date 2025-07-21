// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {

} from 'react-native';
import React, {useCallback} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {Screens} from '@app/constants';
import {useTheme} from '@app/context/theme';
import {isPaidPlan} from '@app/hooks/plans';
import {useGetUsageDeltas} from '@app/hooks/usage';
import {openAsBottomSheet} from '@app/screens/navigation';
import {makeStyleSheetFromTheme} from '@app/utils/theme';

import AnnouncementBanner from '../announcement_banner/announcement_banner';

type Props = {
  visibility?: string;
  currentPackName?: any;
  isAdmin?: string;
}

const getStyle = makeStyleSheetFromTheme((theme: Theme) => ({

}));

const quotaMessages = new Map<string, string>([
    ['admin|paid', 'file_upload.quota.exceeded.paidPlan.admin'],
    ['admin|free', 'file_upload.quota.exceeded.admin'],
    ['user|_', 'file_upload.quota.exceeded'],
]);

const FullStorageAnnouncementBar = ({
    visibility,
    currentPackName,
    isAdmin,
}: Props) => {
    const intl = useIntl();
    const bannerText = intl.formatMessage({
        id: 'ik_announcement_banner.storage_limit_reached',
        defaultMessage: 'Limite de stockage atteinte',
    });
    const theme = useTheme();

    const {storage} = useGetUsageDeltas();

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

    if (!isFull) {
        return null;
    }

    return (
        <AnnouncementBanner
            bannerColor={'#FFCCC8'} // #FFE7A5
            bannerDismissed={false}
            bannerEnabled={true}
            allowDismissal={false}
            bannerText={bannerText}

            // icon={}
            onHandlePress={handlePress}
        />

    );
};

export default FullStorageAnnouncementBar;
