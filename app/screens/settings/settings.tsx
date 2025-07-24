// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {Alert, Platform, View} from 'react-native';

import CompassIcon from '@components/compass_icon';
import SettingContainer from '@components/settings/container';
import SettingItem from '@components/settings/item';
import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import useNavButtonPressed from '@hooks/navigation_button_pressed';
import {dismissModal, goToScreen, setButtons} from '@screens/navigation';
import {gotoSettingsScreen} from '@screens/settings/config';
import {preventDoubleTap} from '@utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {tryOpenURL} from '@utils/url';
import {getUserTimezoneProps} from '@utils/user';

import type UserModel from '@typings/database/models/servers/user';
import type {AvailableScreens} from '@typings/screens/navigation';

const CLOSE_BUTTON_ID = 'close-settings';

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
        containerStyle: {
            paddingLeft: 8,
            marginTop: 12,
        },
        helpGroup: {
            width: '91%',
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.08),
            height: 1,
            alignSelf: 'center',

            // marginTop: 20,
        },
    };
});

type SettingsProps = {
    componentId: AvailableScreens;
    helpLink: string;
    showHelp: boolean;
    siteName: string;
    currentUser?: UserModel;
}

//todo: Profile the whole feature - https://mattermost.atlassian.net/browse/MM-39711

const Settings = ({componentId, helpLink, showHelp, currentUser}: SettingsProps) => {
    const theme = useTheme();
    const intl = useIntl();
    const styles = getStyleSheet(theme);
    const timezone = useMemo(() => getUserTimezoneProps(currentUser), [currentUser?.timezone]);
    const closeButton = useMemo(() => {
        return {
            id: CLOSE_BUTTON_ID,
            icon: CompassIcon.getImageSourceSync('close', 24, theme.centerChannelColor),
            testID: 'close.settings.button',
        };
    }, [theme.centerChannelColor]);

    const close = useCallback(() => {
        dismissModal({componentId});
    }, [componentId]);

    useEffect(() => {
        setButtons(componentId, {
            leftButtons: [closeButton],
        });
    }, []);

    useAndroidHardwareBackHandler(componentId, close);
    useNavButtonPressed(CLOSE_BUTTON_ID, componentId, close, []);

    const goToThemeSettings = preventDoubleTap(() => {
        const screen = Screens.SETTINGS_DISPLAY_THEME;
        const title = intl.formatMessage({id: 'mobile.display_settings.theme', defaultMessage: 'Theme'});
        goToScreen(screen, title);
    });

    const goToNotificationSettingsPush = preventDoubleTap(() => {
        const screen = Screens.SETTINGS_NOTIFICATION_PUSH;
        const title = intl.formatMessage({
            id: 'notification_settings.push_notification',
            defaultMessage: 'Push Notifications',
        });

        gotoSettingsScreen(screen, title);
    });

    const goToTimezoneSettings = preventDoubleTap(() => {
        const screen = Screens.SETTINGS_DISPLAY_TIMEZONE;
        const title = intl.formatMessage({id: 'display_settings.timezone', defaultMessage: 'Timezone'});
        gotoSettingsScreen(screen, title);
    });

    const openHelp = preventDoubleTap(() => {
        if (helpLink) {
            const onError = () => {
                Alert.alert(
                    intl.formatMessage({id: 'mobile.link.error.title', defaultMessage: 'Error'}),
                    intl.formatMessage({id: 'mobile.link.error.text', defaultMessage: 'Unable to open the link.'}),
                );
            };

            tryOpenURL(helpLink, onError);
        }
    });

    const openFeedback = preventDoubleTap(() => {
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
    });

    return (
        <SettingContainer testID='settings'>
            <SettingItem
                onPress={goToNotificationSettingsPush}
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
            {Platform.OS === 'android' && <View style={styles.helpGroup}/>}
            {showHelp &&
                <SettingItem
                    optionLabelTextStyle={{color: theme.linkColor}}
                    onPress={openHelp}
                    optionName='help'
                    testID='settings.help.option'
                    type='default'
                />
            }
            <SettingItem
                optionLabelTextStyle={{color: theme.linkColor}}
                onPress={openFeedback}
                optionName='feedback'
                separator={false}
                testID='infomaniak.feedback.option'
                type='default'
            />
        </SettingContainer>
    );
};

export default Settings;
