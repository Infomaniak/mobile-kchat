// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Stack} from 'expo-router';

import {withServerDatabase} from '@database/components';

function ModalsLayout() {
    return (
        <Stack screenOptions={{headerShown: true, headerBackButtonMenuEnabled: false}}>
            <Stack.Screen
                name='(channel_info)'
                options={{headerShown: false}}
            />
        </Stack>
    );
}

export default withServerDatabase(ModalsLayout);
