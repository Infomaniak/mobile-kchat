// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Stack} from 'expo-router';
import React from 'react';
import {IntlProvider} from 'react-intl';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {getDefaultThemeByAppearance} from '@context/theme';
import {DEFAULT_LOCALE, getTranslations} from '@i18n';

const styles = StyleSheet.create({
    flex: {flex: 1},
});

export default function RootLayout() {
    const theme = getDefaultThemeByAppearance();

    return (
        <GestureHandlerRootView style={styles.flex}>
            <SafeAreaProvider>
                <IntlProvider
                    locale={DEFAULT_LOCALE}
                    messages={getTranslations(DEFAULT_LOCALE)}
                >
                    <Stack
                        screenOptions={{
                            animation: 'none',
                            contentStyle: {backgroundColor: theme.centerChannelBg},
                            headerShown: false,
                        }}
                    />
                </IntlProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
