"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_sound_1 = __importDefault(require("react-native-sound"));
const logger_1 = __importDefault(require("../../logger"));
const AbstractAudio_1 = __importDefault(require("../AbstractAudio"));
/**
 * The React Native/mobile {@link Component} which is similar to Web's
 * {@code HTMLAudioElement} and wraps around react-native-webrtc's
 * {@link RTCView}.
 */
class Audio extends AbstractAudio_1.default {
    /**
     * A callback passed to the 'react-native-sound''s {@link Sound} instance,
     * called when loading sound is finished.
     *
     * @param {Object} error - The error object passed by
     * the 'react-native-sound' library.
     * @returns {void}
     * @private
     */
    _soundLoadedCallback(error) {
        if (error) {
            logger_1.default.error('Failed to load sound', error);
        }
        else {
            this.setAudioElementImpl(this._sound);
        }
    }
    /**
     * Implements React's {@link Component#componentDidUpdate()}.
     *
     * @inheritdoc
     */
    async componentDidUpdate(prevProps) {
        // source is different !! call didunmount and call didmount
        if (prevProps.src !== this.props.src) {
            await this.componentWillUnmount();
            await this.componentDidMount();
        }
    }
    /**
     * Will load the sound, after the component did mount.
     *
     * @returns {void}
     */
    async componentDidMount() {
        this._sound
            = this.props.src
                ? new react_native_sound_1.default(this.props.src, undefined, this._soundLoadedCallback.bind(this))
                : null;
    }
    /**
     * Will dispose sound resources (if any) when component is about to unmount.
     *
     * @returns {void}
     */
    async componentWillUnmount() {
        if (this._sound) {
            this._sound.release();
            this._sound = null;
            this.setAudioElementImpl(null);
        }
    }
    /**
     * Attempts to begin the playback of the media.
     *
     * @inheritdoc
     * @override
     */
    play() {
        if (this._sound) {
            this._sound.setNumberOfLoops(this.props.loop ? -1 : 0);
            this._sound.play(success => {
                if (!success) {
                    logger_1.default.warn(`Failed to play ${this.props.src}`);
                }
            });
        }
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {null}
     */
    render() {
        // TODO react-native-webrtc's RTCView doesn't do anything with the audio
        // MediaStream specified to it so it's easier at the time of this
        // writing to not render anything.
        return null;
    }
    /**
     * Stops the sound if it's currently playing.
     *
     * @returns {void}
     */
    stop() {
        if (this._sound) {
            this._sound.stop();
        }
    }
}
exports.default = Audio;
