"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnabled = exports.getSpaceUsage = exports.getDisplayName = exports.getNewAccessToken = exports._authorizeDropbox = void 0;
const react_native_1 = require("react-native");
const functions_1 = require("../mobile/picture-in-picture/functions");
const { Dropbox } = react_native_1.NativeModules;
/**
 * Action to authorize the Jitsi Recording app in dropbox.
 *
 * @param {any} _appKey - Used on web.
 * @param {any} _redirectURI - Used on web.
 * @returns {Promise<Object>} - The promise will be resolved with the dropbox
 * access token or rejected with an error.
 */
async function _authorizeDropbox(_appKey, _redirectURI) {
    (0, functions_1.setPictureInPictureEnabled)(false);
    try {
        return await Dropbox.authorize();
    }
    finally {
        (0, functions_1.setPictureInPictureEnabled)(true);
    }
}
exports._authorizeDropbox = _authorizeDropbox;
/**
 * Gets a new access token based on the refresh token.
 *
 * @param {string} _appKey - The dropbox appKey.
 * @param {string} _rToken - The refresh token.
 * @returns {Promise}
 */
function getNewAccessToken(_appKey, _rToken) {
    return _authorizeDropbox();
}
exports.getNewAccessToken = getNewAccessToken;
/**
 * Returns the display name for the current dropbox account.
 *
 * @param {string} token - The dropbox access token.
 * @param {any} _appKey - Used on web.
 * @returns {Promise<string>} - The promise will be resolved with the display
 * name or rejected with an error.
 */
function getDisplayName(token, _appKey) {
    return Dropbox.getDisplayName(token);
}
exports.getDisplayName = getDisplayName;
/**
 * Returns information about the space usage for the current dropbox account.
 *
 * @param {string} token - The dropbox access token.
 * @param {any} _appKey - Used on web.
 * @returns {Promise<{ used: number, allocated: number}>} - The promise will be
 * resolved with the object with information about the space usage (the used
 * space and the allocated space) for the current dropbox account or rejected
 * with an error.
 */
function getSpaceUsage(token, _appKey) {
    return Dropbox.getSpaceUsage(token);
}
exports.getSpaceUsage = getSpaceUsage;
/**
 * Returns <tt>true</tt> if the dropbox features is enabled and <tt>false</tt>
 * otherwise.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean}
 */
function isEnabled(state) {
    const { dropbox = { appKey: undefined } } = state['features/base/config'];
    return Boolean(Dropbox?.ENABLED && typeof dropbox.appKey === 'string');
}
exports.isEnabled = isEnabled;
