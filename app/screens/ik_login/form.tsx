// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {Keyboard, View} from 'react-native';
import Button from 'react-native-button';

import FormattedText from '@components/formatted_text';
import Loading from '@components/loading';
import {t} from '@i18n';
import {buttonBackgroundStyle, buttonTextStyle} from '@utils/buttonStyles';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

type Props = {
    buttonDisabled: boolean;
    connecting: boolean;
    handleConnect: () => void;
    theme: Theme;
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    formContainer: {
        alignItems: 'center',
        maxWidth: 600,
        width: '100%',
        paddingHorizontal: 20,
    },
    enterServer: {
        marginBottom: 24,
    },
    fullWidth: {
        width: '100%',
    },
    error: {
        marginBottom: 18,
    },
    chooseText: {
        alignSelf: 'flex-start',
        color: changeOpacity(theme.centerChannelColor, 0.64),
        marginTop: 8,
        ...typography('Body', 75, 'Regular'),
    },
    connectButton: {
        backgroundColor: changeOpacity(theme.centerChannelColor, 0.08),
        width: '100%',
        marginTop: 32,
        marginLeft: 20,
        marginRight: 20,
    },
    ikButton: {
        backgroundColor: '#0088B2',
        borderRadius: 16,
    },
    connectingIndicator: {
        marginRight: 10,
    },
    loadingContainerStyle: {
        marginRight: 10,
        padding: 0,
        top: -2,
    },
}));

const ServerForm = ({
    buttonDisabled,
    connecting,
    handleConnect,
    theme,
}: Props) => {
    const styles = getStyleSheet(theme);

    const onConnect = useCallback(() => {
        Keyboard.dismiss();
        handleConnect();
    }, [buttonDisabled, connecting, theme]);

    const buttonType = buttonDisabled ? 'disabled' : 'default';
    const styleButtonText = buttonTextStyle(theme, 'lg', 'primary', buttonType);
    const styleButtonBackground = buttonBackgroundStyle(theme, 'lg', 'primary', buttonType);

    let buttonID = t('mobile.components.select_server_view.connect');
    let buttonText = 'Connect';
    let buttonIcon;

    if (connecting) {
        buttonID = t('mobile.components.select_server_view.connecting');
        buttonText = 'Connecting';
        buttonIcon = (
            <Loading
                containerStyle={styles.loadingContainerStyle}
                color={theme.buttonColor}
            />
        );
    }

    const connectButtonTestId = buttonDisabled ? 'server_form.connect.button.disabled' : 'server_form.connect.button';

    return (
        <View style={styles.formContainer}>
            <Button
                containerStyle={[styles.connectButton, styleButtonBackground, styles.ikButton]}
                disabled={buttonDisabled}
                onPress={onConnect}
                testID={connectButtonTestId}
            >
                {buttonIcon}
                <FormattedText
                    defaultMessage={buttonText}
                    id={buttonID}
                    style={styleButtonText}
                />
            </Button>
        </View>
    );
};

export default ServerForm;
