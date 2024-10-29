// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {useEffect} from 'react';
import {View} from 'react-native';
import Animated, {Easing, useSharedValue, useAnimatedStyle, withRepeat, withTiming} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';

type LoadingProps = {
    testID?: string;
}

const LoadingTranscript = ({
    testID,
}: LoadingProps) => {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 1000,
                easing: Easing.linear,
            }),
            -1,
        );
    }, [rotation]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{rotate: `${rotation.value}deg`}],
        };
    });

    return (
        <View
            testID={testID}
        >
            <Animated.View style={animatedStyle}>
                <Svg
                    width='14'
                    height='14'
                    viewBox='0 0 14 14'
                    fill='none'
                >
                    <Path
                        d='M14 7C14 5.61553 13.5895 4.26215 12.8203 3.11101C12.0511 1.95986 10.9579 1.06266 9.67878 0.532843C8.3997 0.00302983 6.99223 -0.135594 5.63437 0.134503C4.2765 0.4046 3.02922 1.07129 2.05025 2.05025C1.07128 3.02922 0.4046 4.2765 0.134503 5.63437C-0.135594 6.99223 0.00302985 8.3997 0.532843 9.67878C1.06266 10.9579 1.95986 12.0511 3.11101 12.8203C4.26215 13.5895 5.61553 14 7 14V12.4381C5.92444 12.4381 4.87304 12.1192 3.97875 11.5216C3.08446 10.9241 2.38744 10.0748 1.97584 9.08107C1.56425 8.08739 1.45655 6.99397 1.66638 5.93908C1.87622 4.88419 2.39414 3.91521 3.15468 3.15468C3.91521 2.39414 4.88419 1.87622 5.93908 1.66638C6.99397 1.45655 8.08739 1.56425 9.08107 1.97584C10.0748 2.38744 10.9241 3.08446 11.5216 3.97875C12.1192 4.87304 12.4381 5.92444 12.4381 7H14Z'
                        fill='#0098FF'
                    />
                </Svg>
            </Animated.View>
        </View>
    );
};

export default LoadingTranscript;
