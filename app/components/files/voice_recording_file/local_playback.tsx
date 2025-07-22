// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';

import Slider from '@components/slider';
import {useAudioPlayerContext} from '@context/audio_player';
import {mmssss} from '@utils/datetime';
import CompassIcon from '@components/compass_icon';
import TimeElapsed from '@components/post_draft/draft_input/voice_input/time_elapsed';
import {MIC_SIZE} from '@constants/view';
import {useTheme} from '@context/theme';
import {preventDoubleTap} from '@utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import type {PlayBackType} from 'react-native-audio-recorder-player';

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        mic: {
            borderRadius: MIC_SIZE / 2,
            backgroundColor: changeOpacity(theme.buttonBg, 0.12),
            height: MIC_SIZE,
            width: MIC_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        playBackContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: '100%',
        },
    };
});

const LocalPlayBack = () => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    const [timing, setTiming] = useState('00:00');
    const [status, setStatus] = useState<'stopped' | 'playing' | 'buffering'>('stopped');
    const [duration, setDuration] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);

    const {loadAudio, pauseAudio, playing} = useAudioPlayerContext();

    const isPlaying = playing === 'draft' && status === 'playing';

    const listener = (e: PlayBackType) => {
        // Set timing and ms progress for progress bar

        setDuration(e.duration);
        setProgress(e.currentPosition);
        setTiming(mmssss(e.currentPosition));

        if (e.currentPosition === e.duration) {
            pauseAudio();
            setStatus('stopped');
            return;
        }

        // Otherwise must be playing
        setStatus('playing');
    };

    return (
        <View
            style={styles.playBackContainer}
        >
            <TouchableOpacity
                style={styles.mic}
                onPress={preventDoubleTap(() => {
                    if (isPlaying) {
                        pauseAudio();
                        setStatus('stopped');
                        return;
                    }

                    loadAudio(undefined, listener);
                })}
            >
                <CompassIcon
                    color={theme.buttonBg}
                    name={isPlaying ? 'pause' : 'play'}
                    size={24}
                />
            </TouchableOpacity>
            <Slider
                value={(progress && duration) ? (progress / duration) * 100 : 0}

                // WIP: Thumb for seeking
                // onValueCommit={(val) => seekTo(duration ? (duration * val) / 100 : 0)}
                width='50%'
            />
            <TimeElapsed time={timing}/>
        </View>
    );
};

export default LocalPlayBack;
