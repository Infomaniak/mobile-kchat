// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useState} from 'react';
import {BackHandler, Image, View} from 'react-native';

import {infomaniakLogin} from '@actions/remote/iksession';
import FormattedText from '@components/formatted_text';
import {login as displayLoginWebView} from '@init/ikauth';
import {popTopScreen, resetToHome, resetToInfomaniakNoTeams} from '@screens/navigation';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import ServerForm from './form';
import LogoIllustration from './logo_illustration';
import WaveIllustration from './wave_illustration';

import type {LaunchProps} from '@typings/launch';
import {Screens} from '@constants';
import PushNotifications from '@init/push_notifications';

interface ServerProps extends LaunchProps {
    closeButtonId?: string;
    componentId: string;
    theme: Theme;
}

const Server = ({
    componentId,
    extra,
    launchType,
    launchError,
    theme,
}: ServerProps) => {
    const [connecting, setConnecting] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const styles = getStyleSheet(theme);
    const isLightMode = theme.type === 'Infomaniak';

    const handleConnect = async () => {
        setButtonDisabled(true);
        setConnecting(true);
        try {
            const accessToken = await displayLoginWebView();
            const result = await infomaniakLogin(accessToken);
            if (result.serverUrl) {
                goToHome(result.serverUrl!, result.error as never);
            } else {
                resetToInfomaniakNoTeams();
            }
        } catch {
            setButtonDisabled(false);
            setConnecting(false);
        }
    };

    useEffect(() => {
        PushNotifications.registerIfNeeded();
    }, []);

    const goToHome = (serverUrl: string, error?: never) => {
        const hasError = launchError || Boolean(error);
        resetToHome({extra, launchError: hasError, launchType, serverUrl, time: 0});
    };

    return (
        <>
            <View style={styles.backgroundContainer}/>
            <WaveIllustration
                width={'100%'}
                height={'50%'}
                color={isLightMode ? '#E6F3F7' : '#1E1E1E'}
                style={styles.waveIllustration}
            />
            <View
                style={styles.flex}
            >
                <View
                    style={styles.container}
                >
                    <View style={styles.topContainer}>
                        <LogoIllustration color={isLightMode ? '#1E1E1E' : '#E6F3F7'}/>
                        <View style={styles.onboardingContainer}>
                            <Image
                                style={styles.onboardingIllustration}
                                source={isLightMode ? require('@assets/images/kchat_mockup_light.png') : require('@assets/images/kchat_mockup_dark.png')}
                            />
                        </View>
                    </View>
                    <View style={styles.bottomContainer}>
                        <FormattedText
                            defaultMessage="Bienvenue sur kChat"
                            id="mobile.components.ik_welcome.msg_title"
                            style={styles.title}
                        />
                        <FormattedText
                            defaultMessage="Connectez-vous à votre compte et envoyez des messages depuis l'app."
                            id="mobile.components.ik_welcome.msg_description"
                            style={styles.description}
                        />
                        <ServerForm
                            buttonDisabled={buttonDisabled}
                            connecting={connecting}
                            handleConnect={handleConnect}
                            theme={theme}
                        />
                    </View>
                </View>
            </View>
        </>
    );
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
    },
    backgroundContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: theme.type === 'Infomaniak' ? '#FFFFFF' : '#2D2E30',
    },
    flex: {
        margin: 8,
    },
    topContainer: {
        flex: 1,
        marginTop: 64,
        alignItems: 'center',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 96,
        alignItems: 'center',
        justifyContent: 'center',
    },
    onboardingContainer: {
        marginTop: 32,
    },
    onboardingIllustration: {
        height: '65%',
        aspectRatio: 1,
        resizeMode: 'stretch',
    },
    waveIllustration: {
        position: 'absolute',
        width: '100%',
    },
    title: {
        color: theme.centerChannelColor,
        ...typography('Heading', 500, 'SemiBold'),
        marginBottom: 16,
    },
    description: {
        color: theme.centerChannelColor,
        textAlign: 'center',
        ...typography('Body', 200, 'Regular'),
    },
}));

export default Server;
