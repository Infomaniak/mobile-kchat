// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {View} from 'react-native';

import {useTheme} from '@context/theme';
import UpgradeIcon from '@screens/channel/channel_post_list/upgrade_icon';
import {makeStyleSheetFromTheme} from '@utils/theme';

import FormattedText from '../formatted_text';

export const getThemedStyles = makeStyleSheetFromTheme((theme) => ({
    gradientBorder: {
        padding: 1,
        borderRadius: 30,
        alignSelf: 'center',
    },
    innerContainer: {
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 8,
        gap: 8,
    },
    textContainer: {
        color: theme.centerChannelColor,
        fontWeight: '500',
        textTransform: 'uppercase',
        fontSize: 10,
    },
}));

const UpgradeButton = () => {
    const theme = useTheme();
    const styles = getThemedStyles(theme);

    return (
        <LinearGradient
            colors={['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e42']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.gradientBorder]}
        >
            <View style={[styles.innerContainer, {backgroundColor: theme.centerChannelBg}]}>
                <FormattedText
                    defaultMessage={'UPGRADE'}
                    id='upgrade_banner_ksuite_button'
                    style={styles.textContainer}
                />
                <UpgradeIcon/>
            </View>
        </LinearGradient>
    );
};

export default UpgradeButton;
