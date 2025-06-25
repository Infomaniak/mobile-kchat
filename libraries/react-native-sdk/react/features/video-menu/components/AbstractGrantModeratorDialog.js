"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abstractMapStateToProps = void 0;
const react_1 = require("react");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actions_1 = require("../../base/participants/actions");
const functions_2 = require("../../base/participants/functions");
/**
 * Abstract dialog to confirm granting moderator to a participant.
 */
class AbstractGrantModeratorDialog extends react_1.Component {
    /**
     * Initializes a new {@code AbstractGrantModeratorDialog} instance.
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
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRemoteVideoMenuButtonEvent)('grant.moderator.button', {
            'participant_id': participantID
        }));
        dispatch((0, actions_1.grantModerator)(participantID));
        return true;
    }
}
exports.default = AbstractGrantModeratorDialog;
/**
 * Maps (parts of) the Redux state to the associated {@code AbstractMuteEveryoneDialog}'s props.
 *
 * @param {IReduxState} state - The redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component.
 * @returns {IProps}
 */
function abstractMapStateToProps(state, ownProps) {
    return {
        participantName: (0, functions_2.getParticipantById)(state, ownProps.participantID)?.name
    };
}
exports.abstractMapStateToProps = abstractMapStateToProps;
