"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abstractMapStateToProps = void 0;
const react_1 = require("react");
const actions_1 = require("../../av-moderation/actions");
const functions_1 = require("../../av-moderation/functions");
const constants_1 = require("../../base/media/constants");
const actions_2 = require("../actions");
/**
 * Abstract dialog to confirm a remote participant video ute action.
 *
 * @augments Component
 */
class AbstractMuteRemoteParticipantsVideoDialog extends react_1.Component {
    /**
     * Initializes a new {@code AbstractMuteRemoteParticipantsVideoDialog} instance.
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
        dispatch((0, actions_2.muteRemote)(participantID, constants_1.MEDIA_TYPE.VIDEO));
        dispatch((0, actions_1.rejectParticipantVideo)(participantID));
        return true;
    }
}
exports.default = AbstractMuteRemoteParticipantsVideoDialog;
/**
 * Maps (parts of) the redux state to the associated
 * {@code AbstractDialogContainer}'s props.
 *
 * @param {IReduxState} state - The redux state.
 * @private
 * @returns {Object}
 */
function abstractMapStateToProps(state) {
    return {
        isVideoModerationOn: (0, functions_1.isEnabledFromState)(constants_1.MEDIA_TYPE.VIDEO, state)
    };
}
exports.abstractMapStateToProps = abstractMapStateToProps;
