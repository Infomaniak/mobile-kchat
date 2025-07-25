// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {View, type StyleProp, type ViewStyle} from 'react-native';

import {useTheme} from '@app/context/theme';
import {makeStyleSheetFromTheme} from '@app/utils/theme';

import UpgradeIcon from '../upgrade_icon';

export const bannerBaseStyles = makeStyleSheetFromTheme((theme) => ({
    container: {
        backgroundColor: theme.guestBannerBackground,
        padding: 16,
        borderRadius: 8,
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    leftIcon: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    textTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        color: theme.centerChannelColor,
    },
    textDescription: {
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 4,
        color: theme.centerChannelColor,
    },
    textLink: {
        fontSize: 12,
        fontWeight: '400',
        color: theme.textDescription,
    },
}));

type Props = {
    title?: React.ReactNode;
    description?: React.ReactNode;
    link?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

const BannerBase = ({
    title,
    description,
    link,
    style,
}: Props) => {
    const theme = useTheme();

    const styles = bannerBaseStyles(theme);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.leftIcon}>
                <UpgradeIcon/>
            </View>
            <View style={styles.textContainer}>
                {title}
                {description}
                {link}
            </View>
        </View>
    );
};

export default BannerBase;

