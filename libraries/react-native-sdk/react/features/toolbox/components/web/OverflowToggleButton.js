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
 * Implementation of a button for toggling the overflow menu.
 */
class OverflowToggleButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.moreActions';
        this.toggledAccessibilityLabel = 'toolbar.accessibilityLabel.closeMoreActions';
        this.icon = svg_1.IconDotsHorizontal;
        this.label = 'toolbar.moreActions';
        this.toggledLabel = 'toolbar.moreActions';
        this.tooltip = 'toolbar.moreActions';
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
exports.default = (0, react_redux_1.connect)()((0, functions_1.translate)(OverflowToggleButton));
