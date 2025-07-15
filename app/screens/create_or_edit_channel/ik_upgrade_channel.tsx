// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import FormattedText from '@app/components/formatted_text';
import {General} from '@app/constants';
import {useTheme} from '@app/context/theme';
import {useGetLimits} from '@app/hooks/limits';
import {useGetUsage, useGetUsageDeltas} from '@app/hooks/usage';

import BannerBase, {bannerBaseStyles} from '../channel/channel_post_list/ik_upgrade_ksuite_banner/ik_banner_base';

type Props = {
    isPrivate?: boolean;
    isAdmin?: boolean;
};

// isAdmin: observeCurrentUser(database).pipe(
//             map((user) => isSystemAdmin(user?.roles || '')),
//             distinctUntilChanged(),
//         ),

const UpgradeChannelBanner = ({isPrivate, isAdmin}: Props) => {
    console.log('🚀 ~ UpgradeChannelBanner ~ isPrivate:', isPrivate);
    const theme = useTheme();
    const styles = bannerBaseStyles(theme);
    const channelType = isPrivate ? 'P' : 'O';
    const {public_channels: publicChannelsUsage, private_channels: privateChannelsUsage} = useGetUsage() || {};
    const {public_channels: publicChannelsLimit, private_channels: privateChannelsLimit} = useGetLimits() || {};
    const {public_channels: publicChannelsUsageDelta, private_channels: privateChannelsUsageDelta} = useGetUsageDeltas() || {};

    const publicChannelLimitReached = publicChannelsUsageDelta >= 0;
    const privateChannelLimitReached = privateChannelsUsageDelta >= 0;
    console.log('🚀 ~ UpgradeChannelBanner ~ privateChannelLimitReached:', privateChannelLimitReached);
    console.log('🚀 ~ UpgradeChannelBanner ~ publicChannelsUsageDelta:', publicChannelsUsageDelta);

    if ((channelType === General.OPEN_CHANNEL && !publicChannelLimitReached) || (channelType === General.PRIVATE_CHANNEL && !privateChannelLimitReached)) {
        return null;
    }

    console.log('🚀 ~ UpgradeChannelBanner ~ channelType:', channelType, isPrivate);
    console.log('🚀 ~ UpgradeChannelBanner ~ isAdmin:', isAdmin);
    console.log('🚀 ~ UpgradeChannelBanner ~ usage:', channelType === General.OPEN_CHANNEL ? publicChannelsUsage : privateChannelsUsage);
    console.log('🚀 ~ UpgradeChannelBanner ~ limit:', channelType === General.OPEN_CHANNEL ? publicChannelsLimit : privateChannelsLimit);
    return (
        <BannerBase
            title={
                <FormattedText
                    defaultMessage={'You have reached the limit of {type, select, O {public channels} P {private channels} other {}} ({usage, number}/{limit, number}) on your kSuite offer.'}
                    id='ksuite_free_banner_1'
                    style={styles.textTitle}
                    values={{
                        type: channelType,
                        isAdmin,
                        usage: channelType === General.OPEN_CHANNEL ? publicChannelsUsage : privateChannelsUsage,
                        limit: channelType === General.OPEN_CHANNEL ? publicChannelsLimit : privateChannelsLimit,
                    }}
                />
            }
            description={
                <FormattedText
                    defaultMessage={'To upgrade your plan, use the web interface.'}
                    id='ksuite_free_banner_3'
                    style={styles.textDescription}
                />
            }
        />
    );
};

export default UpgradeChannelBanner;

