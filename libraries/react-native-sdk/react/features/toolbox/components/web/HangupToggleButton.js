"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
/**
 * Implementation of a button for toggling the hangup menu.
 */
class HangupToggleButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.hangup';
        this.icon = svg_1.IconHangup;
        this.label = 'toolbar.hangup';
        this.toggledIcon = svg_1.IconCloseLarge;
        this.toggledLabel = 'toolbar.hangup';
        this.tooltip = 'toolbar.hangup';
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props.isOpen;
    }
    /**
     * Indicates whether a key was pressed.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _onKeyDown() {
        this.props.onKeyDown();
    }
}
exports.default = (0, react_redux_1.connect)()((0, functions_1.translate)(HangupToggleButton));
