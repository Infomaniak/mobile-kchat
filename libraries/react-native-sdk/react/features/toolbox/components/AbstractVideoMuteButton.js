"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapStateToProps = void 0;
const constants_1 = require("../../base/flags/constants");
const functions_1 = require("../../base/flags/functions");
const constants_2 = require("../../base/media/constants");
const BaseVideoMuteButton_1 = __importDefault(require("../../base/toolbox/components/BaseVideoMuteButton"));
const functions_2 = require("../../base/tracks/functions");
const actions_any_1 = require("../actions.any");
const functions_3 = require("../functions");
/**
 * Component that renders a toolbar button for toggling video mute.
 *
 * @augments BaseVideoMuteButton
 */
class AbstractVideoMuteButton extends BaseVideoMuteButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.videomute';
        this.toggledAccessibilityLabel = 'toolbar.accessibilityLabel.videounmute';
        this.label = 'toolbar.videomute';
        this.toggledLabel = 'toolbar.videounmute';
        this.tooltip = 'toolbar.videomute';
        this.toggledTooltip = 'toolbar.videounmute';
    }
    /**
     * Indicates if video is currently disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return this.props._videoDisabled;
    }
    /**
     * Indicates if video is currently muted or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isVideoMuted() {
        return this.props._videoMuted;
    }
    /**
     * Changes the muted state.
     *
     * @override
     * @param {boolean} videoMuted - Whether video should be muted or not.
     * @protected
     * @returns {void}
     */
    _setVideoMuted(videoMuted) {
        this.props.dispatch((0, actions_any_1.handleToggleVideoMuted)(videoMuted, true, true));
    }
}
exports.default = AbstractVideoMuteButton;
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code VideoMuteButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _videoMuted: boolean
 * }}
 */
function mapStateToProps(state) {
    const tracks = state['features/base/tracks'];
    const enabledFlag = (0, functions_1.getFeatureFlag)(state, constants_1.VIDEO_MUTE_BUTTON_ENABLED, true);
    return {
        _videoDisabled: (0, functions_3.isVideoMuteButtonDisabled)(state),
        _videoMuted: (0, functions_2.isLocalTrackMuted)(tracks, constants_2.MEDIA_TYPE.VIDEO),
        visible: enabledFlag
    };
}
exports.mapStateToProps = mapStateToProps;
