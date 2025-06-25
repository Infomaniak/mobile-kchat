"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../av-moderation/actions");
const functions_1 = require("../../../av-moderation/functions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const constants_1 = require("../../../base/media/constants");
const functions_3 = require("../../../base/participants/functions");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const functions_4 = require("../../../participants-pane/functions");
/**
 * An abstract remote video menu button which asks the remote participant to unmute.
 */
class AskUnmuteButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'participantsPane.actions.askUnmute';
        this.icon = svg_1.IconMic;
        this.label = 'participantsPane.actions.askUnmute';
    }
    /**
     * Gets the current label.
     *
     * @returns {string}
     */
    _getLabel() {
        const { isAudioForceMuted, isVideoForceMuted } = this.props;
        if (!isAudioForceMuted && isVideoForceMuted) {
            return 'participantsPane.actions.allowVideo';
        }
        return this.label;
    }
    /**
     * Gets the current icon.
     *
     * @returns {string}
     */
    _getIcon() {
        const { isAudioForceMuted, isVideoForceMuted } = this.props;
        if (!isAudioForceMuted && isVideoForceMuted) {
            return svg_1.IconVideo;
        }
        return this.icon;
    }
    /**
     * Handles clicking / pressing the button, and asks the participant to unmute.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, participantID } = this.props;
        dispatch((0, actions_1.approveParticipant)(participantID));
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - Properties of component.
 * @returns {IProps}
 */
function mapStateToProps(state, ownProps) {
    const { participantID } = ownProps;
    const participant = (0, functions_3.getParticipantById)(state, participantID);
    return {
        isAudioForceMuted: (0, functions_4.isForceMuted)(participant, constants_1.MEDIA_TYPE.AUDIO, state),
        isVideoForceMuted: (0, functions_4.isForceMuted)(participant, constants_1.MEDIA_TYPE.VIDEO, state),
        visible: (0, functions_3.isLocalParticipantModerator)(state) && (0, functions_1.isSupported)()(state)
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(AskUnmuteButton));
