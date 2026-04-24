// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useState} from 'react';
import AudioRecorderPlayer, {type PlayBackType} from 'react-native-audio-recorder-player';

import {buildFileUrl} from '@actions/remote/file';
import {useServerUrl} from '@context/server';
import NetworkManager from '@managers/network_manager';
import {logError, logInfo} from '@utils/log';

const useAudioPlayer = () => {
    const [playing, setPlaying] = useState<string | null>(null);
    const [player, setPlayer] = useState<AudioRecorderPlayer>(new AudioRecorderPlayer());
    const [localAudioURI, storeLocalAudioURI] = useState<string | undefined>();
    const serverUrl = useServerUrl();
    const client = NetworkManager.getClient(serverUrl);

    const loadAudio = async (audioId?: string, playBackListener?: (e: PlayBackType) => void, onLoadError?: () => void) => {
        try {
            const uri = audioId ? buildFileUrl(serverUrl, audioId) : localAudioURI!;
            const headers = {Authorization: client.getCurrentBearerToken()};

            // TODO: Delete this condition once ticket #285760 is solved
            if (audioId) {
                const exist = await fetch(uri, {method: 'HEAD', headers});

                if (!exist.ok) {
                    onLoadError?.();
                    logInfo(`File with id : ${audioId} does not exist`);
                    return;
                }
            }

            await player.startPlayer(uri, headers);

            player.addPlayBackListener((status) => {
                playBackListener?.(status);
            });
            setPlayer(player);
            setPlaying(audioId || 'draft');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('error', error);
            logInfo(error);
        }
    };

    const pauseAudio = async () => {
        try {
            await player?.pausePlayer();
        } catch (error) {
            logError(error);
        }
    };

    const playAudio = async () => {
        try {
            await player?.resumePlayer();
        } catch (error) {
            logError(error);
        }
    };

    const stopAudio = async () => {
        try {
            await player?.stopPlayer();
            player?.removePlayBackListener();
            setPlaying(null);
        } catch (error) {
            logError(error);
        }
    };

    const seekTo = () => {
        // if (player) {
        //     // player.setPositionAsync(ms);
        // }
    };

    return {loadAudio, pauseAudio, playAudio, stopAudio, seekTo, storeLocalAudioURI, playing};
};

export default useAudioPlayer;
