// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import FormattedText from '@app/components/formatted_text';
import {useTheme} from '@app/context/theme';
import {useGetLimits} from '@app/hooks/limits';
import {useNextPlan} from '@app/hooks/plans';

import BannerBase, {bannerBaseStyles} from './ik_banner_base';

const UpgradeKsuiteBanner = () => {
    const theme = useTheme();
    const styles = bannerBaseStyles(theme);
    const limits = useGetLimits();
    const nextPlan = useNextPlan();
    const historyDurationLimit = limits?.messages ? sanitizeHistoryDuration(limits.messages.history) : null;
    if (historyDurationLimit === null) {
        return null;
    }

    return (
        <BannerBase
            title={
                <FormattedText
                    defaultMessage={'Unlock the full power of kChat!'}
                    id='ksuite_free_banner_1'
                    style={styles.textTitle}
                />
            }
            description={
                <FormattedText
                    defaultMessage='Messages and files older than {duration} are no longer available. Upgrade to the {plan} plan to enjoy unlimited conversation history.'
                    id='ksuite_free_banner_2'
                    style={styles.textDescription}
                    values={{
                        duration: historyDurationLimit,
                        plan: nextPlan,
                    }}
                />
            }
            link={
                <FormattedText
                    defaultMessage={'To upgrade your plan, use the web interface.'}
                    id='ksuite_free_banner_3'
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
