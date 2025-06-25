"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDropboxToken = exports.authorizeDropbox = void 0;
const actionTypes_1 = require("./actionTypes");
const functions_1 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Action to authorize the Jitsi Recording app in dropbox.
 *
 * @returns {Function}
 */
function authorizeDropbox() {
    return (dispatch, getState) => {
        const state = getState();
        const { locationURL } = state['features/base/connection'];
        const { dropbox = { appKey: '',
            redirectURI: undefined } } = state['features/base/config'];
        // By default we use the static page on the main domain for redirection.
        // So we need to setup only one redirect URI in dropbox app
        // configuration (not multiple for all the tenants).
        // In case deployment is running in subfolder dropbox.redirectURI
        // can be configured.
        const redirectURI = dropbox.redirectURI || `${locationURL?.origin}/static/oauth.html`;
        (0, functions_1._authorizeDropbox)(dropbox.appKey, redirectURI)
            .then(({ token, rToken, expireDate }) => {
            dispatch(updateDropboxToken(token, rToken, expireDate));
        })
            .catch(error => logger_1.default.log('Cannot authorize dropbox', error));
    };
}
exports.authorizeDropbox = authorizeDropbox;
/**
 * Action to update the dropbox access token.
 *
 * @param {string} token - The new token.
 * @param {string} rToken - The refresh token.
 * @param {number} expireDate - The token expiration date as UNIX timestamp.
 * @returns {{
 *     type: UPDATE_DROPBOX_TOKEN,
 *     token: string,
 *     rToken: string,
 *     expireDate: number
 * }}
 */
function updateDropboxToken(token, rToken, expireDate) {
    return {
        type: actionTypes_1.UPDATE_DROPBOX_TOKEN,
        token,
        rToken,
        expireDate
    };
}
exports.updateDropboxToken = updateDropboxToken;
