"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGifEnabled = exports.getGifAPIKey = exports.formatGifUrlMessage = exports.getGifUrl = exports.isGifMessage = exports.getGifForParticipant = exports.getGiphyProxyUrl = exports.getGifRating = exports.getGifDisplayMode = exports.getGifConfig = void 0;
const constants_1 = require("./constants");
/**
 * Returns the gif config.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {Object}
 */
function getGifConfig(state) {
    return state['features/base/config'].giphy || {};
}
exports.getGifConfig = getGifConfig;
/**
 * Get the GIF display mode.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {string}
 */
function getGifDisplayMode(state) {
    return getGifConfig(state).displayMode || 'all';
}
exports.getGifDisplayMode = getGifDisplayMode;
/**
 * Get the GIF audience rating.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {string}
 */
function getGifRating(state) {
    return getGifConfig(state).rating || constants_1.GIF_DEFAULT_RATING;
}
exports.getGifRating = getGifRating;
/**
 * Get the Giphy proxy url.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {string}
 */
function getGiphyProxyUrl(state) {
    return getGifConfig(state).proxyUrl;
}
exports.getGiphyProxyUrl = getGiphyProxyUrl;
/**
 * Gets the URL of the GIF for the given participant or null if there's none.
 *
 * @param {IReduxState} state - Redux state.
 * @param {string} participantId - Id of the participant for which to remove the GIF.
 * @returns {Object}
 */
function getGifForParticipant(state, participantId) {
    return isGifEnabled(state) ? state['features/gifs'].gifList.get(participantId) || {} : {};
}
exports.getGifForParticipant = getGifForParticipant;
/**
 * Whether or not the message is a GIF message.
 *
 * @param {string} message - Message to check.
 * @returns {boolean}
 */
function isGifMessage(message) {
    return message.trim().toLowerCase()
        .startsWith(constants_1.GIF_PREFIX);
}
exports.isGifMessage = isGifMessage;
/**
 * Returns the url of the gif selected in the gifs menu.
 *
 * @param {Object} gif - The gif data.
 * @param {string} proxyUrl - The proxy server url.
 * @returns {boolean}
 */
function getGifUrl(gif, proxyUrl) {
    const embedUrl = gif?.embed_url || gif?.data?.embed_url || '';
    const idx = embedUrl.lastIndexOf('/');
    const id = embedUrl.substr(idx + 1);
    if (proxyUrl) {
        return `${proxyUrl}gifs/id/${id}`;
    }
    return `https://i.giphy.com/media/${id}/giphy.gif`;
}
exports.getGifUrl = getGifUrl;
/**
 * Formats the gif message.
 *
 * @param {string} url - GIF url.
 * @returns {string}
 */
function formatGifUrlMessage(url) {
    return `${constants_1.GIF_PREFIX}${url}]`;
}
exports.formatGifUrlMessage = formatGifUrlMessage;
/**
 * Get the Giphy API Key from config.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {string}
 */
function getGifAPIKey(state) {
    return getGifConfig(state).sdkKey ?? '';
}
exports.getGifAPIKey = getGifAPIKey;
/**
 * Returns whether or not the feature is enabled.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {boolean}
 */
function isGifEnabled(state) {
    const { disableThirdPartyRequests } = state['features/base/config'];
    const { giphy } = state['features/base/config'];
    const showGiphyIntegration = state['features/dynamic-branding']?.showGiphyIntegration !== false;
    if (navigator.product === 'ReactNative' && window.JITSI_MEET_LITE_SDK) {
        return false;
    }
    return showGiphyIntegration && Boolean(!disableThirdPartyRequests && giphy?.enabled && Boolean(giphy?.sdkKey));
}
exports.isGifEnabled = isGifEnabled;
