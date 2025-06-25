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
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const functions_3 = require("../../../salesforce/functions");
/**
 * Implementation of a button for opening the Salesforce link dialog.
 */
class LinkToSalesforceButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.linkToSalesforce';
        this.icon = svg_1.IconCloudUpload;
        this.label = 'toolbar.linkToSalesforce';
    }
    /**
     * Handles clicking / pressing the button, and opens the Salesforce link dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('link.to.salesforce'));
        return (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.salesforce);
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @private
 * @returns {Props}
 */
function mapStateToProps(state) {
    return {
        visible: (0, functions_3.isSalesforceEnabled)(state)
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(LinkToSalesforceButton));
