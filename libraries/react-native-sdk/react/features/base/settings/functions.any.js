"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHideSelfView = exports.shouldHideShareAudioHelper = exports.getServerURL = exports.getPropertyValue = void 0;
const functions_1 = require("../../visitors/functions");
const configWhitelist_1 = __importDefault(require("../config/configWhitelist"));
const functions_2 = require("../redux/functions");
const parseURLParams_1 = require("../util/parseURLParams");
const constants_1 = require("./constants");
/**
 * Returns the effective value of a configuration/preference/setting by applying
 * a precedence among the values specified by JWT, URL, settings,
 * and config.
 *
 * @param {Object|Function} stateful - The redux state object or {@code getState} function.
 * @param {string} propertyName - The name of the
 * configuration/preference/setting (property) to retrieve.
 * @param {Object} sources - Flags indicating the configuration/preference/setting sources to
 * consider/retrieve values from.
 * @param {boolean} sources.config - Config.
 * @param {boolean} jwt - JWT.
 * @param {boolean} settings - Settings.
 * @param {boolean} urlParams - URL parameters.
 * @returns {any}
 */
function getPropertyValue(stateful, propertyName, sources) {
    // Default values don't play nicely with partial objects and we want to make
    // the function easy to use without exhaustively defining all flags:
    sources = {
        // Defaults:
        config: true,
        jwt: true,
        settings: true,
        urlParams: true,
        ...sources
    };
    // Precedence: jwt -> urlParams -> settings -> config.
    const state = (0, functions_2.toState)(stateful);
    // jwt
    if (sources.jwt) {
        const value = state['features/base/jwt'][propertyName];
        if (typeof value !== 'undefined') {
            return value[propertyName];
        }
    }
    // urlParams
    if (sources.urlParams) {
        if (configWhitelist_1.default.indexOf(propertyName) !== -1) {
            const urlParams = (0, parseURLParams_1.parseURLParams)(state['features/base/connection'].locationURL ?? '');
            const value = urlParams[`config.${propertyName}`];
            if (typeof value !== 'undefined') {
                return value;
            }
        }
    }
    // settings
    if (sources.settings) {
        const value = state['features/base/settings'][propertyName];
        if (typeof value !== 'undefined') {
            return value;
        }
    }
    // config
    if (sources.config) {
        const value = state['features/base/config'][propertyName];
        if (typeof value !== 'undefined') {
            return value;
        }
    }
    return undefined;
}
exports.getPropertyValue = getPropertyValue;
/**
 * Gets the currently configured server URL.
 *
 * @param {Object|Function} stateful - The redux state object or
 * {@code getState} function.
 * @returns {string} - The currently configured server URL.
 */
function getServerURL(stateful) {
    const state = (0, functions_2.toState)(stateful);
    return state['features/base/settings'].serverURL || constants_1.DEFAULT_SERVER_URL;
}
exports.getServerURL = getServerURL;
/**
 * Should we hide the helper dialog when a user tries to do audio only screen sharing.
 *
 * @param {Object} state - The state of the application.
 * @returns {boolean}
 */
function shouldHideShareAudioHelper(state) {
    return state['features/base/settings'].hideShareAudioHelper;
}
exports.shouldHideShareAudioHelper = shouldHideShareAudioHelper;
/**
 * Gets the disabled self view setting.
 *
 * @param {Object} state - Redux state.
 * @returns {boolean}
 */
function getHideSelfView(state) {
    return state['features/base/config'].disableSelfView || state['features/base/settings'].disableSelfView
        || (0, functions_1.iAmVisitor)(state);
}
exports.getHideSelfView = getHideSelfView;
