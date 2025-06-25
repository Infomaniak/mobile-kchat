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
 * Stateless "mute/unmute video" button for the Always-on-Top windows.
 */
class VideoMuteButton extends react_1.Component {
    /**
     * Initializes a new {@code VideoMuteButton} instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new {@code VideoMuteButton} instance with.
     */
    constructor(props) {
        super(props);
        this.icon = constants_1.DEFAULT_ICON.IconVideo;
        this.toggledIcon = constants_1.DEFAULT_ICON.IconVideoOff;
        this.accessibilityLabel = 'Video mute';
        this.state = {
            videoAvailable: false,
            videoMuted: true
        };
        // Bind event handlers so they are only bound once per instance.
        this._videoAvailabilityListener
            = this._videoAvailabilityListener.bind(this);
        this._videoMutedListener = this._videoMutedListener.bind(this);
        this._onClick = this._onClick.bind(this);
    }
    /**
     * Sets mouse move listener and initial toolbar timeout.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        api.on('videoAvailabilityChanged', this._videoAvailabilityListener);
        api.on('videoMuteStatusChanged', this._videoMutedListener);
        Promise.all([
            api.isVideoAvailable(),
            api.isVideoMuted()
        ])
            .then(([videoAvailable, videoMuted]) => this.setState({
            videoAvailable,
            videoMuted
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
        api.removeListener('videoAvailabilityChanged', this._videoAvailabilityListener);
        api.removeListener('videoMuteStatusChanged', this._videoMutedListener);
    }
    /**
     * Indicates whether this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return !this.state.videoAvailable;
    }
    /**
     * Indicates if video is currently muted or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isVideoMuted() {
        return this.state.videoMuted;
    }
    /**
     * Changes the muted state.
     *
     * @override
     * @param {boolean} _videoMuted - Whether video should be muted or not.
     * @protected
     * @returns {void}
     */
    _setVideoMuted(_videoMuted) {
        this.state.videoAvailable && api.executeCommand('toggleVideo', false, true);
    }
    /**
     * Handles video available api events.
     *
     * @param {{ available: boolean }} status - The new available status.
     * @returns {void}
     */
    _videoAvailabilityListener({ available }) {
        this.setState({ videoAvailable: available });
    }
    /**
     * Handles video muted api events.
     *
     * @param {{ muted: boolean }} status - The new muted status.
     * @returns {void}
     */
    _videoMutedListener({ muted }) {
        this.setState({ videoMuted: muted });
    }
    /**
     * Handles clicking / pressing the button, and toggles the video mute state
     * accordingly.
     *
     * @protected
     * @returns {void}
     */
    _onClick() {
        this._setVideoMuted(!this._isVideoMuted());
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const toggled = this._isVideoMuted();
        return (react_1.default.createElement(ToolbarButton_1.default, { accessibilityLabel: this.accessibilityLabel, disabled: this._isDisabled(), icon: toggled ? this.toggledIcon : this.icon, onClick: this._onClick, toggled: toggled }));
    }
}
exports.default = VideoMuteButton;
