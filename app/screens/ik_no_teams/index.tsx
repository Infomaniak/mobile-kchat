// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Button} from '@rneui/base';
import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import {Image, Linking, Text, View} from 'react-native';

import LaunchType from '@constants/launch';
import {getDefaultThemeByAppearance} from '@context/theme';
import DatabaseManager from '@database/manager';
import {getAllServerCredentials, removeServerCredentials} from '@init/credentials';
import NetworkManager from '@managers/network_manager';
import WebsocketManager from '@managers/websocket_manager';
import {resetToInfomaniakLogin} from '@screens/navigation';
import {buttonBackgroundStyle, buttonTextStyle} from '@utils/buttonStyles';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {
        flex: 1,
        width: '100%',
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    iconWrapper: {
        marginTop: 128,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageBgBackground: {
        position: 'absolute',
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    imagePlaceHolder: {
        height: 256,
        width: 256,
    },
    title: {
        color: theme.centerChannelColor,
        marginTop: 24,
        textAlign: 'center',
        ...typography('Heading', 500, 'SemiBold'),
    },
    description: {
        color: theme.centerChannelColor,
        textAlign: 'center',
        marginTop: 12,
        ...typography('Body', 200, 'Regular'),
    },
    discoverButton: {
        marginTop: 32,
    },
    disconnectButton: {
        marginTop: 16,
    },
    ikButton: {
        minWidth: 196,
        borderRadius: 16,
        marginLeft: 20,
        marginRight: 20,
    },
}));

const InfomaniakNoTeams = () => {
    const theme = getDefaultThemeByAppearance();

    const styles = getStyleSheet(theme);
    const intl = useIntl();

    const onDiscoverKSuitePressed = useCallback(() => {
        Linking.openURL('https://www.infomaniak.com/ksuite');
    }, [theme]);

    const [loading, setLoading] = useState(false);
    const onDisconnectPressed = useCallback(async () => {
        setLoading(true);
        NetworkManager.invalidateGlobalClient();

        // Properly clean up all servers
        const credentials = await getAllServerCredentials();
        for (const {serverUrl} of credentials) {
            WebsocketManager.invalidateClient(serverUrl);
            NetworkManager.invalidateClient(serverUrl);
            // eslint-disable-next-line no-await-in-loop
            await removeServerCredentials(serverUrl);
            try {
                // eslint-disable-next-line no-await-in-loop
                await DatabaseManager.destroyServerDatabase(serverUrl);
            } catch {
                // already destroyed
            }
        }

        resetToInfomaniakLogin({launchType: LaunchType.Normal});
    }, []);

    return (
        <>
            <Image
                style={styles.imageBgBackground}
                source={require('@assets/images/ksuite_bg_blurred.png')}
            />
            <View style={styles.container}>
                <View style={styles.iconWrapper}>
                    <Image
                        style={styles.imagePlaceHolder}
                        source={require('@assets/images/ksuite.png')}
                    />
                </View>
                <Text style={styles.title}>
                    {intl.formatMessage({id: 'infomaniak.no_team.title', defaultMessage: 'You have no kChat, discover it with kSuite'})}
                </Text>
                <Text style={styles.description}>
                    {intl.formatMessage({
                        id: 'infomaniak.no_team.description',
                        defaultMessage: 'kSuite integrates all our productivity applications including kChat to communicate and coordinate your teams.',
                    })}
                </Text>
                <Button
                    title={intl.formatMessage({
                        id: 'infomaniak.no_team.discover_ksuite',
                        defaultMessage: 'Discover kSuite',
                    })}
                    titleStyle={buttonTextStyle(theme, 'lg', 'primary', 'default')}
                    containerStyle={styles.discoverButton}
                    buttonStyle={[
                        buttonBackgroundStyle(theme, 'lg', 'primary', 'default'),
                        styles.ikButton,
                    ]}
                    onPress={onDiscoverKSuitePressed}
                />
                <Button
                    title={intl.formatMessage({
                        id: 'account.logout',
                        defaultMessage: 'Disconnect',
                    })}
                    titleStyle={buttonTextStyle(theme, 'lg', 'primary', 'inverted')}
                    containerStyle={styles.disconnectButton}
                    buttonStyle={[
                        buttonBackgroundStyle(theme, 'lg', 'link', 'inverted'),
                        styles.ikButton,
                    ]}
                    loading={loading}
                    onPress={onDisconnectPressed}
                />
            </View>
        </>
    );
};

export default InfomaniakNoTeams;
