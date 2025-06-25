"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const functions_3 = require("../../../base/participants/functions");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_1 = require("../../../breakout-rooms/actions");
/**
 * An abstract remote video menu button which sends the remote participant to a breakout room.
 */
class SendToBreakoutRoom extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'breakoutRooms.actions.sendToBreakoutRoom';
        this.icon = svg_1.IconRingGroup;
    }
    /**
     * Gets the current label.
     *
     * @returns {string}
     */
    _getLabel() {
        const { t, room } = this.props;
        return room.name || t('breakoutRooms.mainRoom');
    }
    /**
     * Handles clicking / pressing the button, and asks the participant to unmute.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, participantID, room } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createBreakoutRoomsEvent)('send.participant.to.room'));
        dispatch((0, actions_1.sendParticipantToRoom)(participantID, room.id));
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - Properties of component.
 * @returns {IProps}
 */
function mapStateToProps(state) {
    return {
        visible: (0, functions_3.isLocalParticipantModerator)(state)
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(SendToBreakoutRoom));
