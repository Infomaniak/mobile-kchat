import { INoiseSuppressionConfig } from '../../base/config/configType';
/**
 * Class Implementing the effect interface expected by a JitsiLocalTrack.
 * Effect applies rnnoise denoising on a audio JitsiLocalTrack.
 */
export declare class NoiseSuppressionEffect {
    /**
     * Source that will be attached to the track affected by the effect.
     */
    private _audioSource;
    /**
     * Destination that will contain denoised audio from the audio worklet.
     */
    private _audioDestination;
    /**
     * `AudioWorkletProcessor` associated node.
     */
    private _noiseSuppressorNode?;
    /**
     * Audio track extracted from the original MediaStream to which the effect is applied.
     */
    private _originalMediaTrack;
    /**
     * Noise suppressed audio track extracted from the media destination node.
     */
    private _outputMediaTrack;
    /**
     * Configured options for noise suppression.
     */
    private _options?;
    /**
     * Instantiates a noise suppressor audio effect which will use either rnnoise or krisp.
     *
     * @param {INoiseSuppressionConfig} options - Configured options.
     */
    constructor(options?: INoiseSuppressionConfig);
    /**
     * Effect interface called by source JitsiLocalTrack.
     * Applies effect that uses a {@code NoiseSuppressor} service initialized with {@code RnnoiseProcessor}
     * for denoising.
     *
     * @param {MediaStream} audioStream - Audio stream which will be mixed with _mixAudio.
     * @returns {MediaStream} - MediaStream containing both audio tracks mixed together.
     */
    startEffect(audioStream: MediaStream): MediaStream;
    /**
     * Checks if the JitsiLocalTrack supports this effect.
     *
     * @param {JitsiLocalTrack} sourceLocalTrack - Track to which the effect will be applied.
     * @returns {boolean} - Returns true if this effect can run on the specified track, false otherwise.
     */
    isEnabled(sourceLocalTrack: any): boolean;
    /**
     * Clean up resources acquired by noise suppressor and rnnoise processor.
     *
     * @returns {void}
     */
    stopEffect(): void;
}
