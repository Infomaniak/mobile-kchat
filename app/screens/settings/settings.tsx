// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Clipboard from '@react-native-clipboard/clipboard';
import {nativeApplicationVersion, nativeBuildVersion} from 'expo-application';
import React, {useCallback, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {Alert, Platform, Text, TouchableOpacity, View} from 'react-native';

import SettingContainer from '@components/settings/container';
import SettingItem from '@components/settings/item';
import {Screens} from '@constants';
import {SNACK_BAR_TYPE} from '@constants/snack_bar';
import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import {useIsInfomaniakServer} from '@hooks/network';
import {usePreventDoubleTap} from '@hooks/utils';
import {goToScreen, navigateBack} from '@screens/navigation';
import {gotoSettingsScreen} from '@screens/settings/config';
import {showSnackBar} from '@utils/snack_bar';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';
import {tryOpenURL} from '@utils/url';
import {getUserTimezoneProps} from '@utils/user';

import ReportProblem from './report_problem';

import type UserModel from '@typings/database/models/servers/user';
import type {AvailableScreens} from '@typings/screens/navigation';

const TIMEZONE_FORMAT = [
    {
        id: ('display_settings.tz.auto'),
        defaultMessage: 'Auto',
    },
    {
        id: ('display_settings.tz.manual'),
        defaultMessage: 'Manual',
    },
];

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        helpGroup: {
            width: '91%',
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.08),
            height: 1,
            alignSelf: 'center',
        },
        group: {
            flexDirection: 'row',
            margin: 12,
        },
        leftHeading: {
            ...typography('Body', 100, 'SemiBold'),
            marginRight: 8,
            color: theme.centerChannelColor,
        },
        rightHeading: {
            ...typography('Body', 100, 'Regular'),
            color: theme.centerChannelColor,
        },
    };
});

type SettingsProps = {
    helpLink: string;
    showHelp: boolean;
    siteName: string;
    currentUser?: UserModel;
}

const Settings = ({helpLink, showHelp, siteName: _siteName, currentUser}: SettingsProps) => {
    const theme = useTheme();
    const intl = useIntl();
    const styles = getStyleSheet(theme);
    const timezone = useMemo(() => getUserTimezoneProps(currentUser), [currentUser]);
    const isInfomaniak = useIsInfomaniakServer();

    useAndroidHardwareBackHandler(Screens.SETTINGS, navigateBack);

    const goToThemeSettings = usePreventDoubleTap(useCallback(() => {
        gotoSettingsScreen(Screens.SETTINGS_DISPLAY_THEME, intl.formatMessage({id: 'mobile.display_settings.theme', defaultMessage: 'Theme'}));
    }, [intl]));

    const goToNotificationSettings = usePreventDoubleTap(useCallback(() => {
        gotoSettingsScreen(Screens.SETTINGS_NOTIFICATION, intl.formatMessage({id: 'mobile.notification_settings', defaultMessage: 'Notifications'}));
    }, [intl]));

    const goToTimezoneSettings = usePreventDoubleTap(useCallback(() => {
        gotoSettingsScreen(Screens.SETTINGS_DISPLAY_TIMEZONE, intl.formatMessage({id: 'display_settings.timezone', defaultMessage: 'Timezone'}));
    }, [intl]));

    const goToPerformanceDebug = usePreventDoubleTap(useCallback(() => {
        goToScreen(Screens.DEBUG_PERFORMANCE as AvailableScreens, 'Performance Monitor');
    }, []));

    const openHelp = usePreventDoubleTap(useCallback(() => {
        if (helpLink) {
            const onError = () => {
                Alert.alert(
                    intl.formatMessage({id: 'mobile.link.error.title', defaultMessage: 'Error'}),
                    intl.formatMessage({id: 'mobile.link.error.text', defaultMessage: 'Unable to open the link.'}),
                );
            };

            tryOpenURL(helpLink, onError);
        }
    }, [helpLink, intl]));

    const openFeedback = usePreventDoubleTap(useCallback(() => {
        const feddbackLink = intl.formatMessage({id: 'infomaniak.feedback.url', defaultMessage: 'https://feedback.userreport.com/6b7737f6-0cc1-410f-993f-be2ffbf73a05#ideas/popular'});
        if (feddbackLink) {
            const onError = () => {
                Alert.alert(
                    intl.formatMessage({id: 'mobile.link.error.title', defaultMessage: 'Error'}),
                    intl.formatMessage({id: 'mobile.link.error.text', defaultMessage: 'Unable to open the link.'}),
                );
            };

            tryOpenURL(feddbackLink, onError);
        }
    }, [intl]));

    const copyToClipboard = useCallback(
        () => {
            const appVersion = intl.formatMessage({id: 'settings.about.app.version', defaultMessage: 'App Version: {version} (Build {number})'}, {version: nativeApplicationVersion, number: nativeBuildVersion});
            const copiedString = `${appVersion}`;

            Clipboard.setString(copiedString);
            showSnackBar({barType: SNACK_BAR_TYPE.INFO_COPIED, sourceScreen: Screens.SETTINGS});
        },
        [intl],
    );

    return (
        <SettingContainer testID='settings'>
            <View style={{flex: 1}}>
                <SettingItem
                    onPress={goToNotificationSettings}
                    optionName='notification'
                    testID='settings.notifications.option'
                />
                <SettingItem
                    optionName='theme'
                    onPress={goToThemeSettings}
                    info={theme.ikName!}
                    testID='display_settings.theme.option'
                />
                <SettingItem
                    optionName='timezone'
                    onPress={goToTimezoneSettings}
                    info={intl.formatMessage(timezone.useAutomaticTimezone ? TIMEZONE_FORMAT[0] : TIMEZONE_FORMAT[1])}
                    testID='display_settings.timezone.option'
                />
                {isInfomaniak && (
                    <SettingItem
                        optionName='performance_debug'
                        onPress={goToPerformanceDebug}
                        testID='settings.performance_debug.option'
                    />
                )}
                {Platform.OS === 'android' && <View style={styles.helpGroup}/>}
                {showHelp &&
                <SettingItem
                    onPress={openHelp}
                    optionName='help'
                    testID='settings.help.option'
                    type='link'
                />
                }
                {isInfomaniak && <ReportProblem/>}
                <SettingItem
                    onPress={openFeedback}
                    optionName='feedback'
                    separator={false}
                    testID='infomaniak.feedback.option'
                    type='default'
                />
            </View>

            <TouchableOpacity
                style={styles.group}
                onPress={copyToClipboard}
                activeOpacity={0.7}
                testID='about.app_version.container'
            >
                <Text
                    style={styles.leftHeading}
                    testID='about.app_version.title'
                >
                    {intl.formatMessage({
                        id: 'settings.about.app.version.title',
                        defaultMessage: 'App Version:',
                    })}
                </Text>

                <Text
                    style={styles.rightHeading}
                    testID='about.app_version.value'
                >
                    {intl.formatMessage(
                        {
                            id: 'settings.about.app.version.value',
                            defaultMessage: '{version} (Build {number})',
                        },
                        {version: nativeApplicationVersion, number: nativeBuildVersion},
                    )}
                </Text>
            </TouchableOpacity>
        </SettingContainer>
    );
};

export default Settings;
