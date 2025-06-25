"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoiseSuppressionEffect = void 0;
const helpers_1 = require("../../base/util/helpers");
const logger_1 = __importDefault(require("./logger"));
const krispState = {
    filterNode: undefined,
    filterNodeReady: false,
    sdk: undefined,
    sdkInitialized: false
};
let audioContext;
/**
 * Class Implementing the effect interface expected by a JitsiLocalTrack.
 * Effect applies rnnoise denoising on a audio JitsiLocalTrack.
 */
class NoiseSuppressionEffect {
    /**
     * Instantiates a noise suppressor audio effect which will use either rnnoise or krisp.
     *
     * @param {INoiseSuppressionConfig} options - Configured options.
     */
    constructor(options) {
        this._options = options;
        const useKrisp = options?.krisp?.enabled;
        logger_1.default.info(`NoiseSuppressionEffect created with ${useKrisp ? 'Krisp' : 'RNNoise'}`);
    }
    /**
     * Effect interface called by source JitsiLocalTrack.
     * Applies effect that uses a {@code NoiseSuppressor} service initialized with {@code RnnoiseProcessor}
     * for denoising.
     *
     * @param {MediaStream} audioStream - Audio stream which will be mixed with _mixAudio.
     * @returns {MediaStream} - MediaStream containing both audio tracks mixed together.
     */
    startEffect(audioStream) {
        this._originalMediaTrack = audioStream.getAudioTracks()[0];
        if (!audioContext) {
            audioContext = new AudioContext();
        }
        this._audioSource = audioContext.createMediaStreamSource(audioStream);
        this._audioDestination = audioContext.createMediaStreamDestination();
        this._outputMediaTrack = this._audioDestination.stream.getAudioTracks()[0];
        let init;
        if (this._options?.krisp?.enabled) {
            init = _initializeKrisp(this._options).then(filterNode => {
                this._noiseSuppressorNode = filterNode;
                if (krispState.filterNodeReady) {
                    // @ts-ignore
                    krispState.filterNode?.enable();
                }
            });
        }
        else {
            init = _initializeKRnnoise().then(filterNode => {
                this._noiseSuppressorNode = filterNode;
            });
        }
        // Connect the audio processing graph MediaStream -> AudioWorkletNode -> MediaStreamAudioDestinationNode
        init.then(() => {
            if (this._noiseSuppressorNode) {
                this._audioSource.connect(this._noiseSuppressorNode);
                this._noiseSuppressorNode.connect(this._audioDestination);
            }
        });
        // Sync the effect track muted state with the original track state.
        this._outputMediaTrack.enabled = this._originalMediaTrack.enabled;
        // We enable the audio on the original track because mute/unmute action will only affect the audio destination
        // output track from this point on.
        this._originalMediaTrack.enabled = true;
        return this._audioDestination.stream;
    }
    /**
     * Checks if the JitsiLocalTrack supports this effect.
     *
     * @param {JitsiLocalTrack} sourceLocalTrack - Track to which the effect will be applied.
     * @returns {boolean} - Returns true if this effect can run on the specified track, false otherwise.
     */
    isEnabled(sourceLocalTrack) {
        // JitsiLocalTracks needs to be an audio track.
        return sourceLocalTrack.isAudioTrack();
    }
    /**
     * Clean up resources acquired by noise suppressor and rnnoise processor.
     *
     * @returns {void}
     */
    stopEffect() {
        // Sync original track muted state with effect state before removing the effect.
        this._originalMediaTrack.enabled = this._outputMediaTrack.enabled;
        if (this._options?.krisp?.enabled) {
            // When using Krisp we'll just disable the filter which we'll keep reusing.
            // @ts-ignore
            this._noiseSuppressorNode?.disable();
        }
        else {
            // Technically after this process the Audio Worklet along with it's resources should be garbage collected,
            // however on chrome there seems to be a problem as described here:
            // https://bugs.chromium.org/p/chromium/issues/detail?id=1298955
            this._noiseSuppressorNode?.port?.close();
        }
        this._audioDestination?.disconnect();
        this._noiseSuppressorNode?.disconnect();
        this._audioSource?.disconnect();
        audioContext.suspend();
    }
}
exports.NoiseSuppressionEffect = NoiseSuppressionEffect;
/**
 * Initializes the Krisp SDK and creates the filter node.
 *
 * @param {INoiseSuppressionConfig} options - Krisp options.
 *
 * @returns {Promise<AudioWorkletNode | undefined>}
 */
async function _initializeKrisp(options) {
    await audioContext.resume();
    if (!krispState.sdk) {
        const baseUrl = `${(0, helpers_1.getBaseUrl)()}libs/krisp`;
        const { default: KrispSDK } = await Promise.resolve(`${`${baseUrl}/krispsdk.mjs`}`).then(s => __importStar(require(s)));
        krispState.sdk = new KrispSDK({
            params: {
                models: {
                    model8: `${baseUrl}/models/model_8.kw`,
                    model16: `${baseUrl}/models/model_16.kw`,
                    model32: `${baseUrl}/models/model_32.kw`
                },
                logProcessStats: options?.krisp?.logProcessStats,
                debugLogs: options?.krisp?.debugLogs
            },
            callbacks: {}
        });
    }
    if (!krispState.sdkInitialized) {
        // @ts-ignore
        await krispState.sdk?.init();
        krispState.sdkInitialized = true;
    }
    if (!krispState.filterNode) {
        try {
            // @ts-ignore
            krispState.filterNode = await krispState.sdk?.createNoiseFilter(audioContext, () => {
                logger_1.default.info('Krisp audio filter ready');
                // Enable audio filtering.
                // @ts-ignore
                krispState.filterNode?.enable();
                krispState.filterNodeReady = true;
            });
        }
        catch (e) {
            logger_1.default.error('Failed to create Krisp noise filter', e);
            krispState.filterNode = undefined;
            krispState.filterNodeReady = false;
        }
    }
    return krispState.filterNode;
}
/**
 * Initializes the RNNoise audio worklet and creates the filter node.
 *
 * @returns {Promise<AudioWorkletNode | undefined>}
 */
async function _initializeKRnnoise() {
    await audioContext.resume();
    const baseUrl = `${(0, helpers_1.getBaseUrl)()}libs/`;
    const workletUrl = `${baseUrl}noise-suppressor-worklet.min.js`;
    try {
        await audioContext.audioWorklet.addModule(workletUrl);
    }
    catch (e) {
        logger_1.default.error('Error while adding audio worklet module: ', e);
        return;
    }
    // After the resolution of module loading, an AudioWorkletNode can be constructed.
    return new AudioWorkletNode(audioContext, 'NoiseSuppressorWorklet');
}
