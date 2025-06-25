"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeShowPremiumFeatureDialog = void 0;
const actions_1 = require("../base/dialog/actions");
const PremiumFeatureDialog_1 = __importDefault(require("./components/web/PremiumFeatureDialog"));
const functions_1 = require("./functions");
/**
 * Shows a dialog prompting users to upgrade, if requested feature is disabled.
 *
 * @param {string} feature - The feature to check availability for.
 *
 * @returns {Function}
 */
function maybeShowPremiumFeatureDialog(feature) {
    return function (dispatch, getState) {
        if ((0, functions_1.isFeatureDisabled)(getState(), feature)) {
            dispatch((0, actions_1.openDialog)(PremiumFeatureDialog_1.default));
            return true;
        }
        return false;
    };
}
exports.maybeShowPremiumFeatureDialog = maybeShowPremiumFeatureDialog;
