// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {Text, TouchableOpacity, View, Keyboard} from 'react-native';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {fetchTranscriptData} from '@actions/remote/channel';
import FormattedText from '@app/components/formatted_text';
import Slider from '@app/components/slider';
import {Screens} from '@app/constants';
import {useAudioPlayerContext} from '@app/context/audio_player';
import {useServerUrl} from '@app/context/server';
import {observeFilesForPost} from '@app/queries/servers/file';
import {openAsBottomSheet} from '@app/screens/navigation';
import {mmssss} from '@app/utils/datetime';
import {getMarkdownTextStyles} from '@app/utils/markdown';
import CompassIcon from '@components/compass_icon';
import Loading from '@components/loading';
import TimeElapsed from '@components/post_draft/draft_input/voice_input/time_elapsed';
import {MIC_SIZE} from '@constants/view';
import {useTheme} from '@context/theme';
import {preventDoubleTap} from '@utils/tap';
import {blendColors, changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

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
            marginRight: 2,
        },
        playBackContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            position: 'relative',
            width: '100%',
            borderWidth: 1,
            borderColor: blendColors(theme.centerChannelBg, theme.centerChannelColor, 0.3),
            borderRadius: 6,
            padding: 7,
            marginTop: 5,
        },
        error: {
            color: theme.errorTextColor,
            textAlign: 'center',
            marginTop: 3,
        },
        transcriptText: {
            color: theme.centerChannelColor,
            fontSize: 13,
            justifyContent: 'center',
            paddingTop: 5,
            overflow: 'hidden',
        },
        centeredView: {
            alignItems: 'center',
            justifyContent: 'center',
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
    const textStyles = getMarkdownTextStyles(theme);
    const [timing, setTiming] = useState(mmssss(width));
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [status, setStatus] = useState<'stopped' | 'playing' | 'buffering'>('stopped');
    const [transcript, setTranscript] = useState('');
    const [transcriptDatas, setTranscriptDatas] = useState({});
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
    const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
    const [hasFetchedTranscript, setHasFetchedTranscript] = useState(false);
    const {loadAudio, pauseAudio, playing} = useAudioPlayerContext();
    const serverUrl = useServerUrl();

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

    const fetchTranscript = () => {
        if (isTranscriptOpen) {
            setIsTranscriptOpen(false);
            return;
        }
        setIsTranscriptOpen(true);

        if (!hasFetchedTranscript && serverUrl && files[0]?.id) {
            setIsLoadingTranscript(true);
            fetchTranscriptData(serverUrl, files[0].id).
                then((trans) => {
                    setIsLoadingTranscript(false);
                    if (!trans.transcript.text) {
                        setError(intl.formatMessage({
                            id: 'mobile.vocals.transcript.error',
                            defaultMessage: 'The audio is empty.',
                        }));
                        return;
                    }
                    setTranscript(trans.transcript.text.trim());
                    setTranscriptDatas(trans.transcript);
                    setIsTranscriptOpen(true);
                    setHasFetchedTranscript(true);
                }).catch((err) => {
                    setIsLoadingTranscript(false);

                    if (err.status === 429) {
                        setError(intl.formatMessage({
                            id: 'mobile.vocals.transcript.too_many',
                            defaultMessage: 'Too many requests, please wait...',
                        }));
                    }
                });
        }
    };

    const renderContent = () => {
        if (!transcript) {
            return;
        }
        const screen = Screens.TRANSCRIPTION;
        const title = intl.formatMessage({id: 'post.options.title', defaultMessage: 'Options'});
        const closeButtonId = 'close-user-profile';
        const props = {transcriptDatas};

        Keyboard.dismiss();

        openAsBottomSheet({screen, title, theme, closeButtonId, props});
    };

    return (
        <View>
            <View style={styles.playBackContainer}>
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
                {isLoadingTranscript ? (
                    <Loading/>
                ) : (
                    <CompassIcon
                        color={theme.buttonBg}
                        name='menu'
                        size={24}
                        onPress={fetchTranscript}
                    />
                )}
            </View>
            <View style={styles.centeredView}>
                {transcript && isTranscriptOpen && (
                    <View>
                        <Text style={styles.transcriptText}>
                            {transcript.length > 200 ? transcript.substring(0, 200) + '...' : transcript}
                            <FormattedText
                                style={{...textStyles.link, fontSize: 13}}
                                id={'mobile.vocals.loading_transcript'}
                                defaultMessage=' View transcript...'
                                onPress={renderContent}
                            />
                        </Text>
                    </View>
                )}
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

export default withDatabase(enhance(RemotePlayBack));
