"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCustomIcons = exports.isDynamicBrandingDataLoaded = exports.getDynamicBrandingUrl = exports.extractFqnFromPath = void 0;
const functions_1 = require("../base/redux/functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Extracts the fqn part from a path, where fqn represents
 * tenant/roomName.
 *
 * @param {Object} state - A redux state.
 * @returns {string}
 */
function extractFqnFromPath(state) {
    let pathname;
    if (window.location.pathname) {
        pathname = window.location.pathname;
    }
    else if (state?.['features/base/connection']) {
        pathname = state['features/base/connection'].locationURL?.pathname ?? '';
    }
    else {
        return '';
    }
    const parts = pathname.split('/');
    const len = parts.length;
    return parts.length > 2 ? `${parts[len - 2]}/${parts[len - 1]}` : parts[1];
}
exports.extractFqnFromPath = extractFqnFromPath;
/**
 * Returns the url used for fetching dynamic branding.
 *
 * @param {Object | Function} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {string}
 */
async function getDynamicBrandingUrl(stateful) {
    const state = (0, functions_1.toState)(stateful);
    // NB: On web this is dispatched really early, before the config has been stored in the
    // state. Thus, fetch it from the window global.
    const config = navigator.product === 'ReactNative' ? state['features/base/config'] : window.config;
    const { dynamicBrandingUrl } = config;
    if (dynamicBrandingUrl) {
        return dynamicBrandingUrl;
    }
    const { brandingDataUrl: baseUrl } = config;
    const fqn = extractFqnFromPath(state);
    if (baseUrl && fqn) {
        return `${baseUrl}?conferenceFqn=${encodeURIComponent(fqn)}`;
    }
}
exports.getDynamicBrandingUrl = getDynamicBrandingUrl;
/**
 * Selector used for getting the load state of the dynamic branding data.
 *
 * @param {Object} state - Global state of the app.
 * @returns {boolean}
 */
function isDynamicBrandingDataLoaded(state) {
    return state['features/dynamic-branding'].customizationReady;
}
exports.isDynamicBrandingDataLoaded = isDynamicBrandingDataLoaded;
/**
 * Fetch SVG XMLs from branding icons urls.
 *
 * @param {Object} customIcons - The map of branded icons.
 * @returns {Object}
 */
const fetchCustomIcons = async (customIcons) => {
    const localCustomIcons = {};
    for (const [key, url] of Object.entries(customIcons)) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const svgXml = await response.text();
                localCustomIcons[key] = svgXml;
            }
            else {
                logger_1.default.error(`Failed to fetch ${url}. Status: ${response.status}`);
            }
        }
        catch (error) {
            logger_1.default.error(`Error fetching ${url}:`, error);
        }
    }
    return localCustomIcons;
};
exports.fetchCustomIcons = fetchCustomIcons;
