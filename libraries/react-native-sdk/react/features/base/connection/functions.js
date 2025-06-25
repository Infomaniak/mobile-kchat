"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJid = exports.isInviteURLReady = exports.getInviteURL = exports.getCurrentConferenceUrl = void 0;
const functions_1 = require("../redux/functions");
const uri_1 = require("../util/uri");
const utils_1 = require("./utils");
/**
 * Figures out what's the current conference URL which is supposed to indicate what conference is currently active.
 * When not currently in any conference and not trying to join any then 'undefined' is returned.
 *
 * @param {Object|Function} stateful - Either the whole Redux state object or the Redux store's {@code getState} method.
 * @returns {string|undefined}
 * @private
 */
function getCurrentConferenceUrl(stateful) {
    const state = (0, functions_1.toState)(stateful);
    let currentUrl;
    if (isInviteURLReady(state)) {
        currentUrl = (0, uri_1.toURLString)(getInviteURL(state));
    }
    // Check if the URL doesn't end with a slash
    if (currentUrl && currentUrl.substr(-1) === '/') {
        currentUrl = undefined;
    }
    return currentUrl ? currentUrl : undefined;
}
exports.getCurrentConferenceUrl = getCurrentConferenceUrl;
/**
 * Retrieves a simplified version of the conference/location URL stripped of URL params (i.e. Query/search and hash)
 * which should be used for sending invites.
 * NOTE that the method will throw an error if called too early. That is before the conference is joined or before
 * the process of joining one has started. This limitation does not apply to the case when called with the URL object
 * instance. Use {@link isInviteURLReady} to check if it's safe to call the method already.
 *
 * @param {Function|Object} stateOrGetState - The redux state or redux's {@code getState} function or the URL object
 * to be stripped.
 * @returns {string}
 */
function getInviteURL(stateOrGetState) {
    const state = (0, functions_1.toState)(stateOrGetState);
    let locationURL = state instanceof URL
        ? state
        : state['features/base/connection'].locationURL;
    // If there's no locationURL on the base/connection feature try the base/config where it's set earlier.
    if (!locationURL) {
        locationURL = state['features/base/config'].locationURL;
    }
    if (!locationURL) {
        throw new Error('Can not get invite URL - the app is not ready');
    }
    const { inviteDomain } = state['features/dynamic-branding'];
    const urlWithoutParams = (0, utils_1.getURLWithoutParams)(locationURL);
    if (inviteDomain) {
        const meetingId = state['features/base/config'].brandingRoomAlias || urlWithoutParams.pathname.replace(/\//, '');
        return `${inviteDomain}/${meetingId}`;
    }
    return urlWithoutParams.href;
}
exports.getInviteURL = getInviteURL;
/**
 * Checks whether or not is safe to call the {@link getInviteURL} method already.
 *
 * @param {Function|Object} stateOrGetState - The redux state or redux's {@code getState} function.
 * @returns {boolean}
 */
function isInviteURLReady(stateOrGetState) {
    const state = (0, functions_1.toState)(stateOrGetState);
    return Boolean(state['features/base/connection'].locationURL || state['features/base/config'].locationURL);
}
exports.isInviteURLReady = isInviteURLReady;
/**
 * Converts a specific id to jid if it's not jid yet.
 *
 * @param {string} id - User id or jid.
 * @param {Object} configHosts - The {@code hosts} part of the {@code config}
 * object.
 * @returns {string} A string in the form of a JID (i.e.
 * {@code user@server.com}).
 */
function toJid(id, { authdomain, domain }) {
    return id.indexOf('@') >= 0 ? id : `${id}@${authdomain || domain}`;
}
exports.toJid = toJid;
