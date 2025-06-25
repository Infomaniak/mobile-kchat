"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapStateToProps = void 0;
const constants_1 = require("../../base/flags/constants");
const functions_1 = require("../../base/flags/functions");
const constants_2 = require("../../base/media/constants");
const BaseAudioMuteButton_1 = __importDefault(require("../../base/toolbox/components/BaseAudioMuteButton"));
const functions_2 = require("../../base/tracks/functions");
const actions_1 = require("../../video-menu/actions");
const functions_3 = require("../functions");
/**
 * Component that renders a toolbar button for toggling audio mute.
 *
 * @augments BaseAudioMuteButton
 */
class AbstractAudioMuteButton extends BaseAudioMuteButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.mute';
        this.toggledAccessibilityLabel = 'toolbar.accessibilityLabel.unmute';
        this.label = 'toolbar.mute';
        this.toggledLabel = 'toolbar.unmute';
        this.tooltip = 'toolbar.mute';
        this.toggledTooltip = 'toolbar.unmute';
    }
    /**
     * Indicates if audio is currently muted or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isAudioMuted() {
        return this.props._audioMuted;
    }
    /**
     * Changes the muted state.
     *
     * @param {boolean} audioMuted - Whether audio should be muted or not.
     * @protected
     * @returns {void}
     */
    _setAudioMuted(audioMuted) {
        this.props.dispatch((0, actions_1.muteLocal)(audioMuted, constants_2.MEDIA_TYPE.AUDIO));
    }
    /**
     * Return a boolean value indicating if this button is disabled or not.
     *
     * @returns {boolean}
     */
    _isDisabled() {
        return this.props._disabled;
    }
}
exports.default = AbstractAudioMuteButton;
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code AbstractAudioMuteButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _audioMuted: boolean,
 *     _disabled: boolean
 * }}
 */
function mapStateToProps(state) {
    const _audioMuted = (0, functions_2.isLocalTrackMuted)(state['features/base/tracks'], constants_2.MEDIA_TYPE.AUDIO);
    const _disabled = (0, functions_3.isAudioMuteButtonDisabled)(state);
    const enabledFlag = (0, functions_1.getFeatureFlag)(state, constants_1.AUDIO_MUTE_BUTTON_ENABLED, true);
    return {
        _audioMuted,
        _disabled,
        visible: enabledFlag
    };
}
exports.mapStateToProps = mapStateToProps;
