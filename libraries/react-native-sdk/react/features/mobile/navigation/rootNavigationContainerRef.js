"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.goBackToRoot = exports.goBack = exports.navigateRoot = exports.rootNavigationRef = void 0;
const react_1 = __importDefault(require("react"));
const functions_1 = require("../../base/redux/functions");
const functions_2 = require("../../welcome/functions");
const functions_3 = require("../external-api/functions");
const routes_1 = require("./routes");
exports.rootNavigationRef = react_1.default.createRef();
/**
 * User defined navigation action included inside the reference to the container.
 *
 * @param {string} name - Destination name of the route that has been defined somewhere.
 * @param {Object} params - Params to pass to the destination route.
 * @returns {Function}
 */
function navigateRoot(name, params) {
    return exports.rootNavigationRef.current?.navigate(name, params);
}
exports.navigateRoot = navigateRoot;
/**
 * User defined navigation action included inside the reference to the container.
 *
 * @returns {Function}
 */
function goBack() {
    return exports.rootNavigationRef.current?.goBack();
}
exports.goBack = goBack;
/**
 * Navigates back to Welcome page, if it's available.
 *
 * @param {Object|Function} stateful - Either the whole Redux state object or the Redux store's {@code getState} method.
 * @param {Function} dispatch - Redux dispatch function.
 * @returns {void}
 */
function goBackToRoot(stateful, dispatch) {
    const state = (0, functions_1.toState)(stateful);
    if ((0, functions_2.isWelcomePageEnabled)(state)) {
        navigateRoot(routes_1.screen.welcome.main);
    }
    else {
        // For JitsiSDK, WelcomePage is not available
        (0, functions_3._sendReadyToClose)(dispatch);
    }
}
exports.goBackToRoot = goBackToRoot;
