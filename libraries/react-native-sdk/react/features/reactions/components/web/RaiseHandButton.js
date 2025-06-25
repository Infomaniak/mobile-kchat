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
const actions_1 = require("../../../base/participants/actions");
const functions_3 = require("../../../base/participants/functions");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
/**
 * Implementation of a button for raising hand.
 */
class RaiseHandButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.raiseHand';
        this.toggledAccessibilityLabel = 'toolbar.accessibilityLabel.lowerHand';
        this.icon = svg_1.IconRaiseHand;
        this.label = 'toolbar.raiseHand';
        this.toggledLabel = 'toolbar.lowerYourHand';
        this.tooltip = 'toolbar.raiseHand';
        this.toggledTooltip = 'toolbar.lowerYourHand';
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props.raisedHand;
    }
    /**
     * Handles clicking the button, and toggles the raise hand.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, raisedHand } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('raise.hand', { enable: !raisedHand }));
        dispatch((0, actions_1.raiseHand)(!raisedHand));
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
const mapStateToProps = (state) => {
    const localParticipant = (0, functions_3.getLocalParticipant)(state);
    return {
        raisedHand: (0, functions_3.hasRaisedHand)(localParticipant)
    };
};
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(RaiseHandButton));
