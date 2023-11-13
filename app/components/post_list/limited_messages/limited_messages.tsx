// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';
import {Platform, View} from 'react-native';
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useCallsAdjustment} from '@calls/hooks';
import CompassIcon from '@components/compass_icon';
import FormattedText from '@components/formatted_text';
import TouchableWithFeedback from '@components/touchable_with_feedback';
import {useServerUrl} from '@context/server';
import {makeStyleSheetFromTheme, hexToHue} from '@utils/theme';
import {typography} from '@utils/typography';

type Props = {
    channelId: string;
    theme: Theme;
    testID: string;
    onClose: () => void;
}

export type KSuiteLimit = {
    limit: string;
    ignored: boolean;
}

const HIDDEN_TOP = -60;
const SHOWN_TOP = Platform.select({ios: 50, default: 5});
const MIN_INPUT = 0;
const MAX_INPUT = 1;

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        animatedContainer: {
            position: 'absolute',
            margin: 8,
            top: 16,
            backgroundColor: '#F4F6FD',
        },
        cancelContainer: {
            alignItems: 'center',
            width: 32,
            height: '100%',
            justifyContent: 'center',
        },
        container: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            paddingLeft: 12,
            width: '100%',
            paddingTop: 8,
            paddingBottom: 8,
            shadowColor: theme.centerChannelColor,
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.12,
            shadowRadius: 4,
        },
        roundBorder: {
            borderRadius: 8,
        },
        icon: {
            fontSize: 18,
            color: '#333333',
            alignSelf: 'center',
        },
        iconContainer: {
            top: 2,
            width: 22,
        },
        pressContainer: {
            flex: 1,
            flexDirection: 'row',
        },
        textContainer: {
            paddingLeft: 4,
        },
        text: {
            color: '#333333',
            ...typography('Body', 200, 'SemiBold'),
        },
    };
});

const LimitedMessages = ({
    channelId,
    testID,
    theme,
    onClose,
}: Props) => {
    const serverUrl = useServerUrl();
    const insets = useSafeAreaInsets();
    const underlayColor = useMemo(() => `hsl(${hexToHue(theme.buttonBg)}, 50%, 38%)`, [theme]);
    const top = useSharedValue(1);
    const callsAdjustment = useCallsAdjustment(serverUrl, channelId);

    // The final top:
    const adjustedTop = insets.top + callsAdjustment;

    const BARS_FACTOR = Math.abs((1) / (HIDDEN_TOP - SHOWN_TOP));

    const styles = getStyleSheet(theme);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{
            translateY: withSpring(interpolate(
                top.value,
                [
                    MIN_INPUT,
                    MIN_INPUT + BARS_FACTOR,
                    MAX_INPUT - BARS_FACTOR,
                    MAX_INPUT,
                ],
                [
                    HIDDEN_TOP,
                    HIDDEN_TOP,
                    adjustedTop,
                    adjustedTop,
                ],
                'clamp',
            ), {damping: 15}),
        }],
    }), [adjustedTop]);

    return (
        <Animated.View style={[styles.animatedContainer, styles.roundBorder, animatedStyle]}>
            <View style={styles.container}>
                <TouchableWithFeedback
                    type={'opacity'}
                    onPress={onClose}
                    underlayColor={underlayColor}
                    style={styles.pressContainer}
                    testID={testID}
                >
                    <View style={styles.textContainer}>
                        <FormattedText
                            id='infomaniak.messages_quota_exceeded.description'
                            defaultMessage='Messages and files older than 3 months are hidden. To view more messages, subscribe to a higher plan.'
                            style={styles.text}
                        />
                    </View>
                </TouchableWithFeedback>
                <TouchableWithFeedback
                    type='opacity'
                    onPress={onClose}
                >
                    <View style={styles.cancelContainer}>
                        <CompassIcon
                            name='close'
                            style={styles.icon}
                        />
                    </View>
                </TouchableWithFeedback>
            </View>
        </Animated.View>
    );
};

export default LimitedMessages;
