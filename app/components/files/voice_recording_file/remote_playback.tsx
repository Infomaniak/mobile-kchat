// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {Text, TouchableOpacity, View} from 'react-native';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import Slider from '@app/components/slider';
import {useAudioPlayerContext} from '@app/context/audio_player';
import {observeFilesForPost} from '@app/queries/servers/file';
import {mmssss} from '@app/utils/datetime';
import CompassIcon from '@components/compass_icon';
import TimeElapsed from '@components/post_draft/draft_input/voice_input/time_elapsed';
import {MIC_SIZE} from '@constants/view';
import {useTheme} from '@context/theme';
import {preventDoubleTap} from '@utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import type {WithDatabaseArgs} from '@typings/database/database';
import type PostModel from '@typings/database/models/servers/post';
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
            marginLeft: 12,
            marginRight: 12,
        },
        playBackContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            width: '100%',
        },
        error: {
            color: theme.errorTextColor,
            textAlign: 'center',
            marginTop: 3,
        },
    };
});

type EnhanceProps = {
    post: PostModel;
}

type Props = {
    files: FileInfo[];
}

const enhance = withObservables(['post'], ({database, post}: WithDatabaseArgs & EnhanceProps) => {
    const files = observeFilesForPost(database, post.id).pipe(switchMap((items) => of$(items)));
    return {
        files,
    };
});

const RemotePlayBack: React.FunctionComponent = ({files}: Props) => {
    const {id = null, width = 0} = files[0] ?? {};

    const theme = useTheme();
    const intl = useIntl();
    const styles = getStyleSheet(theme);

    const [timing, setTiming] = useState(mmssss(width));
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [status, setStatus] = useState<'stopped' | 'playing' | 'buffering'>('stopped');

    const {loadAudio, pauseAudio, playing} = useAudioPlayerContext();

    const isPlaying = playing === id && status === 'playing';

    const listener = (e: PlayBackType) => {
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

    const handleLoadError = () => {
        setError(intl.formatMessage({
            id: 'mobile.vocals.load_error',
            defaultMessage: 'Your audio file could not be loaded.',
        }));
    };

    return (
        <View>
            <View
                style={styles.playBackContainer}
            >
                <TouchableOpacity
                    style={styles.mic}
                    onPress={preventDoubleTap(async () => {
                        setStatus('stopped');
                        setError('');

                        if (isPlaying) {
                            pauseAudio();
                            return;
                        }

                        loadAudio(id, listener, handleLoadError);
                    })}
                >
                    <CompassIcon
                        color={theme.buttonBg}
                        name={isPlaying ? 'pause' : 'play'}
                        size={24}
                    />
                </TouchableOpacity>
                <Slider
                    value={(progress && width) ? (progress / width) * 100 : 0}
                    width='60%'
                />
                <TimeElapsed time={timing}/>
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

export default withDatabase(enhance(RemotePlayBack));
