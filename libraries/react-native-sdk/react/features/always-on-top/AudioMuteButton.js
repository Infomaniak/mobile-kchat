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
// We need to reference these files directly to avoid loading things that are not available
// in this environment (e.g. JitsiMeetJS or interfaceConfig)
const constants_1 = require("../base/icons/svg/constants");
const ToolbarButton_1 = __importDefault(require("./ToolbarButton"));
const { api } = window.alwaysOnTop;
/**
 * Stateless "mute/unmute audio" button for the Always-on-Top windows.
 */
class AudioMuteButton extends react_1.Component {
    /**
     * Initializes a new {@code AudioMuteButton} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code AudioMuteButton} instance with.
     */
    constructor(props) {
        super(props);
        this.icon = constants_1.DEFAULT_ICON.IconMic;
        this.toggledIcon = constants_1.DEFAULT_ICON.IconMicSlash;
        this.accessibilityLabel = 'Audio mute';
        this.state = {
            audioAvailable: false,
            audioMuted: true
        };
        // Bind event handlers so they are only bound once per instance.
        this._audioAvailabilityListener
            = this._audioAvailabilityListener.bind(this);
        this._audioMutedListener = this._audioMutedListener.bind(this);
        this._onClick = this._onClick.bind(this);
    }
    /**
     * Sets mouse move listener and initial toolbar timeout.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        api.on('audioAvailabilityChanged', this._audioAvailabilityListener);
        api.on('audioMuteStatusChanged', this._audioMutedListener);
        Promise.all([
            api.isAudioAvailable(),
            api.isAudioMuted(),
            api.isAudioDisabled?.() || Promise.resolve(false)
        ])
            .then(([audioAvailable, audioMuted, audioDisabled]) => this.setState({
            audioAvailable: audioAvailable && !audioDisabled,
            audioMuted
        }))
            .catch(console.error);
    }
    /**
     * Removes all listeners.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        api.removeListener('audioAvailabilityChanged', this._audioAvailabilityListener);
        api.removeListener('audioMuteStatusChanged', this._audioMutedListener);
    }
    /**
     * Handles audio available api events.
     *
     * @param {{ available: boolean }} status - The new available status.
     * @returns {void}
     */
    _audioAvailabilityListener({ available }) {
        this.setState({ audioAvailable: available });
    }
    /**
     * Handles audio muted api events.
     *
     * @param {{ muted: boolean }} status - The new muted status.
     * @returns {void}
     */
    _audioMutedListener({ muted }) {
        this.setState({ audioMuted: muted });
    }
    /**
     * Indicates if audio is currently muted or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isAudioMuted() {
        return this.state.audioMuted;
    }
    /**
     * Indicates whether this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return !this.state.audioAvailable;
    }
    /**
     * Changes the muted state.
     *
     * @override
     * @param {boolean} _audioMuted - Whether audio should be muted or not.
     * @protected
     * @returns {void}
     */
    _setAudioMuted(_audioMuted) {
        this.state.audioAvailable && api.executeCommand('toggleAudio');
    }
    /**
     * Handles clicking / pressing the button, and toggles the audio mute state
     * accordingly.
     *
     * @returns {void}
     */
    _onClick() {
        this._setAudioMuted(!this._isAudioMuted());
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const toggled = this._isAudioMuted();
        return (react_1.default.createElement(ToolbarButton_1.default, { accessibilityLabel: this.accessibilityLabel, disabled: this._isDisabled(), icon: toggled ? this.toggledIcon : this.icon, onClick: this._onClick, toggled: toggled }));
    }
}
exports.default = AudioMuteButton;
