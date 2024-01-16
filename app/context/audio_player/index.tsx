// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {createContext, useContext, type PropsWithChildren} from 'react';

import useAudioPlayer from '@app/hooks/audio_player';

export const AudioPlayerContext = createContext<{
    playAudio: Function;
    pauseAudio: Function;
    playing: string | null;
}>({playAudio: () => null, pauseAudio: () => null, playing: null});

export const AudioPlayerProvider = ({children}: PropsWithChildren) => {
    const {playAudio, pauseAudio, playing} = useAudioPlayer();
    return (
        <AudioPlayerContext.Provider value={{playAudio, pauseAudio, playing}}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayerContext = () => useContext(AudioPlayerContext);
