"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioMixerEffect = void 0;
const lib_jitsi_meet_1 = __importDefault(require("../../base/lib-jitsi-meet"));
const constants_1 = require("../../base/media/constants");
/**
 * Class Implementing the effect interface expected by a JitsiLocalTrack.
 * The AudioMixerEffect, as the name implies, mixes two JitsiLocalTracks containing a audio track. First track is
 * provided at the moment of creation, second is provided through the effect interface.
 */
class AudioMixerEffect {
    /**
     * Creates AudioMixerEffect.
     *
     * @param {JitsiLocalTrack} mixAudio - JitsiLocalTrack which will be mixed with the original track.
     */
    constructor(mixAudio) {
        if (mixAudio.getType() !== constants_1.MEDIA_TYPE.AUDIO) {
            throw new Error('AudioMixerEffect only supports audio JitsiLocalTracks; effect will not work!');
        }
        this._mixAudio = mixAudio;
    }
    /**
     * Checks if the JitsiLocalTrack supports this effect.
     *
     * @param {JitsiLocalTrack} sourceLocalTrack - Track to which the effect will be applied.
     * @returns {boolean} - Returns true if this effect can run on the specified track, false otherwise.
     */
    isEnabled(sourceLocalTrack) {
        // Both JitsiLocalTracks need to be audio i.e. contain an audio MediaStreamTrack
        return sourceLocalTrack.isAudioTrack() && this._mixAudio.isAudioTrack();
    }
    /**
     * Effect interface called by source JitsiLocalTrack, At this point a WebAudio ChannelMergerNode is created
     * and and the two associated MediaStreams are connected to it; the resulting mixed MediaStream is returned.
     *
     * @param {MediaStream} audioStream - Audio stream which will be mixed with _mixAudio.
     * @returns {MediaStream} - MediaStream containing both audio tracks mixed together.
     */
    startEffect(audioStream) {
        this._originalStream = audioStream;
        this._originalTrack = audioStream.getTracks()[0];
        this._audioMixer = lib_jitsi_meet_1.default.createAudioMixer();
        this._audioMixer.addMediaStream(this._mixAudio.getOriginalStream());
        this._audioMixer.addMediaStream(this._originalStream);
        this._mixedMediaStream = this._audioMixer.start();
        this._mixedMediaTrack = this._mixedMediaStream.getTracks()[0];
        return this._mixedMediaStream;
    }
    /**
     * Reset the AudioMixer stopping it in the process.
     *
     * @returns {void}
     */
    stopEffect() {
        this._audioMixer.reset();
    }
    /**
     * Change the muted state of the effect.
     *
     * @param {boolean} muted - Should effect be muted or not.
     * @returns {void}
     */
    setMuted(muted) {
        this._originalTrack.enabled = !muted;
    }
    /**
     * Check whether or not this effect is muted.
     *
     * @returns {boolean}
     */
    isMuted() {
        return !this._originalTrack.enabled;
    }
}
exports.AudioMixerEffect = AudioMixerEffect;
