// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {DeviceEventEmitter, StyleSheet} from 'react-native';
import {type Edge, SafeAreaView} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import {Events} from '@constants';
import {useServerUrl} from '@context/server';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import NetworkManager from '@managers/network_manager';
import {dismissModal, popTopScreen} from '@screens/navigation';

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

const EditProfile = ({
    componentId, isModal, isTablet,
}: EditProfileProps) => {
    const serverUrl = useServerUrl();

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
