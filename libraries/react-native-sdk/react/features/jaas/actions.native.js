"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeShowPremiumFeatureDialog = void 0;
/**
 * Shows a dialog prompting users to upgrade, if requested feature is disabled.
 *
 * @param {string} _feature - Used on web.
 * @returns {Function}
 */
function maybeShowPremiumFeatureDialog(_feature) {
    return function () {
        return false;
    };
}
exports.maybeShowPremiumFeatureDialog = maybeShowPremiumFeatureDialog;
