// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useRef, useState} from 'react';
import RNFS from 'react-native-fs';
import {createSound} from 'react-native-nitro-sound';

import {buildFileUrl} from '@actions/remote/file';
import {useServerUrl} from '@context/server';
import NetworkManager from '@managers/network_manager';
import {logError, logInfo} from '@utils/log';

// react-native-nitro-sound does not forward HTTP headers for remote URLs on iOS
// (setupEnginePlayer uses Data(contentsOf:) which ignores headers).
// Workaround: download to a temp file with auth headers, then play locally.
const downloadToTemp = async (uri: string, token: string, fileId: string): Promise<string> => {
    const tempPath = `${RNFS.CachesDirectoryPath}/audio_${fileId}.mp4`;
    const exists = await RNFS.exists(tempPath);
    if (!exists) {
        await RNFS.downloadFile({
            fromUrl: uri,
            toFile: tempPath,
            headers: {Authorization: token},
        }).promise;
    }
    return tempPath;
};

export type PlaybackStatus = 'stopped' | 'playing' | 'paused';

const SPEEDS = [1, 1.5, 2] as const;
export type PlaybackSpeed = typeof SPEEDS[number];

const useAudioPlayer = () => {
    const playerRef = useRef(createSound());
    const player = playerRef.current;

    const [localAudioURI, storeLocalAudioURI] = useState<string | undefined>();
    const [playing, setPlaying] = useState<string | null>(null);
    const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('stopped');
    const [currentPosition, setCurrentPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [speed, setSpeedState] = useState<PlaybackSpeed>(1);
    const isPausedRef = useRef(false);

    const serverUrl = useServerUrl();
    const client = NetworkManager.getClient(serverUrl);

    const loadAudio = async (audioId?: string, onLoadError?: () => void) => {
        try {
            const token = client.getCurrentBearerToken();
            const headers = {Authorization: token};
            let uri = audioId ? buildFileUrl(serverUrl, audioId) : localAudioURI!;

            if (audioId) {
                // TODO: Delete this condition once ticket #285760 is solved
                const exist = await fetch(uri, {method: 'HEAD', headers});
                if (!exist.ok) {
                    onLoadError?.();
                    logInfo(`File with id : ${audioId} does not exist`);
                    return;
                }

                // nitro-sound v0.2.13 does not forward HTTP headers for remote URLs on iOS
                // (setupEnginePlayer ignores the httpHeaders param — marked TODO in source).
                // Download to local cache with auth headers, then play locally.
                uri = await downloadToTemp(uri, token, audioId);
            }

            isPausedRef.current = false;
            await player.startPlayer(uri);

            player.addPlayBackListener((e) => {
                setCurrentPosition(e.currentPosition);
                setDuration(e.duration);

                if (e.currentPosition === e.duration) {
                    isPausedRef.current = false;
                    player.removePlayBackListener();
                    player.stopPlayer().catch(logError);
                    setPlaying(null);
                    setPlaybackStatus('stopped');
                    setCurrentPosition(0);
                    setSpeedState(1);
                    return;
                }

                if (!isPausedRef.current) {
                    setPlaybackStatus('playing');
                }
            });

            setPlaying(audioId ?? 'draft');
            setPlaybackStatus('playing');
        } catch (error) {
            logError('[useAudioPlayer.loadAudio]', error);
        }
    };

    const pauseAudio = async () => {
        try {
            isPausedRef.current = true;
            await player.pausePlayer();
            setPlaybackStatus('paused');
        } catch (error) {
            logError('[useAudioPlayer.pauseAudio]', error);
        }
    };

    const playAudio = async () => {
        try {
            isPausedRef.current = false;
            await player.resumePlayer();
        } catch (error) {
            logError('[useAudioPlayer.playAudio]', error);
        }
    };

    const stopAudio = async () => {
        try {
            isPausedRef.current = false;
            await player.stopPlayer();
            player.removePlayBackListener();
            setPlaying(null);
            setPlaybackStatus('stopped');
            setCurrentPosition(0);
            setSpeedState(1);
        } catch (error) {
            logError('[useAudioPlayer.stopAudio]', error);
        }
    };

    const seekTo = async (ms: number) => {
        try {
            await player.seekToPlayer(ms);
            setCurrentPosition(ms);
        } catch (error) {
            logError('[useAudioPlayer.seekTo]', error);
        }
    };

    const cycleSpeed = async () => {
        try {
            const nextSpeed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
            await player.setPlaybackSpeed(nextSpeed);
            setSpeedState(nextSpeed);
        } catch (error) {
            logError('[useAudioPlayer.cycleSpeed]', error);
        }
    };

    return {
        playing,
        playbackStatus,
        currentPosition,
        duration,
        speed,
        loadAudio,
        pauseAudio,
        playAudio,
        stopAudio,
        seekTo,
        cycleSpeed,
        storeLocalAudioURI,
    };
};

export default useAudioPlayer;
