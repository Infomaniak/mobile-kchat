// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Button} from '@rneui/base';
import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, View} from 'react-native';

import {buttonBackgroundStyle, buttonTextStyle} from '@utils/buttonStyles';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

type Props = {
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
}));

const ServerForm = ({
    connecting,
    handleConnect,
    theme,
}: Props) => {
    const styles = getStyleSheet(theme);
    const intl = useIntl();

    const onConnect = useCallback(() => {
        Keyboard.dismiss();
        handleConnect();
    }, []);

    const buttonType = connecting ? 'disabled' : 'default';

    return (
        <View style={styles.formContainer}>
            <Button
                title={intl.formatMessage(
                    connecting ? {
                        id: 'mobile.components.select_server_view.connecting',
                        defaultMessage: 'Connecting',
                    } : {
                        id: 'mobile.components.select_server_view.connect',
                        defaultMessage: 'Connect',
                    },
                )}
                buttonStyle={[
                    buttonBackgroundStyle(theme, 'lg', 'primary', buttonType),
                    styles.ikButton,
                ]}
                containerStyle={{
                    width: '100%',
                    marginTop: 32,
                    marginLeft: 20,
                    marginRight: 20,
                }}
                titleStyle={buttonTextStyle(theme, 'lg', 'primary', buttonType)}
                disabled={connecting}
                onPress={onConnect}
                testID={connecting ? 'server_form.connect.button.disabled' : 'server_form.connect.button'}
                loading={connecting}
            />
        </View>
    );
};

export default ServerForm;
