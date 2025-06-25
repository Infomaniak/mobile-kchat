"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actions_1 = require("../../base/participants/actions");
/**
 * Abstract dialog to confirm a remote participant kick action.
 */
class AbstractKickRemoteParticipantDialog extends react_1.Component {
    /**
     * Initializes a new {@code AbstractKickRemoteParticipantDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onSubmit = this._onSubmit.bind(this);
    }
    /**
     * Callback for the confirm button.
     *
     * @private
     * @returns {boolean} - True (to note that the modal should be closed).
     */
    _onSubmit() {
        const { dispatch, participantID } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRemoteVideoMenuButtonEvent)('kick.button', {
            'participant_id': participantID
        }));
        dispatch((0, actions_1.kickParticipant)(participantID));
        return true;
    }
}
exports.default = AbstractKickRemoteParticipantDialog;
