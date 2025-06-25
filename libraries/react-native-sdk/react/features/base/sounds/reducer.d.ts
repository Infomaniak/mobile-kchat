import { AudioElement } from '../media/components/AbstractAudio';
/**
 * The structure use by this reducer to describe a sound.
 */
export type Sound = {
    /**
     * The HTMLAudioElement which implements the audio playback functionality.
     * Becomes available once the sound resource gets loaded and the sound can
     * not be played until that happens.
     */
    audioElement?: AudioElement;
    /**
     * This field is container for all optional parameters related to the sound.
     */
    options?: {
        loop: boolean;
    };
    /**
     * This field describes the source of the audio resource to be played. It
     * can be either a path to the file or an object depending on the platform
     * (native vs web).
     */
    src?: Object | string;
};
export type ISoundsState = Map<string, Sound>;
