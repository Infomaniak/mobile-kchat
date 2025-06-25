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
exports.getName = exports.getDefaultURL = void 0;
const functions_1 = require("../base/redux/functions");
const functions_web_1 = require("../base/settings/functions.web");
__exportStar(require("./functions.any"), exports);
/**
 * Retrieves the default URL for the app. This can either come from a prop to
 * the root App component or be configured in the settings.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {string} - Default URL for the app.
 */
function getDefaultURL(stateful) {
    const state = (0, functions_1.toState)(stateful);
    const { href } = window.location;
    if (href) {
        return href;
    }
    return (0, functions_web_1.getServerURL)(state);
}
exports.getDefaultURL = getDefaultURL;
/**
 * Returns application name.
 *
 * @returns {string} The application name.
 */
function getName() {
    return interfaceConfig.APP_NAME;
}
exports.getName = getName;
