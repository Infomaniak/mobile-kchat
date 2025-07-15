// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import FormattedText from '@app/components/formatted_text';
import {General} from '@app/constants';
import {useTheme} from '@app/context/theme';

import BannerBase, {bannerBaseStyles} from '../channel/channel_post_list/ik_upgrade_ksuite_banner/ik_banner_base';

type Props = {
    isPrivate?: boolean;
    isAdmin?: boolean;
    publicChannelsUsage?: number;
    privateChannelsUsage?: number;
    publicChannelsLimit?: number;
    privateChannelsLimit?: number;
    publicChannelLimitReached?: boolean;
    privateChannelLimitReached?: boolean;
};

const UpgradeChannelBanner = ({
    isPrivate,
    isAdmin,
    publicChannelsUsage,
    privateChannelsUsage,
    publicChannelsLimit,
    privateChannelsLimit,
    publicChannelLimitReached,
    privateChannelLimitReached,
}: Props) => {
    const theme = useTheme();
    const styles = bannerBaseStyles(theme);
    const channelType = isPrivate ? 'P' : 'O';

    if ((channelType === General.OPEN_CHANNEL && !publicChannelLimitReached) || (channelType === General.PRIVATE_CHANNEL && !privateChannelLimitReached)) {
        return null;
    }

    return (
        <BannerBase
            title={
                <FormattedText
                    defaultMessage={'You have reached the limit of {type, select, O {public channels} P {private channels} other {}} ({usage, number}/{limit, number}) on your kSuite offer.'}
                    id='upgrade_banner_channel.description'
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
                    id='upgrade_banner.link'
                    style={styles.textDescription}
                />
            }
            style={{width: '100%', marginBottom: 10}}
        />
    );
};

export default UpgradeChannelBanner;

