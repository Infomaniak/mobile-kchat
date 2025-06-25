"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../i18n/functions");
const contants_1 = require("./contants");
/**
 * Gets the unsafe room text for the given context.
 *
 * @param {Function} t - The translation function.
 * @param {'meeting'|'prejoin'|'welcome'} context - The given context of the warining.
 * @returns {string}
 */
function getUnsafeRoomText(t, context) {
    const securityUrl = APP.store.getState()['features/base/config'].legalUrls?.security ?? contants_1.SECURITY_URL;
    const options = {
        recommendAction: t(`security.unsafeRoomActions.${context}`),
        securityUrl
    };
    return (0, functions_1.translateToHTML)(t, 'security.insecureRoomNameWarningWeb', options);
}
exports.default = getUnsafeRoomText;
