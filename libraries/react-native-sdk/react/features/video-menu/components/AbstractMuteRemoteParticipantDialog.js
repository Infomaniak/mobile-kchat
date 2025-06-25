"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const constants_1 = require("../../base/media/constants");
const actions_1 = require("../actions");
/**
 * Abstract dialog to confirm a remote participant mute action.
 *
 * @augments Component
 */
class AbstractMuteRemoteParticipantDialog extends react_1.Component {
    /**
     * Initializes a new {@code AbstractMuteRemoteParticipantDialog} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._onSubmit = this._onSubmit.bind(this);
    }
    /**
     * Handles the submit button action.
     *
     * @private
     * @returns {boolean} - True (to note that the modal should be closed).
     */
    _onSubmit() {
        const { dispatch, participantID } = this.props;
        dispatch((0, actions_1.muteRemote)(participantID, constants_1.MEDIA_TYPE.AUDIO));
        return true;
    }
}
exports.default = AbstractMuteRemoteParticipantDialog;
