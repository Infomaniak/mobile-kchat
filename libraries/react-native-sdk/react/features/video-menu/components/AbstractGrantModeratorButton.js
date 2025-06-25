"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const actions_1 = require("../../base/dialog/actions");
const svg_1 = require("../../base/icons/svg");
const constants_1 = require("../../base/participants/constants");
const functions_1 = require("../../base/participants/functions");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const _1 = require("./");
/**
 * An abstract remote video menu button which kicks the remote participant.
 */
class AbstractGrantModeratorButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.grantModerator';
        this.icon = svg_1.IconModerator;
        this.label = 'videothumbnail.grantModerator';
    }
    /**
   * Handles clicking / pressing the button, and kicks the participant.
   *
   * @private
   * @returns {void}
   */
    _handleClick() {
        const { dispatch, participantID } = this.props;
        dispatch((0, actions_1.openDialog)(_1.GrantModeratorDialog, { participantID }));
    }
}
exports.default = AbstractGrantModeratorButton;
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {Object} ownProps - Properties of component.
 * @private
 * @returns {{
 *     visible: boolean
 * }}
 */
function _mapStateToProps(state, ownProps) {
    const { participantID } = ownProps;
    const localParticipant = (0, functions_1.getLocalParticipant)(state);
    const targetParticipant = (0, functions_1.getParticipantById)(state, participantID);
    return {
        visible: Boolean(localParticipant?.role === constants_1.PARTICIPANT_ROLE.MODERATOR)
            && !(0, functions_1.isParticipantModerator)(targetParticipant)
    };
}
exports._mapStateToProps = _mapStateToProps;
