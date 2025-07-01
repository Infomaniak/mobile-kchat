// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {Text, TouchableOpacity, View} from 'react-native';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {fetchPostById} from '@actions/remote/post';
import CompassIcon from '@components/compass_icon';
import FormattedText from '@components/formatted_text';
import Loading from '@components/loading';
import TimeElapsed from '@components/post_draft/draft_input/voice_input/time_elapsed';
import Slider from '@components/slider';
import {MIC_SIZE} from '@constants/view';
import {useAudioPlayerContext} from '@context/audio_player';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {observeFilesForPost} from '@queries/servers/file';
import {mmssss} from '@utils/datetime';
import {preventDoubleTap} from '@utils/tap';
import {blendColors, changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import {extractTranscript} from './utils';

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
            textAlign: 'left',
            overflow: 'hidden',
            fontSize: 16,
            lineHeight: 20,
            paddingTop: 1,
        },
        openVoiceMessageButtonText: {
            fontSize: 14,
            color: '#3F4350BF',
        },
        centeredView: {
            alignItems: 'flex-start',
            justifyContent: 'center',
        },
        transcriptContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        openVoiceMessageButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 10,
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
    const [timing, setTiming] = useState(mmssss(width));
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [status, setStatus] = useState<'stopped' | 'playing' | 'buffering'>('stopped');
    const [transcript, setTranscript] = useState('');
    const [isOpen, setIsOpen] = useState(false);
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
        const text = extractTranscript(files[0]);
        setTranscript(text);
        setIsLoadingTranscript(false);
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

    return (
        <View>
            <View style={styles.centeredView}>
                {isLoadingTranscript &&
                    <View style={styles.transcriptContainer}>
                        <Loading
                            color='#0098FF'
                            containerStyle={{marginRight: 8}}
                            size='small'
                        />
                        <Text style={styles.openVoiceMessageButtonText}>
                            <FormattedText
                                id={'mobile.vocals.transcript_loading'}
                                defaultMessage='Audio transcription in progress...'
                            />
                        </Text>
                    </View>
                }
                {!isLoadingTranscript && transcript.length > 0 &&
                    <Text style={styles.transcriptText}>{transcript}</Text>
                }
            </View>
            <TouchableOpacity
                onPress={() => setIsOpen((prev) => !prev)}
                style={styles.openVoiceMessageButton}
            >
                <CompassIcon
                    name={isOpen ? 'chevron-down' : 'chevron-right'}
                    size={15}
                    color={'#636780'}
                    style={{marginTop: 1}}
                />
                <FormattedText
                    style={styles.openVoiceMessageButtonText}
                    id={'mobile.vocals.transcript.show'}
                    defaultMessage='Listen to the message'
                />
            </TouchableOpacity>

            {isOpen && (
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
                </View>
            )}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

export default withDatabase(enhance(RemotePlayBack));
