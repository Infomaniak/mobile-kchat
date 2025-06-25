"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showSalesforceNotification = void 0;
const actions_1 = require("../base/dialog/actions");
const actions_2 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const components_1 = require("./components");
const functions_1 = require("./functions");
/**
 * Displays the notification for linking the meeting to Salesforce.
 *
 * @returns {void}
 */
function showSalesforceNotification() {
    return (dispatch, getState) => {
        if (!(0, functions_1.isSalesforceEnabled)(getState())) {
            return;
        }
        dispatch((0, actions_2.showNotification)({
            descriptionKey: 'notify.linkToSalesforceDescription',
            titleKey: 'notify.linkToSalesforce',
            uid: constants_1.SALESFORCE_LINK_NOTIFICATION_ID,
            customActionNameKey: ['notify.linkToSalesforceKey'],
            customActionHandler: [() => {
                    dispatch((0, actions_2.hideNotification)(constants_1.SALESFORCE_LINK_NOTIFICATION_ID));
                    dispatch((0, actions_1.openDialog)(components_1.SalesforceLinkDialog));
                }],
            appearance: constants_1.NOTIFICATION_TYPE.NORMAL
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
    };
}
exports.showSalesforceNotification = showSalesforceNotification;
