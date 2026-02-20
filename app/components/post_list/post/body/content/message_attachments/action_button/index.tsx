// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Button} from '@rneui/base';
import React, {useCallback, useRef} from 'react';

import {fetchPollMetadataIfPoll, postActionWithCookie} from '@actions/remote/integrations';
import {useServerUrl} from '@context/server';
import {getStatusColors} from '@utils/message_attachment';
import {preventDoubleTap} from '@utils/tap';
import {makeStyleSheetFromTheme, changeOpacity} from '@utils/theme';
import {secureGetFromRecord} from '@utils/types';

import ActionButtonText from './action_button_text';

type Props = {
    buttonColor?: string;
    cookie?: string;
    disabled?: boolean;
    id: string;
    isVoted?: boolean;
    name: string;
    postId: string;
    theme: ExtendedTheme;
}

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    const STATUS_COLORS = getStatusColors(theme);
    return {
        button: {
            backgroundColor: 'transparent',
            borderRadius: 4,
            borderColor: changeOpacity(STATUS_COLORS.default, 0.25),
            borderWidth: 2,
            opacity: 1,
            alignItems: 'center',
            marginTop: 12,
            justifyContent: 'center',
            height: 36,
        },
        buttonDisabled: {
            backgroundColor: changeOpacity(theme.buttonBg, 0.3),
        },
        text: {
            color: STATUS_COLORS.default,
            fontSize: 15,
            fontFamily: 'SuisseIntl-SemiBold',
            lineHeight: 17,
        },
        buttonVoted: {
            borderColor: theme.buttonBg,
        },
        textVoted: {
            color: theme.buttonBg,
        },
    };
});

const ActionButton = ({buttonColor, cookie, disabled, id, isVoted, name, postId, theme}: Props) => {
    const presssed = useRef(false);
    const serverUrl = useServerUrl();
    const style = getStyleSheet(theme);
    let customButtonStyle;
    let customButtonTextStyle;

    const onPress = useCallback(preventDoubleTap(async () => {
        if (!presssed.current) {
            presssed.current = true;
            await postActionWithCookie(serverUrl, postId, id, cookie || '');
            await fetchPollMetadataIfPoll(serverUrl, postId);
            presssed.current = false;
        }
    }), [id, postId, cookie]);

    if (buttonColor) {
        const STATUS_COLORS = getStatusColors(theme);
        const hexColor = secureGetFromRecord(STATUS_COLORS, buttonColor) || secureGetFromRecord(theme, buttonColor) || buttonColor;
        customButtonStyle = {borderColor: changeOpacity(hexColor, 0.25), backgroundColor: '#ffffff'};
        customButtonTextStyle = {color: hexColor};
    }

    const votedButtonStyle = isVoted && !buttonColor ? style.buttonVoted : undefined;
    const votedTextStyle = isVoted && !buttonColor ? style.textVoted : undefined;

    return (
        <Button
            buttonStyle={[style.button, customButtonStyle, votedButtonStyle]}
            disabledStyle={style.buttonDisabled}
            onPress={onPress}
            disabled={disabled}
        >
            <ActionButtonText
                message={name}
                style={{...style.text, ...customButtonTextStyle, ...votedTextStyle}}
            />
        </Button>
    );
};

export default ActionButton;
