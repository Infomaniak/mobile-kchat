"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const logger_1 = __importDefault(require("../logger"));
/**
 * The React {@link Component} which is similar to Web's
 * {@code HTMLAudioElement}.
 */
class AbstractAudio extends react_1.Component {
    /**
     * Initializes a new {@code AbstractAudio} instance.
     *
     * @param {IProps} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this.setAudioElementImpl = this.setAudioElementImpl.bind(this);
    }
    /**
     * Attempts to pause the playback of the media.
     *
     * @public
     * @returns {void}
     */
    pause() {
        this._audioElementImpl?.pause();
    }
    /**
     * Attempts to begin the playback of the media.
     *
     * @public
     * @returns {void}
     */
    play() {
        this._audioElementImpl?.play();
    }
    /**
     * Set the (reference to the) {@link AudioElement} object which implements
     * the audio playback functionality.
     *
     * @param {AudioElement} element - The {@link AudioElement} instance
     * which implements the audio playback functionality.
     * @protected
     * @returns {void}
     */
    setAudioElementImpl(element) {
        this._audioElementImpl = element;
        const { setRef } = this.props;
        typeof setRef === 'function' && setRef(element ? this : null);
    }
    /**
     * Sets the sink ID (output device ID) on the underlying audio element.
     * NOTE: Currently, implemented only on Web.
     *
     * @param {string} sinkId - The sink ID (output device ID).
     * @returns {void}
     */
    setSinkId(sinkId) {
        this._audioElementImpl
            && typeof this._audioElementImpl.setSinkId === 'function'
            && this._audioElementImpl.setSinkId(sinkId)
                .catch(error => logger_1.default.error('Error setting sink', error));
    }
    /**
     * Attempts to stop the playback of the media.
     *
     * @public
     * @returns {void}
     */
    stop() {
        this._audioElementImpl?.stop();
    }
}
exports.default = AbstractAudio;
