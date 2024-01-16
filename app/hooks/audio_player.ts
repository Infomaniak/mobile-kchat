// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useState, useEffect} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';

import {buildFileUrl} from '@actions/remote/file';
import {useServerUrl} from '@app/context/server';
import {logInfo} from '@app/utils/log';
import {urlSafeBase64Encode} from '@app/utils/security';
import NetworkManager from '@managers/network_manager';

const audioPlayer = new AudioRecorderPlayer();

const useAudioPlayer = () => {
    const [playing, setPlaying] = useState<string | null>(null);
    const serverUrl = useServerUrl();
    const client = NetworkManager.getClient(serverUrl);

    useEffect(() => {
        return () => {
            audioPlayer.stopPlayer();
            audioPlayer.removePlayBackListener();
        };
    }, []);

    const playAudio = async (audioId?: string, playBackListener?: (e: any) => void) => {
        let internalUrl;
        if (audioId) {
            const dir = RNFetchBlob.fs.dirs.CacheDir;
            const uri = buildFileUrl(serverUrl, audioId);
            const path = `${dir}/${urlSafeBase64Encode(uri)}.m4a`;

            const res = await RNFetchBlob.config({
                fileCache: false,
                appendExt: 'm4a',
                path,
            }).fetch('GET', uri, {Authorization: client.getCurrentBearerToken()});

            internalUrl = `file://${res.path()}`;
        }

        try {
            await audioPlayer.stopPlayer();
            audioPlayer.removePlayBackListener();
            setPlaying(audioId || 'draft');
            await audioPlayer.startPlayer(
                internalUrl ?? undefined,
            );
            audioPlayer.addPlayBackListener((e: any) => {
                if (e.currentPosition === e.duration) {
                    setPlaying(null);
                }
                playBackListener?.(e);
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            logInfo(error);
        }
    };

    const pauseAudio = () => {
        audioPlayer.pausePlayer();
        setPlaying(null);
    };

    return {playAudio, pauseAudio, playing, formatter: audioPlayer.mmssss};
};

export default useAudioPlayer;
