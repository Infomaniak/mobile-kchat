// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useKeepAwake} from 'expo-keep-awake';
import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import AudioRecorderPlayer, {AVEncoderAudioQualityIOSType, AVEncodingOption, AVModeIOSOption, AudioEncoderAndroidType, AudioSourceAndroidType, type AudioSet} from 'react-native-audio-recorder-player';

import {useAudioPlayerContext} from '@app/context/audio_player';
import {mmssss} from '@app/utils/datetime';
import CompassIcon from '@components/compass_icon';
import {MIC_SIZE} from '@constants/view';
import {useTheme} from '@context/theme';
import {deleteDeviceFile, extractFileInfo} from '@utils/file';
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
            paddingHorizontal: 10,
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
    const {storeLocalAudioURI} = useAudioPlayerContext();
    const [url, setUrl] = useState<string>();
    const [timing, setTiming] = useState('00:00');
    const [recorder, setRecorder] = useState<AudioRecorderPlayer>();
    const [recordData, setRecordData] = useState<Array<{ metering: number; isNew: boolean }>>([]);

    // Prevent the device from going to sleep while recording
    useKeepAwake();

    useEffect(() => {
        const record = async () => {
            const audioRecorderPlayer = new AudioRecorderPlayer();

            const audioSet: AudioSet = {
                AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                AudioSourceAndroid: AudioSourceAndroidType.MIC,
                AVModeIOS: AVModeIOSOption.measurement,
                AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
                AVNumberOfChannelsKeyIOS: 2,
                AVFormatIDKeyIOS: AVEncodingOption.aac,
            };

            await audioRecorderPlayer.setSubscriptionDuration(0.1);
            const audioPath = await audioRecorderPlayer.startRecorder(undefined, audioSet, true);

            audioRecorderPlayer.addRecordBackListener((e) => {
                setTiming(mmssss(
                    Math.floor(e.currentPosition),
                ));
                // eslint-disable-next-line max-nested-callbacks
                setRecordData((data) => [...(data.map((i) => ({...i, isNew: false}))), {metering: e.currentMetering ?? -160, isNew: true}].slice(-50));
            });

            setUrl(audioPath);
            setRecording(true);
            setRecorder(audioRecorderPlayer);
        };

        record();
    }, []);

    const disableRecord = async (shouldDelete = false) => {
        setRecording(false);
        setRecorder(undefined);
        await recorder?.stopRecorder();
        recorder?.removeRecordBackListener();

        if (shouldDelete && url) {
            deleteDeviceFile(url);
        }
    };

    const cancelRecording = useCallback(async () => {
        disableRecord(true);
        onClose();
    }, [recorder]);

    const endRecording = useCallback(async () => {
        disableRecord();
        onClose();
        if (recorder && url) {
            storeLocalAudioURI?.(url);
            const fi = await extractFileInfo([{uri: url}]);

            fi[0].is_voice_recording = true;
            fi[0].uri = url;

            addFiles(fi as FileInfo[]);
        }
    }, [recorder]);

    return (
        <View style={styles.mainContainer}>
            <AnimatedMicrophone/>
            <SoundWave
                amplitudes={recordData}
            />
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
                onPress={endRecording}
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
