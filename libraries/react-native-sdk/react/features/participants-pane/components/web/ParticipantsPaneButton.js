"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_web_1 = require("../../../participants-pane/actions.web");
const actions_web_2 = require("../../../toolbox/actions.web");
const functions_2 = require("../../functions");
const ParticipantsCounter_1 = __importDefault(require("./ParticipantsCounter"));
/**
 * Implementation of a button for accessing participants pane.
 */
class ParticipantsPaneButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.participants';
        this.toggledAccessibilityLabel = 'toolbar.accessibilityLabel.closeParticipantsPane';
        this.icon = svg_1.IconUsers;
        this.label = 'toolbar.participants';
        this.tooltip = 'toolbar.participants';
        this.toggledTooltip = 'toolbar.closeParticipantsPane';
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._isOpen;
    }
    /**
    * Handles clicking the button, and toggles the participants pane.
    *
    * @private
    * @returns {void}
    */
    _handleClick() {
        const { dispatch, _isOpen } = this.props;
        dispatch((0, actions_web_2.closeOverflowMenuIfOpen)());
        if (_isOpen) {
            dispatch((0, actions_web_1.close)());
        }
        else {
            dispatch((0, actions_web_1.open)());
        }
    }
    /**
     * Overrides AbstractButton's {@link Component#render()}.
     *
     * @override
     * @protected
     * @returns {React$Node}
     */
    render() {
        const { _isParticipantsPaneEnabled } = this.props;
        if (!_isParticipantsPaneEnabled) {
            return null;
        }
        return (react_1.default.createElement("div", { className: 'toolbar-button-with-badge' },
            super.render(),
            react_1.default.createElement(ParticipantsCounter_1.default, null)));
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function mapStateToProps(state) {
    const { isOpen } = state['features/participants-pane'];
    return {
        _isOpen: isOpen,
        _isParticipantsPaneEnabled: (0, functions_2.isParticipantsPaneEnabled)(state)
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(mapStateToProps)(ParticipantsPaneButton));
