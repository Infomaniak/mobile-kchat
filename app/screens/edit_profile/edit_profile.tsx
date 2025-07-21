// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useMemo} from 'react';
import {DeviceEventEmitter, StyleSheet} from 'react-native';
import {type Edge, SafeAreaView} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import CompassIcon from '@components/compass_icon';
import {Events} from '@constants';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import useNavButtonPressed from '@hooks/navigation_button_pressed';
import NetworkManager from '@managers/network_manager';
import {dismissModal, popTopScreen, setButtons} from '@screens/navigation';

import type {EditProfileProps} from '@typings/screens/edit_profile';

const edges: Edge[] = ['bottom', 'left', 'right'];

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    top: {
        marginVertical: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const CLOSE_BUTTON_ID = 'close-edit-profile';

const EditProfile = ({
    componentId, isModal, isTablet,
}: EditProfileProps) => {
    const serverUrl = useServerUrl();
    const theme = useTheme();

    const leftButton = useMemo(() => {
        return isTablet ? null : {
            id: CLOSE_BUTTON_ID,
            icon: CompassIcon.getImageSourceSync('close', 24, theme.centerChannelColor),
            testID: 'close.edit_profile.button',
        };
    }, [isTablet, theme.centerChannelColor]);

    useEffect(() => {
        if (!isTablet) {
            setButtons(componentId, {
                leftButtons: [leftButton!],
            });
        }
    }, [isTablet, componentId, leftButton]);

    const close = useCallback(() => {
        if (isModal) {
            dismissModal({componentId});
        } else if (isTablet) {
            DeviceEventEmitter.emit(Events.ACCOUNT_SELECT_TABLET_VIEW, '');
        } else {
            popTopScreen(componentId);
        }
    }, [componentId, isModal, isTablet]);

    useAndroidHardwareBackHandler(componentId, close);
    useNavButtonPressed(CLOSE_BUTTON_ID, componentId, close, []);

    const currentToken = NetworkManager.getClient(serverUrl).getCurrentBearerToken();
    return (
        <SafeAreaView
            edges={edges}
            style={styles.flex}
            testID='edit_profile.screen'
        >
            <WebView
                sharedCookiesEnabled={true}
                source={{
                    uri: 'https://manager.infomaniak.com/v3/mobile_login/?url=https://manager.infomaniak.com/v3/ng/profile/user/dashboard',
                    headers: {Authorization: currentToken},
                }}
            />
        </SafeAreaView>
    );
};

export default EditProfile;
