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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openTokenAuthUrl = exports.redirectToDefaultLocation = exports.cancelWaitForOwner = exports.cancelLogin = void 0;
const actions_web_1 = require("../app/actions.web");
const actions_1 = require("../base/dialog/actions");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const actionTypes_1 = require("./actionTypes");
const LoginQuestionDialog_1 = __importDefault(require("./components/web/LoginQuestionDialog"));
__exportStar(require("./actions.any"), exports);
/**
 * Cancels {@ink LoginDialog}.
 *
 * @returns {{
 *     type: CANCEL_LOGIN
 * }}
 */
function cancelLogin() {
    return {
        type: actionTypes_1.CANCEL_LOGIN
    };
}
exports.cancelLogin = cancelLogin;
/**
 * Cancels authentication, closes {@link WaitForOwnerDialog}
 * and navigates back to the welcome page only in the case of authentication required error.
 * We can be showing the dialog while lobby is enabled and participant is still waiting there and hiding this dialog
 * should do nothing.
 *
 * @returns {Function}
 */
function cancelWaitForOwner() {
    return (dispatch, getState) => {
        const { authRequired } = getState()['features/base/conference'];
        authRequired && dispatch((0, actions_web_1.maybeRedirectToWelcomePage)());
    };
}
exports.cancelWaitForOwner = cancelWaitForOwner;
/**
 * Redirect to the default location (e.g. Welcome page).
 *
 * @returns {Function}
 */
function redirectToDefaultLocation() {
    return (dispatch) => dispatch((0, actions_web_1.maybeRedirectToWelcomePage)());
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
    return (dispatch, getState) => {
        const redirect = () => {
            if (lib_jitsi_meet_1.browser.isElectron()) {
                window.open(tokenAuthServiceUrl, '_blank');
            }
            else {
                window.location.href = tokenAuthServiceUrl;
            }
        };
        // Show warning for leaving conference only when in a conference.
        if (!lib_jitsi_meet_1.browser.isElectron() && getState()['features/base/conference'].conference) {
            dispatch((0, actions_1.openDialog)(LoginQuestionDialog_1.default, {
                handler: () => {
                    // Give time for the dialog to close.
                    setTimeout(() => redirect(), 500);
                }
            }));
        }
        else {
            redirect();
        }
    };
}
exports.openTokenAuthUrl = openTokenAuthUrl;
