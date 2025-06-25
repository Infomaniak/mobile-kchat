"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../../base/i18n/functions");
const svg_1 = require("../../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../../base/toolbox/components/AbstractButton"));
const ConferenceNavigationContainerRef_1 = require("../../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../../mobile/navigation/routes");
const constants_1 = require("../../../flags/constants");
const functions_2 = require("../../../flags/functions");
/**
 * Implements an {@link AbstractButton} to open the carmode.
 */
class SettingsButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.Settings';
        this.icon = svg_1.IconGear;
        this.label = 'settings.buttonLabel';
    }
    /**
     * Handles clicking / pressing the button, and opens the carmode mode.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        return (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.settings.main);
    }
}
/**
 * Maps part of the redux state to the component's props.
 *
 * @param {IReduxState} state - The Redux state.
 * @returns {Object}
 */
function _mapStateToProps(state) {
    const enabled = (0, functions_2.getFeatureFlag)(state, constants_1.SETTINGS_ENABLED, true);
    return {
        visible: enabled
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(SettingsButton));
