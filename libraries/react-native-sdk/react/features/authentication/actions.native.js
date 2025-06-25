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
exports.openTokenAuthUrl = exports.redirectToDefaultLocation = exports.cancelWaitForOwner = exports.cancelLogin = void 0;
const react_native_1 = require("react-native");
const actions_native_1 = require("../app/actions.native");
const actions_1 = require("../base/conference/actions");
const actions_native_2 = require("../base/connection/actions.native");
const functions_1 = require("../base/redux/functions");
const actionTypes_1 = require("./actionTypes");
const actions_any_1 = require("./actions.any");
__exportStar(require("./actions.any"), exports);
/**
 * Cancels {@ink LoginDialog}.
 *
 * @returns {{
 *     type: CANCEL_LOGIN
 * }}
 */
function cancelLogin() {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes_1.CANCEL_LOGIN });
        // XXX The error associated with CONNECTION_FAILED was marked as
        // recoverable by the authentication feature  and, consequently,
        // recoverable-aware features such as mobile's external-api did not
        // deliver the CONFERENCE_FAILED to the SDK clients/consumers (as
        // a reaction to CONNECTION_FAILED). Since the
        // app/user is going to navigate to WelcomePage, the SDK
        // clients/consumers need an event.
        const { error = { recoverable: undefined }, passwordRequired } = getState()['features/base/connection'];
        passwordRequired
            && dispatch((0, actions_native_2.connectionFailed)(passwordRequired, (0, functions_1.set)(error, 'recoverable', false)));
    };
}
exports.cancelLogin = cancelLogin;
/**
 * Cancels {@link WaitForOwnerDialog}. Will navigate back to the welcome page.
 *
 * @returns {Function}
 */
function cancelWaitForOwner() {
    return (dispatch, getState) => {
        dispatch((0, actions_any_1.stopWaitForOwner)());
        // XXX The error associated with CONFERENCE_FAILED was marked as
        // recoverable by the feature room-lock and, consequently,
        // recoverable-aware features such as mobile's external-api did not
        // deliver the CONFERENCE_FAILED to the SDK clients/consumers. Since the
        // app/user is going to navigate to WelcomePage, the SDK
        // clients/consumers need an event.
        const { authRequired } = getState()['features/base/conference'];
        if (authRequired) {
            dispatch((0, actions_1.conferenceLeft)(authRequired));
            // in case we are showing lobby and on top of it wait for owner
            // we do not want to navigate away from the conference
            dispatch((0, actions_native_1.appNavigate)(undefined));
        }
    };
}
exports.cancelWaitForOwner = cancelWaitForOwner;
/**
 * Redirect to the default location (e.g. Welcome page).
 *
 * @returns {Function}
 */
function redirectToDefaultLocation() {
    return (dispatch) => dispatch((0, actions_native_1.appNavigate)(undefined));
}
exports.redirectToDefaultLocation = redirectToDefaultLocation;
/**
 * Opens token auth URL page.
 *
 * @param {string} tokenAuthServiceUrl - Authentication service URL.
 *
 * @returns {Function}
 */
function openTokenAuthUrl(tokenAuthServiceUrl) {
    return () => {
        react_native_1.Linking.openURL(tokenAuthServiceUrl);
    };
}
exports.openTokenAuthUrl = openTokenAuthUrl;
