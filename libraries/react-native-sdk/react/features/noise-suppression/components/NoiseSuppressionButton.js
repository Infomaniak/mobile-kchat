"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../base/i18n/functions");
const svg_1 = require("../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const actions_1 = require("../../toolbox/actions");
const actions_2 = require("../actions");
const functions_2 = require("../functions");
/**
 * Component that renders a toolbar button for toggling noise suppression.
 */
class NoiseSuppressionButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.noiseSuppression';
        this.icon = svg_1.IconNoiseSuppressionOn;
        this.label = 'toolbar.noiseSuppression';
        this.tooltip = 'toolbar.noiseSuppression';
        this.toggledIcon = svg_1.IconNoiseSuppressionOff;
        this.toggledLabel = 'toolbar.disableNoiseSuppression';
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch } = this.props;
        dispatch((0, actions_2.toggleNoiseSuppression)());
        dispatch((0, actions_1.setOverflowMenuVisible)(false));
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._isNoiseSuppressionEnabled;
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
        _isNoiseSuppressionEnabled: (0, functions_2.isNoiseSuppressionEnabled)(state)
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(NoiseSuppressionButton));
