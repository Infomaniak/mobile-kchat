// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import {type ViewStyle} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';

/**
 * Ripple animation values
 */
const DURATION = 3000;
const EASING = Easing.bezier(0.25, -0.5, 0.25, 1);

/**
 * Global styles
 */
const getStyleFromTheme = makeStyleSheetFromTheme((theme) => ({
    root: {
        position: 'absolute',
        width: 178,
        height: 178,
        borderRadius: 178 / 2,
        backgroundColor: theme.buttonBg,
    } as ViewStyle,
}));

const RippleIcon = () => {
    const theme = useTheme();
    const styles = getStyleFromTheme(theme);
    const interpolated = useSharedValue<number>(0);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: 0.7 * (1 - interpolated.value),
        transform: [{scale: 1 + (0.5 * interpolated.value)}],
    }));

    // EFFECTS
    useEffect(() => {
        interpolated.value = withRepeat(withTiming(1, {duration: DURATION, easing: EASING}), -1);
    }, []);

    return <Animated.View style={[styles.root, animatedStyle]}/>;
};

export default RippleIcon;
