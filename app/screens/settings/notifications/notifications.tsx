// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useState} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {Notifications as RNNotifications} from 'react-native-notifications';

import SettingContainer from '@components/settings/container';
import SettingItem from '@components/settings/item';
import {General, Screens} from '@constants';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import {useAppState} from '@hooks/device';
import useNotificationProps from '@hooks/notification_props';
import {popTopScreen} from '@screens/navigation';
import {gotoSettingsScreen} from '@screens/settings/config';
import {logError} from '@utils/log';

import NotificationsDisabledNotice from './notifications_disabled_notice';

import type UserModel from '@typings/database/models/servers/user';
import type {AvailableScreens} from '@typings/screens/navigation';

const mentionTexts = defineMessages({
    crtOn: {
        id: 'notification_settings.keywords',
        defaultMessage: 'Keywords',
    },
    crtOff: {
        id: 'notification_settings.keywords',
        defaultMessage: 'Keywords',
    },
});

export type NotificationsProps = {
    componentId: AvailableScreens;
    currentUser?: UserModel;
    enableAutoResponder: boolean;
    isCRTEnabled: boolean;
}
const Notifications = ({
    componentId,
    currentUser,
    enableAutoResponder,
    isCRTEnabled,
}: NotificationsProps) => {
    const intl = useIntl();

    const notifyProps = useNotificationProps(currentUser);
    const [isRegistered, setIsRegistered] = useState(true);

    const appState = useAppState();

    useEffect(() => {
        let isCurrent = true;
        if (appState === 'active') {
            const checkNotificationStatus = async () => {
                try {
                    const registered = await RNNotifications.isRegisteredForRemoteNotifications();
                    if (isCurrent) {
                        setIsRegistered(registered);
                    }
                } catch (error) {
                    if (isCurrent) {
                        logError('Error checking notification registration status:', error);
                    }
                }
            };
            checkNotificationStatus();
        }
        return () => {
            isCurrent = false;
        };
    }, [appState]);

    const goToNotificationSettingsMentions = useCallback(() => {
        const screen = Screens.SETTINGS_NOTIFICATION_MENTION;

        const message = isCRTEnabled ? mentionTexts.crtOn : mentionTexts.crtOff;
        const title = intl.formatMessage(message);
        gotoSettingsScreen(screen, title);
    }, [intl, isCRTEnabled]);

    const goToNotificationSettingsPush = useCallback(() => {
        const screen = Screens.SETTINGS_NOTIFICATION_PUSH;
        const title = intl.formatMessage({
            id: 'notification_settings.push_notification',
            defaultMessage: 'Push Notifications',
        });

        gotoSettingsScreen(screen, title);
    }, [intl]);

    const goToNotificationAutoResponder = useCallback(() => {
        const screen = Screens.SETTINGS_NOTIFICATION_AUTO_RESPONDER;
        const title = intl.formatMessage({
            id: 'notification_settings.auto_responder',
            defaultMessage: 'Automatic Replies',
        });
        gotoSettingsScreen(screen, title);
    }, [intl]);

    const close = useCallback(() => {
        popTopScreen(componentId);
    }, [componentId]);

    useAndroidHardwareBackHandler(componentId, close);

    return (
        <SettingContainer testID='notification_settings'>
            {!isRegistered &&
            <NotificationsDisabledNotice
                testID='notifications-disabled-notice'
            />}
            <SettingItem
                optionName='push_notification'
                onPress={goToNotificationSettingsPush}
                testID='notification_settings.push_notifications.option'
            />
            <SettingItem
                onPress={goToNotificationSettingsMentions}
                optionName='mentions'
                label={intl.formatMessage({
                    id: isCRTEnabled ? mentionTexts.crtOn.id : mentionTexts.crtOff.id,
                    defaultMessage: isCRTEnabled ? mentionTexts.crtOn.defaultMessage : mentionTexts.crtOff.defaultMessage,
                })}
                testID='notification_settings.mentions.option'
            />
            {enableAutoResponder && (
                <SettingItem
                    onPress={goToNotificationAutoResponder}
                    optionName='automatic_dm_replies'
                    info={currentUser?.status === General.OUT_OF_OFFICE && notifyProps.auto_responder_active === 'true' ? 'On' : 'Off'}
                    testID='notification_settings.automatic_replies.option'
                />
            )}
        </SettingContainer>
    );
};

export default Notifications;
