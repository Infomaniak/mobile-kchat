// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {Text, TouchableOpacity, View, Keyboard} from 'react-native';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import FormattedText from '@app/components/formatted_text';
import Slider from '@app/components/slider';
import {Screens} from '@app/constants';
import {useAudioPlayerContext} from '@app/context/audio_player';
import {observeFilesForPost} from '@app/queries/servers/file';
import {openAsBottomSheet} from '@app/screens/navigation';
import {mmssss} from '@app/utils/datetime';
import {getMarkdownTextStyles} from '@app/utils/markdown';
import CompassIcon from '@components/compass_icon';
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
            marginRight: 12,
        },
        playBackContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            width: '100%',
            borderWidth: 1,
            borderColor: blendColors(theme.centerChannelBg, theme.centerChannelColor, 0.3),
            borderRadius: 6,
            padding: 7,
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
    const [loadingTranscript, setLoadingTranscript] = useState(false);

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

    const transcriptData = {
        task: 'transcribe',
        language: 'english',
        duration: 8.470000267028809,
        text: 'The beach was a popular spot on a hot summer day. People were swimming in the ocean, building sandcastles, and playing beach volleyball. People were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanvPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the oceanPeople were swimming in the ocean',
        segments: [
            {
                id: 0,
                seek: 0,
                start: 0.0,
                end: 3.319999933242798,
                text: ' The beach was a popular spot on a hot summer day.',
                tokens: [
                    50364, 440, 7534, 390, 257, 3743, 4008, 322, 257, 2368, 4266, 786, 13, 50530,
                ],
                temperature: 0.0,
                avg_logprob: -0.2860786020755768,
                compression_ratio: 1.2363636493682861,
                no_speech_prob: 0.00985979475080967,
            },
            {
                id: 1,
                seek: 3.5,
                start: 3.5,
                end: 6.0,
                text: 'People were swimming in the ocean,',
                tokens: [
                    12345, 678, 910, 1112, 1314, 1516, 1718, 1920,
                ],
                temperature: 0.1,
                avg_logprob: -0.3,
                compression_ratio: 1.2,
                no_speech_prob: 0.01,
            },
            {
                id: 2,
                seek: 6.5,
                start: 6.5,
                end: 8.0,
                text: 'building sandcastles, and playing beach volleyball.',
                tokens: [
                    2122, 2324, 2526, 2728, 2930, 3132, 3334, 3536,
                ],
                temperature: 0.2,
                avg_logprob: -0.4,
                compression_ratio: 1.3,
                no_speech_prob: 0.02,
            },
            {
                id: 0,
                seek: 0,
                start: 0.0,
                end: 3.319999933242798,
                text: ' The beach was a popular spot on a hot summer day.',
                tokens: [
                    50364, 440, 7534, 390, 257, 3743, 4008, 322, 257, 2368, 4266, 786, 13, 50530,
                ],
                temperature: 0.0,
                avg_logprob: -0.2860786020755768,
                compression_ratio: 1.2363636493682861,
                no_speech_prob: 0.00985979475080967,
            },
            {
                id: 0,
                seek: 0,
                start: 0.0,
                end: 3.319999933242798,
                text: ' The beach was a popular spot on a hot summer day.',
                tokens: [
                    50364, 440, 7534, 390, 257, 3743, 4008, 322, 257, 2368, 4266, 786, 13, 50530,
                ],
                temperature: 0.0,
                avg_logprob: -0.2860786020755768,
                compression_ratio: 1.2363636493682861,
                no_speech_prob: 0.00985979475080967,
            },
            {
                id: 0,
                seek: 0,
                start: 0.0,
                end: 3.319999933242798,
                text: ' The beach was a popular spot on a hot summer day.',
                tokens: [
                    50364, 440, 7534, 390, 257, 3743, 4008, 322, 257, 2368, 4266, 786, 13, 50530,
                ],
                temperature: 0.0,
                avg_logprob: -0.2860786020755768,
                compression_ratio: 1.2363636493682861,
                no_speech_prob: 0.00985979475080967,
            },
            {
                id: 0,
                seek: 0,
                start: 0.0,
                end: 3.319999933242798,
                text: ' The beach was a popular spot on a hot summer day.',
                tokens: [
                    50364, 440, 7534, 390, 257, 3743, 4008, 322, 257, 2368, 4266, 786, 13, 50530,
                ],
                temperature: 0.0,
                avg_logprob: -0.2860786020755768,
                compression_ratio: 1.2363636493682861,
                no_speech_prob: 0.00985979475080967,
            },
            {
                id: 0,
                seek: 0,
                start: 0.0,
                end: 3.319999933242798,
                text: ' The beach was a popular spot on a hot summer day.',
                tokens: [
                    50364, 440, 7534, 390, 257, 3743, 4008, 322, 257, 2368, 4266, 786, 13, 50530,
                ],
                temperature: 0.0,
                avg_logprob: -0.2860786020755768,
                compression_ratio: 1.2363636493682861,
                no_speech_prob: 0.00985979475080967,
            },
            {
                id: 0,
                seek: 0,
                start: 0.0,
                end: 3.319999933242798,
                text: ' The beach was a popular spot on a hot summer day.',
                tokens: [
                    50364, 440, 7534, 390, 257, 3743, 4008, 322, 257, 2368, 4266, 786, 13, 50530,
                ],
                temperature: 0.0,
                avg_logprob: -0.2860786020755768,
                compression_ratio: 1.2363636493682861,
                no_speech_prob: 0.00985979475080967,
            },
            {
                id: 0,
                seek: 0,
                start: 0.0,
                end: 3.319999933242798,
                text: ' The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day. a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.The beach was a popular spot on a hot summer day.',
                tokens: [
                    50364, 440, 7534, 390, 257, 3743, 4008, 322, 257, 2368, 4266, 786, 13, 50530,
                ],
                temperature: 0.0,
                avg_logprob: -0.2860786020755768,
                compression_ratio: 1.2363636493682861,
                no_speech_prob: 0.00985979475080967,
            },

        ],
    };

    const fetchTranscript = async () => {
        setLoadingTranscript(true);
        setTimeout(async () => {
            if (transcript) {
                setTranscript('');
                setLoadingTranscript(false);
                return;
            }
            setTranscript(transcriptData.text);
            setTranscriptDatas(transcriptData);
            setLoadingTranscript(false);
        }, 2000);
    };

    const toggleTranscript = () => {
        if (transcript) {
            setTranscript('');
            setLoadingTranscript(false);
        } else {
            fetchTranscript();
            setLoadingTranscript(true);
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
                <CompassIcon
                    color={theme.buttonBg}
                    name='menu'
                    size={24}
                    onPress={toggleTranscript}
                />
            </View>
            <View style={styles.centeredView}>
                {loadingTranscript &&
                <FormattedText
                    style={styles.transcriptText}
                    id={'mobile.vocals.loading_transcript'}
                    defaultMessage='Transcribing...'
                />}
                {transcript && (
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
