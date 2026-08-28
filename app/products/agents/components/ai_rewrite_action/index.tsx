// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import EuriaIcon from '@agents/components/euria_icon';
import {useRewrite} from '@agents/hooks';
import React, {useCallback} from 'react';
import {Keyboard} from 'react-native';

import TouchableWithFeedback from '@components/touchable_with_feedback';
import {Screens} from '@constants';
import {navigateToScreen} from '@screens/navigation';
import CallbackStore from '@store/callback_store';

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
        flex: 1,
    },
};

export default function AIRewriteAction({
    testID,
    disabled = false,
    value,
    updateValue,
}: Props) {
    const {isProcessing} = useRewrite();

    const handlePress = useCallback(() => {
        Keyboard.dismiss();
        CallbackStore.setCallback(updateValue);
        navigateToScreen(Screens.AGENTS_REWRITE_OPTIONS, {originalMessage: value});
    }, [value, updateValue]);

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
