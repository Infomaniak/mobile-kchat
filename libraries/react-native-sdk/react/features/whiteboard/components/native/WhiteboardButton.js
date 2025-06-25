"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_any_1 = require("../../actions.any");
const functions_2 = require("../../functions");
/**
 * Component that renders a toolbar button for the whiteboard.
 */
class WhiteboardButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.showWhiteboard';
        this.icon = svg_1.IconWhiteboard;
        this.label = 'toolbar.showWhiteboard';
        this.tooltip = 'toolbar.showWhiteboard';
    }
    /**
     * Handles clicking / pressing the button, and opens the whiteboard view.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        this.props.dispatch((0, actions_any_1.setWhiteboardOpen)(true));
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    return {
        visible: (0, functions_2.isWhiteboardButtonVisible)(state)
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(WhiteboardButton));
