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
const react_1 = __importStar(require("react"));
const functions_1 = require("../../base/i18n/functions");
const index_1 = require("../../base/media/components/index");
const Button_1 = __importDefault(require("../../base/ui/components/web/Button"));
const constants_any_1 = require("../../base/ui/constants.any");
const TEST_SOUND_PATH = 'sounds/ring.mp3';
/**
 * React component for playing a test sound through a specified audio device.
 *
 * @augments Component
 */
class AudioOutputPreview extends react_1.Component {
    /**
     * Initializes a new AudioOutputPreview instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this._audioElement = null;
        this._audioElementReady = this._audioElementReady.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onKeyPress = this._onKeyPress.bind(this);
    }
    /**
     * Updates the audio element when the target output device changes and the
     * audio element has re-rendered.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate() {
        this._setAudioSink();
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Button_1.default, { accessibilityLabel: this.props.t('deviceSelection.testAudio'), className: this.props.className, labelKey: 'deviceSelection.testAudio', onClick: this._onClick, onKeyPress: this._onKeyPress, type: constants_any_1.BUTTON_TYPES.SECONDARY }),
            react_1.default.createElement(index_1.Audio, { setRef: this._audioElementReady, src: TEST_SOUND_PATH })));
    }
    /**
     * Sets the instance variable for the component's audio element so it can be
     * accessed directly.
     *
     * @param {Object} element - The DOM element for the component's audio.
     * @private
     * @returns {void}
     */
    _audioElementReady(element) {
        this._audioElement = element;
        this._setAudioSink();
    }
    /**
     * Plays a test sound.
     *
     * @private
     * @returns {void}
     */
    _onClick() {
        this._audioElement?.play();
    }
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onKeyPress(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this._onClick();
        }
    }
    /**
     * Updates the target output device for playing the test sound.
     *
     * @private
     * @returns {void}
     */
    _setAudioSink() {
        this._audioElement
            && this.props.deviceId
            && this._audioElement.setSinkId(this.props.deviceId);
    }
}
exports.default = (0, functions_1.translate)(AudioOutputPreview);
