// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useState} from 'react';
import {LayoutChangeEvent, StyleSheet, StyleProp, View, ViewStyle} from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming} from 'react-native-reanimated';

type ProgressBarProps = {
    color: string;
    progress: number;
    style?: StyleProp<ViewStyle>;
    indeterminate?: boolean;
}

const styles = StyleSheet.create({
    container: {
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
        overflow: 'hidden',
        width: '100%',
    },
    progressBar: {
        flex: 1,
    },
});

const ProgressBar = ({color, progress, style, indeterminate}: ProgressBarProps) => {
    const [width, setWidth] = useState(0);
    const opacity = useSharedValue(0);

    const indeterminateStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }), []);

    opacity.value = withRepeat(
        withTiming(1.0, {duration: 1000, easing: Easing.ease}),
        -1,
        true,
    );

    const progressValue = useSharedValue(progress);

    const progressAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX: withTiming(((progressValue.value * 0.5) - 0.5) * width, {duration: 200})},
                {scaleX: withTiming(progressValue.value ? progressValue.value : 0.0001, {duration: 200})},
            ],
        };
    }, [width]);

    useEffect(() => {
        progressValue.value = progress;
    }, [progress]);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        setWidth(e.nativeEvent.layout.width);
    }, []);

    return (
        <View
            onLayout={onLayout}
            style={[styles.container, style]}
        >
            <Animated.View
                style={[
                    styles.progressBar,
                    {
                        backgroundColor: color,
                        width,
                    },
                    progressAnimatedStyle,
                    indeterminate && progress === 1 ? indeterminateStyle : null,
                ]}
            />
        </View>
    );
};

export default ProgressBar;

