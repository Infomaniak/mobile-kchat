"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnabled = exports.getSpaceUsage = exports.getDisplayName = exports.getNewAccessToken = exports._authorizeDropbox = void 0;
const dropbox_1 = require("dropbox");
/**
 * Executes the oauth flow.
 *
 * @param {string} authUrl - The URL to oauth service.
 * @returns {Promise<string>} - The URL with the authorization details.
 */
function authorize(authUrl) {
    const windowName = `oauth${Date.now()}`;
    return new Promise(resolve => {
        // eslint-disable-next-line prefer-const
        let popup;
        const handleAuth = ({ data }) => {
            if (data && data.type === 'dropbox-login' && data.windowName === windowName) {
                if (popup) {
                    popup.close();
                }
                window.removeEventListener('message', handleAuth);
                resolve(data.url);
            }
        };
        window.addEventListener('message', handleAuth);
        popup = window.open(authUrl, windowName);
    });
}
/**
 * Returns the token's expiry date as UNIX timestamp.
 *
 * @param {number} expiresIn - The seconds in which the token expires.
 * @returns {number} - The timestamp value for the expiry date.
 */
function getTokenExpiresAtTimestamp(expiresIn) {
    return new Date(Date.now() + (expiresIn * 1000)).getTime();
}
/**
 * Action to authorize the Jitsi Recording app in dropbox.
 *
 * @param {string} appKey - The Jitsi Recorder dropbox app key.
 * @param {string} redirectURI - The return URL.
 * @returns {Promise<Object>}
 */
function _authorizeDropbox(appKey, redirectURI) {
    const dropbox = new dropbox_1.DropboxAuth({ clientId: appKey });
    return dropbox.getAuthenticationUrl(redirectURI, undefined, 'code', 'offline', undefined, undefined, true)
        // @ts-ignore
        .then(authorize)
        .then(returnUrl => {
        const params = new URLSearchParams(new URL(returnUrl).search);
        const code = params.get('code');
        return dropbox.getAccessTokenFromCode(redirectURI, code ?? '');
    })
        .then((resp) => {
        return {
            token: resp.result.access_token,
            rToken: resp.result.refresh_token,
            expireDate: getTokenExpiresAtTimestamp(resp.result.expires_in)
        };
    });
}
exports._authorizeDropbox = _authorizeDropbox;
/**
 * Gets a new access token based on the refresh token.
 *
 * @param {string} appKey - The dropbox appKey.
 * @param {string} rToken - The refresh token.
 * @returns {Promise}
 */
function getNewAccessToken(appKey, rToken) {
    const dropbox = new dropbox_1.DropboxAuth({ clientId: appKey });
    dropbox.setRefreshToken(rToken);
    return dropbox.refreshAccessToken() // @ts-ignore
        .then(() => {
        return {
            token: dropbox.getAccessToken(),
            rToken: dropbox.getRefreshToken(),
            expireDate: dropbox.getAccessTokenExpiresAt().getTime()
        };
    });
}
exports.getNewAccessToken = getNewAccessToken;
/**
 * Returns the display name for the current dropbox account.
 *
 * @param {string} token - The dropbox access token.
 * @param {string} appKey - The Jitsi Recorder dropbox app key.
 * @returns {Promise<string>}
 */
function getDisplayName(token, appKey) {
    const dropboxAPI = new dropbox_1.Dropbox({
        accessToken: token,
        clientId: appKey
    });
    return (dropboxAPI.usersGetCurrentAccount()
        .then(account => account.result.name.display_name));
}
exports.getDisplayName = getDisplayName;
/**
 * Returns information about the space usage for the current dropbox account.
 *
 * @param {string} token - The dropbox access token.
 * @param {string} appKey - The Jitsi Recorder dropbox app key.
 * @returns {Promise<Object>}
 */
function getSpaceUsage(token, appKey) {
    const dropboxAPI = new dropbox_1.Dropbox({
        accessToken: token,
        clientId: appKey
    });
    return dropboxAPI.usersGetSpaceUsage().then(space => {
        const { allocation, used } = space.result;
        // @ts-ignore
        const { allocated } = allocation;
        return {
            allocated,
            used
        };
    });
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
    return typeof dropbox.appKey === 'string';
}
exports.isEnabled = isEnabled;
