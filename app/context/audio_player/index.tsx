// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {createContext, useContext, type PropsWithChildren} from 'react';

import useAudioPlayer from '@hooks/audio_player';

export const AudioPlayerContext = createContext<{
    loadAudio: Function;
    pauseAudio: Function;
    playAudio: Function;
    seekTo: Function;
    storeLocalAudioURI: Function | null;
    playing: string | null;
}>({
    loadAudio: () => null,
    pauseAudio: () => null,
    playAudio: () => null,
    seekTo: () => null,
    storeLocalAudioURI: null,
    playing: null,
});

export const AudioPlayerProvider = ({children}: PropsWithChildren) => {
    const {loadAudio, pauseAudio, playAudio, seekTo, storeLocalAudioURI, playing} = useAudioPlayer();
    return (
        <AudioPlayerContext.Provider value={{loadAudio, pauseAudio, playAudio, seekTo, storeLocalAudioURI, playing}}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayerContext = () => useContext(AudioPlayerContext);
