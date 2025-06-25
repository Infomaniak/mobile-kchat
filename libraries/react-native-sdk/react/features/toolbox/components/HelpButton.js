"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const constants_1 = require("../../base/flags/constants");
const functions_2 = require("../../base/flags/functions");
const functions_3 = require("../../base/i18n/functions");
const svg_1 = require("../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const openURLInBrowser_1 = require("../../base/util/openURLInBrowser");
/**
 * Implements an {@link AbstractButton} to open the user documentation in a new window.
 */
class HelpButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.help';
        this.icon = svg_1.IconHelp;
        this.label = 'toolbar.help';
        this.tooltip = 'toolbar.help';
    }
    /**
     * Handles clicking / pressing the button, and opens a new window with the user documentation.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { _userDocumentationURL } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('help.pressed'));
        (0, openURLInBrowser_1.openURLInBrowser)(_userDocumentationURL);
    }
}
/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The redux store/state.
 * @returns {Object}
 */
function _mapStateToProps(state) {
    const { userDocumentationURL } = state['features/base/config'].deploymentUrls || {};
    const enabled = (0, functions_2.getFeatureFlag)(state, constants_1.HELP_BUTTON_ENABLED, true);
    const visible = typeof userDocumentationURL === 'string' && enabled;
    return {
        _userDocumentationURL: userDocumentationURL ?? '',
        visible
    };
}
exports.default = (0, functions_3.translate)((0, react_redux_1.connect)(_mapStateToProps)(HelpButton));
