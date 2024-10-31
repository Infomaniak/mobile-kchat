// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {Text, TouchableOpacity, View, Keyboard} from 'react-native';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {fetchPostById} from '@actions/remote/post';
import FormattedText from '@app/components/formatted_text';
import TranscriptIcon from '@app/components/illustrations/icon_transcript';
import Slider from '@app/components/slider';
import {Screens} from '@app/constants';
import {useAudioPlayerContext} from '@app/context/audio_player';
import {useServerUrl} from '@app/context/server';
import {observeFilesForPost} from '@app/queries/servers/file';
import {openAsBottomSheet} from '@app/screens/navigation';
import {mmssss} from '@app/utils/datetime';
import {getMarkdownTextStyles} from '@app/utils/markdown';
import CompassIcon from '@components/compass_icon';
import LoadingTranscript from '@components/illustrations/load_transcript';
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
            color: theme.centerChannelColor,
            textAlign: 'left',
            marginTop: 3,
        },
        transcriptText: {
            color: theme.centerChannelColor,
            fontSize: 13,
            textAlign: 'left',
            paddingTop: 3,
            overflow: 'hidden',
        },
        centeredView: {
            alignItems: 'flex-start',
            justifyContent: 'center',
        },
        loadingTranscript: {
            color: '#666666',
            fontWeight: '400',
            textAlign: 'center',
        },
        loadingMessage: {
            paddingTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
        },
    };
});

type EnhanceProps = {
    post: PostModel;
}

type Props = {
    files: FileInfo[];
    currentPost: PostModel;
}

const enhance = withObservables(['post'], ({database, post}: WithDatabaseArgs & EnhanceProps) => {
    const files = observeFilesForPost(database, post.id).pipe(switchMap((items) => of$(items)));
    const currentPost = post.observe();

    return {
        files,
        currentPost,
    };
});

const RemotePlayBack: React.FunctionComponent = ({files, currentPost}: Props) => {
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
    const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
    const {loadAudio, pauseAudio, playing} = useAudioPlayerContext();
    const serverUrl = useServerUrl();

    const isPlaying = playing === id && status === 'playing';

    useEffect(() => {
        setIsLoadingTranscript(true);
        const handlePosts = async () => {
            try {
                await fetchPostById(serverUrl, currentPost.id);
            } catch (err) {
                setIsLoadingTranscript(false);

                /* empty */
            }
        };
        handlePosts();
        if (files[0]?.transcript) {
            try {
                const transcriptObj = JSON.parse(files[0].transcript);
                if (transcriptObj.text) {
                    setIsLoadingTranscript(false);
                    setTranscript(transcriptObj.text.trim());
                    setTranscriptDatas(transcriptObj);
                } else {
                    setIsLoadingTranscript(false);
                }
            } catch (err) {
                setIsLoadingTranscript(false);

                /* empty */
            }
        }
    }, [files[0]?.transcript]);

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

    const transcriptReady = (
        <View style={styles.loadingMessage}>
            <Text style={styles.loadingTranscript}>
                <FormattedText
                    id='mobile.vocals.transcript_title'
                    defaultMessage='Audio Transcript (auto-generated)'
                    style={{fontSize: 12}}
                />
            </Text>
        </View>

    );

    const loadingMessage = (
        <View style={styles.loadingMessage}>
            <LoadingTranscript/>
            <Text style={styles.loadingTranscript}>
                <FormattedText
                    style={{fontSize: 10}}
                    id='mobile.vocals.transcript_loading'
                    defaultMessage='Audio transcription in progress...'
                />
            </Text>
        </View>
    );

    const renderTranscriptMessage = () => {
        if (isLoadingTranscript) {
            return loadingMessage;
        }
        return transcriptReady;
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
                    <TranscriptIcon theme={theme}/>
                ) : (
                    <TranscriptIcon
                        theme={theme}
                        color='#0098FF'
                    />
                )}
            </View>
            <View style={styles.centeredView}>
                {transcript && (
                    <View>
                        <Text style={styles.transcriptText}>
                            {renderTranscriptMessage()}
                        </Text>
                    </View>
                )}
                {transcript && (
                    <View>
                        <Text
                            style={styles.transcriptText}
                            onPress={renderContent}
                        >
                            {transcript.length > 200 ? transcript.substring(0, 200) + '...' : transcript + ' '}
                            <FormattedText
                                style={{...textStyles.link, fontSize: 13}}
                                id={'mobile.vocals.loading_transcript'}
                                defaultMessage=' View transcript...'
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
