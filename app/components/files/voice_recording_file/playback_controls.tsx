// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Slider from '@react-native-community/slider';
import React, {useCallback} from 'react';
import {Pressable, Text} from 'react-native';

import CompassIcon from '@components/compass_icon';
import TimeElapsed from '@components/post_draft/draft_input/voice_input/time_elapsed';
import {MIC_SIZE} from '@constants/view';
import {useAudioPlayerContext} from '@context/audio_player';
import {useTheme} from '@context/theme';
import {mmssss} from '@utils/datetime';
import {preventDoubleTap} from '@utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

const getStyleSheet = makeStyleSheetFromTheme((theme) => ({
    mic: {
        borderRadius: MIC_SIZE / 2,
        backgroundColor: changeOpacity(theme.buttonBg, 0.12),
        height: MIC_SIZE,
        width: MIC_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    speedButton: {
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 4,
        backgroundColor: changeOpacity(theme.buttonBg, 0.12),
    },
    speedText: {
        color: theme.buttonBg,
        ...typography('Body', 75, 'SemiBold'),
    },
    slider: {
        flex: 1,
    },
}));

type Props = {
    audioId?: string;
    totalDuration?: number;
    onLoadError?: () => void;
}

const PlaybackControls = ({audioId, totalDuration, onLoadError}: Props) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const {
        loadAudio, pauseAudio, playAudio, seekTo, cycleSpeed,
        playing, playbackStatus, currentPosition, duration, speed,
    } = useAudioPlayerContext();

    const activeId = audioId ?? 'draft';
    const isThisActive = playing === activeId;
    const isPlaying = isThisActive && playbackStatus === 'playing';
    const isPaused = isThisActive && playbackStatus === 'paused';

    const effectiveDuration = (isThisActive ? duration : 0) || totalDuration || 0;
    const sliderValue = (isThisActive && effectiveDuration) ? currentPosition / effectiveDuration : 0;
    const displayTime = isThisActive ? mmssss(currentPosition) : mmssss(totalDuration ?? 0);

    const onPressPlay = preventDoubleTap(() => {
        if (isPlaying) {
            pauseAudio();
            return;
        }
        if (isPaused) {
            playAudio();
            return;
        }
        loadAudio(audioId, onLoadError);
    });

    const onSeek = useCallback((value: number) => {
        if (isThisActive && effectiveDuration) {
            seekTo(Math.round(value * effectiveDuration));
        }
    }, [isThisActive, effectiveDuration, seekTo]);

    return (
        <>
            <Pressable
                style={({pressed}) => [styles.mic, pressed && {opacity: 0.7}]}
                onPress={onPressPlay}
            >
                <CompassIcon
                    color={theme.buttonBg}
                    name={isPlaying ? 'pause' : 'play'}
                    size={24}
                />
            </Pressable>
            <Slider
                style={styles.slider}
                value={sliderValue}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={theme.buttonBg}
                maximumTrackTintColor={changeOpacity(theme.buttonBg, 0.3)}
                thumbTintColor={theme.buttonBg}
                onSlidingComplete={onSeek}
                disabled={!isThisActive}

            />
            <TimeElapsed time={displayTime}/>
            <Pressable
                style={({pressed}) => [styles.speedButton, pressed && {opacity: 0.7}]}
                onPress={cycleSpeed}
            >
                <Text style={styles.speedText}>{`${speed}x`}</Text>
            </Pressable>
        </>
    );
};

export default PlaybackControls;
