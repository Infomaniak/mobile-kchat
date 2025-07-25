// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';

import FormattedText from '@app/components/formatted_text';
import {useTheme} from '@app/context/theme';
import {getNextWcPack, type PackName} from '@app/hooks/plans';
import {formatYMDDurationHuman} from '@app/utils/duration';

import BannerBase, {bannerBaseStyles} from './ik_banner_base';

import type LimitsModel from '@app/database/models/server/limits';

type Props = {
    limits: LimitsModel;
    currentPackName: string;
}

const UpgradeKsuiteBanner = ({
    limits,
    currentPackName,
}: Props) => {
    const theme = useTheme();
    const styles = bannerBaseStyles(theme);
    const nextPlan = getNextWcPack(currentPackName as PackName);
    const historyDurationLimit = sanitizeHistoryDuration(limits?.messages?.history);
    const intl = useIntl();

    if (!limits) {
        return null;
    }

    const historyDurationLimitHuman = formatYMDDurationHuman(historyDurationLimit ?? '', intl);

    return (
        <BannerBase
            title={
                <FormattedText
                    defaultMessage={'Unlock the full power of kChat!'}
                    id='upgrade_banner.title'
                    style={styles.textTitle}
                />
            }
            description={
                <FormattedText
                    defaultMessage='Messages and files older than {duration} are no longer available. Upgrade to the {plan} plan to enjoy unlimited conversation history.'
                    id='upgrade_banner.description'
                    style={styles.textDescription}
                    values={{
                        duration: historyDurationLimitHuman,
                        plan: nextPlan,
                    }}
                />
            }
            link={
                <FormattedText
                    defaultMessage={'To upgrade your plan, use the web interface.'}
                    id='upgrade_banner.link'
                    style={styles.textLink}
                />
            }
        />
    );
};

export default UpgradeKsuiteBanner;

function sanitizeHistoryDuration(history: string | number | undefined): string | null {
    if (history === undefined || history === null) {
        return null;
    }

    if (typeof history === 'number') {
        return null;
    }

    if (typeof history === 'string') {
        const isoDurationRegex = /^P(?=\d|T)(\d+Y)?(\d+M)?(\d+D)?(T(\d+H)?(\d+M)?(\d+S)?)?$/i;
        if (!isoDurationRegex.test(history)) {
            return null;
        }
        return history;
    }

    return null;
}
