"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const constants_1 = require("../../../base/media/constants");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_1 = require("../../../base/tracks/actions");
const functions_2 = require("../../../base/tracks/functions");
const actions_web_1 = require("../../actions.web");
/**
 * An implementation of a button for toggling the camera facing mode.
 */
class ToggleCameraButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.toggleCamera';
        this.icon = svg_1.IconCameraRefresh;
        this.label = 'toolbar.toggleCamera';
    }
    /**
     * Handles clicking/pressing the button.
     *
     * @returns {void}
     */
    _handleClick() {
        const { dispatch } = this.props;
        dispatch((0, actions_1.toggleCamera)());
        dispatch((0, actions_web_1.setOverflowMenuVisible)(false));
    }
    /**
     * Whether this button is disabled or not.
     *
     * @returns {boolean}
     */
    _isDisabled() {
        return this.props._audioOnly || this.props._videoMuted;
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code ToggleCameraButton} component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function mapStateToProps(state) {
    const { enabled: audioOnly } = state['features/base/audio-only'];
    const tracks = state['features/base/tracks'];
    return {
        _audioOnly: Boolean(audioOnly),
        _videoMuted: (0, functions_2.isLocalTrackMuted)(tracks, constants_1.MEDIA_TYPE.VIDEO),
        visible: (0, functions_2.isToggleCameraEnabled)(state)
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(mapStateToProps)(ToggleCameraButton));
