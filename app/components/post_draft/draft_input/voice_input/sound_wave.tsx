// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import {View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';

import {VOICE_MIN_AMPLITUDE, WAVEFORM_HEIGHT} from '@constants/view';
import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            height: WAVEFORM_HEIGHT,
            width: 165,
            flexDirection: 'row',
            overflow: 'hidden',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginLeft: 15,
        },
        singleBar: {
            height: WAVEFORM_HEIGHT,
            width: 2,
            backgroundColor: theme.buttonBg,
            marginRight: 3,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
        },
    };
});

type SoundWaveProps = {
    amplitudes: Array<{ metering: number; isNew: boolean }>;
};

type ItemProps = {
    amplitude: number;
    isNew: boolean;
};

const SoundItem = ({amplitude, isNew}: ItemProps) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const scaleHeightAnimation = useSharedValue(6);
    const opacityAnimation = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        height: scaleHeightAnimation.value,
        opacity: opacityAnimation.value,
    }));

    const value = Math.max(-VOICE_MIN_AMPLITUDE, amplitude);
    const amplitudePercentage = Math.max(0.3, (value + VOICE_MIN_AMPLITUDE) / VOICE_MIN_AMPLITUDE);
    const height = amplitudePercentage * 20;

    useEffect(() => {
        scaleHeightAnimation.value = isNew ? withSpring(height, {duration: 1000}) : height;
        opacityAnimation.value = isNew ? withSpring(1, {duration: 500}) : 1;
    }, [height, isNew]);

    return (
        <Animated.View
            style={[
                styles.singleBar,
                animatedStyle,
            ]}
        />);
};

const SoundWave = ({amplitudes}: SoundWaveProps) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    return (
        <View style={styles.container}>
            {amplitudes.map((item, idx) => (
                <SoundItem
                    key={idx}
                    amplitude={item.metering}
                    isNew={item.isNew}
                />))}
        </View>
    );
};

export default SoundWave;
