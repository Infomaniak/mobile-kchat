"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeShowSuboptimalExperienceNotification = void 0;
const environment_1 = require("../base/environment/environment");
const functions_1 = require("../base/i18n/functions");
const actions_1 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
__exportStar(require("./functions.any"), exports);
/**
 * Shows the suboptimal experience notification if needed.
 *
 * @param {Function} dispatch - The dispatch method.
 * @param {Function} t - The translation function.
 * @returns {void}
 */
function maybeShowSuboptimalExperienceNotification(dispatch, t) {
    if ((0, environment_1.isSuboptimalBrowser)()) {
        dispatch((0, actions_1.showWarningNotification)({
            titleKey: 'notify.suboptimalExperienceTitle',
            description: (0, functions_1.translateToHTML)(t, 'notify.suboptimalBrowserWarning', {
                recommendedBrowserPageLink: `${window.location.origin}/static/recommendedBrowsers.html`
            })
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
    }
}
exports.maybeShowSuboptimalExperienceNotification = maybeShowSuboptimalExperienceNotification;
