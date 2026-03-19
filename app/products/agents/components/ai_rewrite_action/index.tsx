// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import EuriaIcon from '@agents/components/euria_icon';
import {useRewrite} from '@agents/hooks';
import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard} from 'react-native';

import TouchableWithFeedback from '@components/touchable_with_feedback';
import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {useIsTablet} from '@hooks/device';
import {openAsBottomSheet} from '@screens/navigation';

const ICON_SIZE = 24;

type Props = {
    testID?: string;
    disabled?: boolean;
    value: string;
    updateValue: (value: string | ((prevValue: string) => string)) => void;
}

const styles = {
    icon: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        padding: 10,
    },
};

export default function AIRewriteAction({
    testID,
    disabled = false,
    value,
    updateValue,
}: Props) {
    const intl = useIntl();
    const theme = useTheme();
    const isTablet = useIsTablet();
    const {isProcessing} = useRewrite();

    const handlePress = useCallback(() => {
        Keyboard.dismiss();
        const title = isTablet ? intl.formatMessage({id: 'ai_rewrite.title', defaultMessage: 'Ask Euria'}) : '';

        openAsBottomSheet({
            closeButtonId: 'close-ai-rewrite',
            screen: Screens.AGENTS_REWRITE_OPTIONS,
            theme,
            title,
            props: {
                closeButtonId: 'close-ai-rewrite',
                originalMessage: value,
                updateValue,
            },
        });
    }, [intl, isTablet, theme, value, updateValue]);

    const hasMessage = Boolean(value.trim());
    const isDisabled = disabled || isProcessing || !hasMessage;
    const actionTestID = isDisabled ? `${testID}.disabled` : testID;

    return (
        <TouchableWithFeedback
            testID={actionTestID}
            disabled={isDisabled}
            onPress={handlePress}
            style={[styles.icon, isDisabled && {opacity: 0.4}]}
            type={'opacity'}
        >
            <EuriaIcon
                size={ICON_SIZE}
            />
        </TouchableWithFeedback>
    );
}
