// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Clipboard from '@react-native-clipboard/clipboard';
import React, {useCallback, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {Alert, Text, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import Config from '@assets/config.json';
import Button from '@components/button';
import CompassIcon from '@components/compass_icon';
import FormattedText from '@components/formatted_text';
import SettingContainer from '@components/settings/container';
import AboutLinks from '@constants/about_links';
import {SNACK_BAR_TYPE} from '@constants/snack_bar';
import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import {t} from '@i18n';
import {popTopScreen} from '@screens/navigation';
import {buttonBackgroundStyle, buttonTextStyle} from '@utils/buttonStyles';
import {showSnackBar} from '@utils/snack_bar';
import {preventDoubleTap} from '@utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';
import {tryOpenURL} from '@utils/url';

import LearnMore from './learn_more';
import Subtitle from './subtitle';
import Title from './title';
import TosPrivacyContainer from './tos_privacy';

import type {AvailableScreens} from '@typings/screens/navigation';

const MATTERMOST_BUNDLE_IDS = ['com.mattermost.rnbeta', 'com.mattermost.rn'];

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        logoContainer: {
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 20,
        },
        lineStyles: {
            width: '100%',
            marginTop: 40,
            marginBottom: 24,
        },
        leftHeading: {
            ...typography('Body', 200, 'SemiBold'),
            marginRight: 8,
            color: theme.centerChannelColor,
        },
        rightHeading: {
            ...typography('Body', 200, 'Regular'),
            color: theme.centerChannelColor,
        },
        infoContainer: {
            flexDirection: 'column',
            paddingHorizontal: 20,
        },
        info: {
            color: theme.centerChannelColor,
            ...typography('Body', 200, 'Regular'),
        },
        licenseContainer: {
            flexDirection: 'row',
            marginTop: 20,
        },
        noticeContainer: {
            flexDirection: 'column',
        },
        noticeLink: {
            color: theme.linkColor,
            ...typography('Body', 50, 'Regular'),
        },
        hashContainer: {
            flexDirection: 'column',
        },
        footerTitleText: {
            color: changeOpacity(theme.centerChannelColor, 0.64),
            ...typography('Body', 50, 'SemiBold'),
        },
        footerText: {
            color: changeOpacity(theme.centerChannelColor, 0.64),
            ...typography('Body', 50),
            marginVertical: 10,
        },
        copyrightText: {
            marginBottom: 0,
        },
        tosPrivacyContainer: {
            flexDirection: 'row',
            marginBottom: 10,
        },
        group: {
            flexDirection: 'row',
        },
        copyInfoButtonContainer: {
            width: 120,
            marginTop: 10,
            position: 'relative',
        },
        thinLine: {
            height: 0.2,
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.2),
            alignSelf: 'stretch',
            marginVertical: 20,
        },
    };
});

type AboutProps = {
    componentId: AvailableScreens;
    config: ClientConfig;
    license: ClientLicense;
}
const About = ({componentId, config, license}: AboutProps) => {
    const intl = useIntl();
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    const openURL = useCallback((url: string) => {
        const onError = () => {
            Alert.alert(
                intl.formatMessage({
                    id: 'settings.link.error.title',
                    defaultMessage: 'Error',
                }),
                intl.formatMessage({
                    id: 'settings.link.error.text',
                    defaultMessage: 'Unable to open the link.',
                }),
            );
        };

        tryOpenURL(url, onError);
    }, []);

    const handleAboutTeam = useCallback(preventDoubleTap(() => {
        return openURL(Config.WebsiteURL);
    }), []);

    const handlePlatformNotice = useCallback(preventDoubleTap(() => {
        return openURL(Config.ServerNoticeURL);
    }), []);

    const handleMobileNotice = useCallback(preventDoubleTap(() => {
        return openURL(Config.MobileNoticeURL);
    }), []);

    const handleTermsOfService = useCallback(preventDoubleTap(() => {
        return openURL(AboutLinks.TERMS_OF_SERVICE);
    }), []);

    const handlePrivacyPolicy = useCallback(preventDoubleTap(() => {
        return openURL(AboutLinks.PRIVACY_POLICY);
    }), []);

    const serverVersion = useMemo(() => {
        const buildNumber = config.BuildNumber;
        const version = config.Version;

        if (buildNumber === version) {
            return version;
        }

        return intl.formatMessage({id: 'settings.about.server.version.value', defaultMessage: '{version} (Build {buildNumber})'}, {version, buildNumber});
    }, [config, intl]);

    const close = useCallback(() => {
        popTopScreen(componentId);
    }, [componentId]);

    useAndroidHardwareBackHandler(componentId, close);

    const copyToClipboard = useCallback(
        () => {
            const appVersion = intl.formatMessage({id: 'settings.about.app.version', defaultMessage: 'App Version: {version} (Build {number})'}, {version: DeviceInfo.getVersion(), number: DeviceInfo.getBuildNumber()});
            const buildNumber = config.BuildNumber;
            const version = config.Version;
            const server = buildNumber === version ? intl.formatMessage({id: 'settings.about.server.version.noBuild', defaultMessage: 'Server Version: {version}'}, {version}) : intl.formatMessage({id: 'settings.about.server.version', defaultMessage: 'Server Version: {version} (Build {buildNumber})'}, {version, buildNumber});
            const database = intl.formatMessage({id: 'settings.about.database', defaultMessage: 'Database: {driverName}'}, {driverName: config.SQLDriverName});
            const databaseSchemaVersion = intl.formatMessage({id: 'settings.about.database.schema', defaultMessage: 'Database Schema Version: {version}'}, {version: config.SchemaVersion});
            const copiedString = `${appVersion}\n${server}\n${database}\n${databaseSchemaVersion}`;
            Clipboard.setString(copiedString);
            showSnackBar({barType: SNACK_BAR_TYPE.INFO_COPIED, sourceScreen: componentId});
        },
        [intl, config],
    );

    return (
        <SettingContainer testID='about'>
            <View style={styles.infoContainer}>
                <View style={styles.group}>
                    <Text
                        style={styles.leftHeading}
                        testID='about.app_version.title'
                    >
                        {intl.formatMessage({id: 'settings.about.app.version.title', defaultMessage: 'App Version:'})}
                    </Text>
                    <Text
                        style={styles.rightHeading}
                        testID='about.app_version.value'
                    >
                        {intl.formatMessage({id: 'settings.about.app.version.value', defaultMessage: '{version} (Build {number})'},
                            {version: DeviceInfo.getVersion(), number: DeviceInfo.getBuildNumber()})}
                    </Text>
                </View>
                <View style={styles.group}>
                    <Text
                        style={styles.leftHeading}
                        testID='about.server_version.title'
                    >
                        {intl.formatMessage({id: 'settings.about.server.version.title', defaultMessage: 'Server Version:'})}
                    </Text>
                    <Text
                        style={styles.rightHeading}
                        testID='about.server_version.value'
                    >
                        {serverVersion}
                    </Text>
                </View>
                <View style={styles.group}>
                    <Text
                        style={styles.leftHeading}
                        testID='about.database.title'
                    >
                        {intl.formatMessage({id: 'settings.about.database.title', defaultMessage: 'Database:'})}
                    </Text>
                    <Text
                        style={styles.rightHeading}
                        testID='about.database.value'
                    >
                        {config.SQLDriverName}
                    </Text>
                </View>
                <View style={styles.group}>
                    <Text
                        style={styles.leftHeading}
                        testID='about.database_schema_version.title'
                    >
                        {intl.formatMessage({id: 'settings.about.database.schema.title', defaultMessage: 'Database Schema Version:'})}
                    </Text>
                    <Text
                        style={styles.rightHeading}
                        testID='about.database_schema_version.value'
                    >
                        {config.SchemaVersion}
                    </Text>
                </View>
            </View>
        </SettingContainer>
    );
};

export default About;
