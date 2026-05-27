// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {createContext, useContext, type PropsWithChildren} from 'react';

import useAudioPlayer, {type PlaybackStatus} from '@hooks/audio_player';

type AudioPlayerContextValue = ReturnType<typeof useAudioPlayer>;

const AudioPlayerContext = createContext<AudioPlayerContextValue>({
    playing: null,
    playbackStatus: 'stopped' as PlaybackStatus,
    currentPosition: 0,
    duration: 0,
    speed: 1,
    isLoading: false,
    loadAudio: async () => undefined,
    pauseAudio: async () => undefined,
    playAudio: async () => undefined,
    stopAudio: async () => undefined,
    seekTo: async () => undefined,
    cycleSpeed: async () => undefined,
    storeLocalAudioURI: () => undefined,
});

export const AudioPlayerProvider = ({children}: PropsWithChildren) => {
    const value = useAudioPlayer();
    return (
        <AudioPlayerContext.Provider value={value}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayerContext = () => useContext(AudioPlayerContext);
