"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/dialog/actions");
const functions_1 = require("../../../base/dialog/functions");
const constants_1 = require("../../../base/flags/constants");
const functions_2 = require("../../../base/flags/functions");
const functions_3 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const functions_4 = require("../../../base/participants/functions");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const ReactionMenuDialog_1 = __importDefault(require("./ReactionMenuDialog"));
/**
 * An implementation of a button to raise or lower hand.
 */
class ReactionsMenuButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.reactionsMenu';
        this.icon = svg_1.IconRaiseHand;
        this.label = 'toolbar.openReactionsMenu';
        this.toggledLabel = 'toolbar.closeReactionsMenu';
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this.props.dispatch((0, actions_1.openDialog)(ReactionMenuDialog_1.default));
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._raisedHand || this.props._reactionsOpen;
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component instance.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const _localParticipant = (0, functions_4.getLocalParticipant)(state);
    const enabled = (0, functions_2.getFeatureFlag)(state, constants_1.RAISE_HAND_ENABLED, true);
    const { visible = enabled } = ownProps;
    return {
        _raisedHand: (0, functions_4.hasRaisedHand)(_localParticipant),
        _reactionsOpen: (0, functions_1.isDialogOpen)(state, ReactionMenuDialog_1.default),
        visible
    };
}
exports.default = (0, functions_3.translate)((0, react_redux_1.connect)(_mapStateToProps)(ReactionsMenuButton));
