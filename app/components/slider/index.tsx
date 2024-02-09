// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, type StyleProp, type ViewStyle, type DimensionValue} from 'react-native';

import {useTheme} from '@context/theme';

import ProgressBar from '../progress_bar';

type Props = {
    style?: StyleProp<ViewStyle>;
    minimumValue?: number;
    maximumValue?: number;
    value?: number;
    width?: DimensionValue;
}

const Slider = ({style, value, minimumValue = 0, maximumValue = 100, width = '100%'}: Props) => {
    const [sliderValue, setSliderValue] = useState(minimumValue);
    const sliderWidthRef = useRef(0);
    const theme = useTheme();

    useEffect(() => {
        if (value) {
            setSliderValue(value);
        }
    }, [value]);

    return (
        <View
            style={[styles.slider, style, {width}]}
            onLayout={(event) => {
                sliderWidthRef.current = event.nativeEvent.layout.width;
            }}
        >
            <ProgressBar
                progress={sliderValue / (maximumValue - minimumValue)}
                color={theme.buttonBg}
                bgColor={'rgba(0, 152, 255, 0.5)'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    slider: {
        height: 40,
        justifyContent: 'center',
    },
    thumb: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#0098ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Slider;
