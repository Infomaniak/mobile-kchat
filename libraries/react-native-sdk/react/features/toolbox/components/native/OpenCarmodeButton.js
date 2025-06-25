"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
/**
 * Implements an {@link AbstractButton} to open the carmode.
 */
class OpenCarmodeButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.carmode';
        this.icon = svg_1.IconCar;
        this.label = 'carmode.labels.buttonLabel';
    }
    /**
     * Handles clicking / pressing the button, and opens the carmode mode.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        return (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.carmode);
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {IReduxState} state - The Redux state.
 * @param {AbstractButtonProps} ownProps - The properties explicitly passed to the component instance.
 * @private
 * @returns {Object}
 */
function _mapStateToProps(state, ownProps) {
    const enabled = (0, functions_1.getFeatureFlag)(state, constants_1.CAR_MODE_ENABLED, true);
    const { visible = enabled } = ownProps;
    return {
        visible
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(OpenCarmodeButton));
