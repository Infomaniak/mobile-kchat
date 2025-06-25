"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const actions_1 = require("../../../base/dialog/actions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const SalesforceLinkDialog_1 = __importDefault(require("../../../salesforce/components/web/SalesforceLinkDialog"));
const functions_3 = require("../../../salesforce/functions");
/**
 * Implementation of a button for opening the Salesforce link dialog.
 */
class LinkToSalesforce extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.linkToSalesforce';
        this.icon = svg_1.IconCloudUpload;
        this.label = 'toolbar.linkToSalesforce';
        this.tooltip = 'toolbar.linkToSalesforce';
    }
    /**
     * Handles clicking / pressing the button, and opens the Salesforce link dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { dispatch } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('link.to.salesforce'));
        dispatch((0, actions_1.openDialog)(SalesforceLinkDialog_1.default));
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
const mapStateToProps = (state) => {
    return {
        visible: (0, functions_3.isSalesforceEnabled)(state)
    };
};
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(LinkToSalesforce));
