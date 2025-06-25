"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../../base/dialog/actions");
const svg_1 = require("../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const _1 = require("./");
/**
 * An abstract remote video menu button which kicks the remote participant.
 */
class AbstractKickButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.kick';
        this.icon = svg_1.IconUserDeleted;
        this.label = 'videothumbnail.kick';
    }
    /**
     * Handles clicking / pressing the button, and kicks the participant.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, participantID } = this.props;
        dispatch((0, actions_1.openDialog)(_1.KickRemoteParticipantDialog, { participantID }));
    }
}
exports.default = AbstractKickButton;
