// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';

import {useTopInsetShared} from '@utils/top_inset_shared';

export const withSafeAreaInsets = (Screen: React.ComponentType) => {
    const SafeAreaInsetsWrapper: React.ComponentType = (props) => {
        const Inner: React.ComponentType = (innerProps) => {
            const insets = useSafeAreaInsets();
            const topInsetShared = useTopInsetShared();

            if (insets.top > 0 && topInsetShared.value === 0) {
                topInsetShared.value = insets.top;
            }

            return (
                <Screen
                    {...innerProps}
                />
            );
        };

        return (
            <SafeAreaProvider>
                <Inner {...props}/>
            </SafeAreaProvider>
        );
    };

    return SafeAreaInsetsWrapper;
};

export function registerScreens() {
    // Expo Router discovers screens from app/routes.
}
