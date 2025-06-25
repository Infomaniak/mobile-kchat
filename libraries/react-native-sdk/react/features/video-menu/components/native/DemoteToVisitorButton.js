"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/dialog/actions");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const DemoteToVisitorDialog_1 = __importDefault(require("./DemoteToVisitorDialog"));
/**
 * Implements a React {@link Component} which displays a button for demoting a participant to visitor.
 */
class DemoteToVisitorButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'videothumbnail.demote';
        this.icon = svg_1.IconUsers;
        this.label = 'videothumbnail.demote';
    }
    /**
     * Handles clicking / pressing the button, and demoting the participant.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, participantID } = this.props;
        dispatch((0, actions_1.openDialog)(DemoteToVisitorDialog_1.default, { participantID }));
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Props}
 */
function _mapStateToProps(state) {
    return {
        visible: state['features/visitors'].supported
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(DemoteToVisitorButton));
