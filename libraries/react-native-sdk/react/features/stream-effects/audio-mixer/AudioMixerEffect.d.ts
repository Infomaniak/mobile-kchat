/**
 * Class Implementing the effect interface expected by a JitsiLocalTrack.
 * The AudioMixerEffect, as the name implies, mixes two JitsiLocalTracks containing a audio track. First track is
 * provided at the moment of creation, second is provided through the effect interface.
 */
export declare class AudioMixerEffect {
    /**
     * JitsiLocalTrack that is going to be mixed into the track that uses this effect.
     */
    _mixAudio: any;
    /**
     * MediaStream resulted from mixing.
     */
    _mixedMediaStream: any;
    /**
     * MediaStreamTrack obtained from mixed stream.
     */
    _mixedMediaTrack: Object;
    /**
     * Original MediaStream from the JitsiLocalTrack that uses this effect.
     */
    _originalStream: Object;
    /**
     * MediaStreamTrack obtained from the original MediaStream.
     */
    _originalTrack: any;
    /**
     * Lib-jitsi-meet AudioMixer.
     */
    _audioMixer: any;
    /**
     * Creates AudioMixerEffect.
     *
     * @param {JitsiLocalTrack} mixAudio - JitsiLocalTrack which will be mixed with the original track.
     */
    constructor(mixAudio: any);
    /**
     * Checks if the JitsiLocalTrack supports this effect.
     *
     * @param {JitsiLocalTrack} sourceLocalTrack - Track to which the effect will be applied.
     * @returns {boolean} - Returns true if this effect can run on the specified track, false otherwise.
     */
    isEnabled(sourceLocalTrack: any): any;
    /**
     * Effect interface called by source JitsiLocalTrack, At this point a WebAudio ChannelMergerNode is created
     * and and the two associated MediaStreams are connected to it; the resulting mixed MediaStream is returned.
     *
     * @param {MediaStream} audioStream - Audio stream which will be mixed with _mixAudio.
     * @returns {MediaStream} - MediaStream containing both audio tracks mixed together.
     */
    startEffect(audioStream: MediaStream): any;
    /**
     * Reset the AudioMixer stopping it in the process.
     *
     * @returns {void}
     */
    stopEffect(): void;
    /**
     * Change the muted state of the effect.
     *
     * @param {boolean} muted - Should effect be muted or not.
     * @returns {void}
     */
    setMuted(muted: boolean): void;
    /**
     * Check whether or not this effect is muted.
     *
     * @returns {boolean}
     */
    isMuted(): boolean;
}
