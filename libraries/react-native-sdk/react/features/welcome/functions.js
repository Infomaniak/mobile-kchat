"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomLandingPageURL = exports.isWelcomePageEnabled = void 0;
const constants_1 = require("../base/flags/constants");
const functions_1 = require("../base/flags/functions");
const functions_2 = require("../base/redux/functions");
/**
 * Determines whether the {@code WelcomePage} is enabled.
 *
 * @param {IStateful} stateful - The redux state or {@link getState}
 * function.
 * @returns {boolean} If the {@code WelcomePage} is enabled by the app, then
 * {@code true}; otherwise, {@code false}.
 */
function isWelcomePageEnabled(stateful) {
    if (navigator.product === 'ReactNative') {
        return (0, functions_1.getFeatureFlag)(stateful, constants_1.WELCOME_PAGE_ENABLED, false);
    }
    const config = (0, functions_2.toState)(stateful)['features/base/config'];
    return !config.welcomePage?.disabled;
}
exports.isWelcomePageEnabled = isWelcomePageEnabled;
/**
 * Returns the configured custom URL (if any) to redirect to instead of the normal landing page.
 *
 * @param {IStateful} stateful - The redux state or {@link getState}.
 * @returns {string} - The custom URL.
 */
function getCustomLandingPageURL(stateful) {
    return (0, functions_2.toState)(stateful)['features/base/config'].welcomePage?.customUrl;
}
exports.getCustomLandingPageURL = getCustomLandingPageURL;
