// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';

import {useAudioPlayerContext} from '@app/context/audio_player';
import useAudioPlayer from '@app/hooks/audio_player';
import CompassIcon from '@components/compass_icon';
import SoundWave from '@components/post_draft/draft_input/voice_input/sound_wave';
import TimeElapsed from '@components/post_draft/draft_input/voice_input/time_elapsed';
import {MIC_SIZE} from '@constants/view';
import {useTheme} from '@context/theme';
import {preventDoubleTap} from '@utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import type PostModel from '@typings/database/models/servers/post';

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        mic: {
            borderRadius: MIC_SIZE / 2,
            backgroundColor: changeOpacity(theme.buttonBg, 0.12),
            height: MIC_SIZE,
            width: MIC_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12,
        },
        playBackContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    };
});

type Props = {
    post?: PostModel;
    isDraft?: boolean;
}

const PlayBack = ({post, isDraft = false}: Props) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    const [timing, setTiming] = useState('');
    const [playingId, setPlayingId] = useState<string | undefined>();

    const {playAudio, pauseAudio, playing} = useAudioPlayerContext();
    const {formatter} = useAudioPlayer();

    useEffect(() => {
        return () => {
            pauseAudio();
        };
    }, []);

    const isPlaying = (isDraft && playing === 'draft') || playing === playingId;

    useEffect(() => {
        if (!isPlaying && playing) {
            setTiming('');
        }
    }, [playing]);

    const listener = (e: any) => {
        setTiming(formatter(Math.floor(e.currentPosition)).substring(0, 5));
    };

    return (
        <View
            style={styles.playBackContainer}
        >
            <TouchableOpacity
                style={styles.mic}
                onPress={preventDoubleTap(async () => {
                    if (isPlaying) {
                        pauseAudio();
                        return;
                    }

                    if (isDraft) {
                        playAudio(undefined, listener);
                        return;
                    }

                    const ids = await post?.files.fetchIds();
                    if (ids) {
                        setPlayingId(ids[0]);
                        playAudio(ids[0], listener);
                    }
                })}
            >
                <CompassIcon
                    color={theme.buttonBg}
                    name={isPlaying ? 'pause' : 'play'}
                    size={24}
                />
            </TouchableOpacity>
            <SoundWave animating={isPlaying}/>
            <TimeElapsed time={timing}/>
        </View>
    );
};

export default PlayBack;
