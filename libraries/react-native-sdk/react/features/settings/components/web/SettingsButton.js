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
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_1 = require("../../actions");
/**
 * An abstract implementation of a button for accessing settings.
 */
class SettingsButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.Settings';
        this.icon = svg_1.IconGear;
        this.label = 'toolbar.Settings';
        this.tooltip = 'toolbar.Settings';
    }
    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, isDisplayedOnWelcomePage = false } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('settings'));
        dispatch((0, actions_1.openSettingsDialog)(undefined, isDisplayedOnWelcomePage));
    }
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)()(SettingsButton));
