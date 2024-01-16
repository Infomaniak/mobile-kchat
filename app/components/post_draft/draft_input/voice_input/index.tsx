// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import CompassIcon from '@components/compass_icon';
import {MIC_SIZE} from '@constants/view';
import {useTheme} from '@context/theme';
import {extractFileInfo} from '@utils/file';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import AnimatedMicrophone from './animated_microphone';
import SoundWave from './sound_wave';
import TimeElapsed from './time_elapsed';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    const iconCommon = {
        height: MIC_SIZE,
        width: MIC_SIZE,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    };

    const round = {
        borderRadius: MIC_SIZE / 2,
        backgroundColor: changeOpacity(theme.buttonBg, 0.12),
    };

    return {
        mainContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            height: 88,
        },
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
        mic: {
            ...iconCommon,
            ...round,
        },
        check: {
            ...iconCommon,
            ...round,
            backgroundColor: theme.buttonBg,
        },
        close: {
            ...iconCommon,
        },
    };
});

type VoiceInputProps = {
    setRecording: (v: boolean) => void;
    addFiles: (f: FileInfo[]) => void;
    onClose: () => void;
}
const VoiceInput = ({onClose, addFiles, setRecording}: VoiceInputProps) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const [timing, setTiming] = useState('00:00');
    const [animating, setAnimating] = useState(false);
    const audioRecorderPlayer = new AudioRecorderPlayer();

    useEffect(() => {
        const record = async () => {
            await audioRecorderPlayer.startRecorder();
            setRecording(true);
            audioRecorderPlayer.addRecordBackListener((e) => {
                setAnimating(true);
                setTiming(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)).substring(0, 5));
            });
        };

        record();
    }, []);

    const cancelRecording = useCallback(async () => {
        setAnimating(false);
        await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setRecording(false);
        onClose();
    }, []);

    const endRecording = useCallback(async () => {
        setAnimating(false);
        setRecording(false);

        const url = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        const fi = await extractFileInfo([{uri: url}]);
        fi[0].is_voice_recording = true;
        fi[0].uri = url;

        addFiles(fi as FileInfo[]);
    }, []);

    return (
        <View style={styles.mainContainer}>
            <AnimatedMicrophone/>
            <SoundWave animating={animating}/>
            <TimeElapsed time={timing}/>
            <TouchableOpacity
                style={styles.close}
                onPress={cancelRecording}
            >
                <CompassIcon
                    color={theme.buttonBg}
                    name='close'
                    size={24}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.check}
                onPress={endRecording} // to be fixed when wiring is completed
            >
                <CompassIcon
                    color={theme.buttonColor}
                    name='check'
                    size={24}
                />
            </TouchableOpacity>
        </View>
    );
};

export default VoiceInput;
