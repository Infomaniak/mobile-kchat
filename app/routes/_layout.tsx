// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Slot} from 'expo-router';
import React from 'react';
import {IntlProvider} from 'react-intl';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';

import {DEFAULT_LOCALE, getTranslations} from '@i18n';
import {useTopInsetShared} from '@utils/top_inset_shared';

const styles = StyleSheet.create({
    flex: {flex: 1},
});

function SafeAreaInsetsBridge() {
    const insets = useSafeAreaInsets();
    const topInsetShared = useTopInsetShared();

    // Expo Router bypasses the old RNN screen wrapper that kept this shared value in sync.
    if (topInsetShared.value !== insets.top) {
        topInsetShared.value = insets.top;
    }

    return null;
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={styles.flex}>
            <SafeAreaProvider>
                <SafeAreaInsetsBridge/>
                <IntlProvider
                    locale={DEFAULT_LOCALE}
                    messages={getTranslations(DEFAULT_LOCALE)}
                >
                    <Slot/>
                </IntlProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
