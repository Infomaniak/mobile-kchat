// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import {Image, Linking, Text, View} from 'react-native';
import Button from 'react-native-button';

import FormattedText from '@components/formatted_text';
import LaunchType from '@constants/launch';
import {getDefaultThemeByAppearance} from '@context/theme';
import NetworkManager from '@managers/network_manager';
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
        width: '100%',
        borderRadius: 8,
        marginLeft: 20,
        marginRight: 20,
    },
}));

const InfomaniakNoTeams = () => {
    const theme = getDefaultThemeByAppearance();
    const styleButtonText = buttonTextStyle(theme, 'lg', 'primary', 'default');
    const styleButtonBackground = buttonBackgroundStyle(theme, 'lg', 'primary', 'default');
    const styleDisconnectButtonText = buttonTextStyle(theme, 'lg', 'primary', 'inverted');
    const styleDisconnectButtonBackground = buttonBackgroundStyle(theme, 'lg', 'link', 'inverted');

    const styles = getStyleSheet(theme);
    const intl = useIntl();

    const onDiscoverKSuitePressed = useCallback(() => {
        Linking.openURL('https://www.infomaniak.com/ksuite');
    }, [theme]);

    const onDisconnectPressed = useCallback(() => {
        NetworkManager.invalidateGlobalClient();
        resetToInfomaniakLogin({launchType: LaunchType.Normal});
    }, [theme]);

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
                    containerStyle={[styles.discoverButton, styleButtonBackground, styles.ikButton]}
                    onPress={onDiscoverKSuitePressed}
                >
                    <FormattedText
                        defaultMessage={'Discover kSuite'}
                        id={'infomaniak.no_team.discover_ksuite'}
                        style={styleButtonText}
                    />
                </Button>
                <Button
                    containerStyle={[styles.disconnectButton, styleDisconnectButtonBackground, styles.ikButton]}
                    onPress={onDisconnectPressed}
                >
                    <FormattedText
                        defaultMessage={'Disconnect'}
                        id={'account.logout'}
                        style={styleDisconnectButtonText}
                    />
                </Button>
            </View>
        </>
    );
};

export default InfomaniakNoTeams;
