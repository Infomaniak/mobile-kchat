// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {View} from 'react-native';

import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import CustomStatus from './custom_status';
import Logout from './logout';
import Next from './next';
import Settings from './settings';
import UserPresence from './user_presence';
import YourProfile from './your_profile';

import type UserModel from '@typings/database/models/servers/user';

type AccountScreenProps = {
    user: UserModel;
    enableCustomUserStatuses: boolean;
    isTablet: boolean;
    theme: Theme;
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        divider: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.2),
            height: 1,
            width: '90%',
            alignSelf: 'center',
            marginVertical: 8,
        },
        group: {
            paddingLeft: 16,
        },
    };
});

const AccountOptions = ({user, enableCustomUserStatuses, isTablet, theme}: AccountScreenProps) => {
    const styles = getStyleSheet(theme);

    return (
        <View >
            <View style={styles.group}>
                <UserPresence
                    currentUser={user}
                />
                {enableCustomUserStatuses &&
                    <CustomStatus
                        isTablet={isTablet}
                        currentUser={user}
                    />}
            </View>
            <View style={styles.divider}/>
            <View style={styles.group}>
                <YourProfile
                    isTablet={isTablet}
                    theme={theme}
                />
                <Settings/>
            </View>
            <View style={styles.divider}/>
            <View style={styles.group}>
                <Next/>
                <Logout/>
            </View>
        </View>
    );
};

export default AccountOptions;
