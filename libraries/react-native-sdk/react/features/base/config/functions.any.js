"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLegalUrls = exports.getSecurityUiConfig = exports.getDialOutUrl = exports.getDialOutStatusUrl = exports.setConfigFromURLParams = exports.restoreConfig = exports.isDisplayNameVisible = exports.isNameReadOnly = exports.getWhitelistedJSON = exports.overrideConfigJSON = exports.getRecordingSharingUrl = exports.getDisableRemoveRaisedHandOnFocus = exports.getFeatureFlag = exports.getSsrcRewritingFeatureFlag = exports.getMeetingRegion = exports.createFakeConfig = exports.getRoomName = void 0;
// @ts-ignore
const js_utils_1 = require("@jitsi/js-utils");
// eslint-disable-next-line lines-around-comment
// @ts-ignore
const json_1 = require("@jitsi/js-utils/json");
const lodash_1 = __importDefault(require("lodash"));
const parseURLParams_1 = require("../util/parseURLParams");
const configWhitelist_1 = __importDefault(require("./configWhitelist"));
const constants_1 = require("./constants");
const interfaceConfigWhitelist_1 = __importDefault(require("./interfaceConfigWhitelist"));
const logger_1 = __importDefault(require("./logger"));
// XXX The function getRoomName is split out of
// functions.any.js because it is bundled in both app.bundle and
// do_external_connect, webpack 1 does not support tree shaking, and we don't
// want all functions to be bundled in do_external_connect.
var getRoomName_1 = require("./getRoomName");
Object.defineProperty(exports, "getRoomName", { enumerable: true, get: function () { return __importDefault(getRoomName_1).default; } });
/**
 * Create a "fake" configuration object for the given base URL. This is used in case the config
 * couldn't be loaded in the welcome page, so at least we have something to try with.
 *
 * @param {string} baseURL - URL of the deployment for which we want the fake config.
 * @returns {Object}
 */
function createFakeConfig(baseURL) {
    const url = new URL(baseURL);
    return {
        hosts: {
            domain: url.hostname,
            muc: `conference.${url.hostname}`
        },
        bosh: `${baseURL}http-bind`,
        p2p: {
            enabled: true
        }
    };
}
exports.createFakeConfig = createFakeConfig;
/**
 * Selector used to get the meeting region.
 *
 * @param {Object} state - The global state.
 * @returns {string}
 */
function getMeetingRegion(state) {
    return state['features/base/config']?.deploymentInfo?.region || '';
}
exports.getMeetingRegion = getMeetingRegion;
/**
 * Selector used to get the SSRC-rewriting feature flag.
 *
 * @param {Object} state - The global state.
 * @returns {boolean}
 */
function getSsrcRewritingFeatureFlag(state) {
    return getFeatureFlag(state, constants_1.FEATURE_FLAGS.SSRC_REWRITING) ?? true;
}
exports.getSsrcRewritingFeatureFlag = getSsrcRewritingFeatureFlag;
/**
 * Selector used to get a feature flag.
 *
 * @param {Object} state - The global state.
 * @param {string} featureFlag - The name of the feature flag.
 * @returns {boolean}
 */
function getFeatureFlag(state, featureFlag) {
    const featureFlags = state['features/base/config']?.flags || {};
    return featureFlags[featureFlag];
}
exports.getFeatureFlag = getFeatureFlag;
/**
 * Selector used to get the disableRemoveRaisedHandOnFocus.
 *
 * @param {Object} state - The global state.
 * @returns {boolean}
 */
function getDisableRemoveRaisedHandOnFocus(state) {
    return state['features/base/config']?.disableRemoveRaisedHandOnFocus || false;
}
exports.getDisableRemoveRaisedHandOnFocus = getDisableRemoveRaisedHandOnFocus;
/**
 * Selector used to get the endpoint used for fetching the recording.
 *
 * @param {Object} state - The global state.
 * @returns {string}
 */
function getRecordingSharingUrl(state) {
    return state['features/base/config'].recordingSharingUrl;
}
exports.getRecordingSharingUrl = getRecordingSharingUrl;
/**
 * Overrides JSON properties in {@code config} and
 * {@code interfaceConfig} Objects with the values from {@code newConfig}.
 * Overrides only the whitelisted keys.
 *
 * @param {Object} config - The config Object in which we'll be overriding
 * properties.
 * @param {Object} interfaceConfig - The interfaceConfig Object in which we'll
 * be overriding properties.
 * @param {Object} json - Object containing configuration properties.
 * Destination object is selected based on root property name:
 * {
 *     config: {
 *         // config.js properties here
 *     },
 *     interfaceConfig: {
 *         // interface_config.js properties here
 *     }
 * }.
 * @returns {void}
 */
function overrideConfigJSON(config, interfaceConfig, json) {
    for (const configName of Object.keys(json)) {
        let configObj;
        if (configName === 'config') {
            configObj = config;
        }
        else if (configName === 'interfaceConfig') {
            configObj = interfaceConfig;
        }
        if (configObj) {
            const configJSON = getWhitelistedJSON(configName, json[configName]);
            if (!lodash_1.default.isEmpty(configJSON)) {
                logger_1.default.info(`Extending ${configName} with: ${JSON.stringify(configJSON)}`);
                // eslint-disable-next-line arrow-body-style
                lodash_1.default.mergeWith(configObj, configJSON, (oldValue, newValue) => {
                    // XXX We don't want to merge the arrays, we want to
                    // overwrite them.
                    return Array.isArray(oldValue) ? newValue : undefined;
                });
            }
        }
    }
}
exports.overrideConfigJSON = overrideConfigJSON;
/* eslint-enable max-params, no-shadow */
/**
 * Apply whitelist filtering for configs with whitelists.
 * Only extracts overridden values for keys we allow to be overridden.
 *
 * @param {string} configName - The config name, one of config or interfaceConfig.
 * @param {Object} configJSON - The object with keys and values to override.
 * @returns {Object} - The result object only with the keys
 * that are whitelisted.
 */
function getWhitelistedJSON(configName, configJSON) {
    if (configName === 'interfaceConfig') {
        return lodash_1.default.pick(configJSON, interfaceConfigWhitelist_1.default);
    }
    else if (configName === 'config') {
        return lodash_1.default.pick(configJSON, configWhitelist_1.default);
    }
    return configJSON;
}
exports.getWhitelistedJSON = getWhitelistedJSON;
/**
 * Selector for determining if the display name is read only.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
function isNameReadOnly(state) {
    return Boolean(state['features/base/config'].disableProfile
        || state['features/base/config'].readOnlyName);
}
exports.isNameReadOnly = isNameReadOnly;
/**
 * Selector for determining if the display name is visible.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
function isDisplayNameVisible(state) {
    return !state['features/base/config'].hideDisplayName;
}
exports.isDisplayNameVisible = isDisplayNameVisible;
/**
 * Restores a Jitsi Meet config.js from {@code localStorage} if it was
 * previously downloaded from a specific {@code baseURL} and stored with
 * {@link storeConfig}.
 *
 * @param {string} baseURL - The base URL from which the config.js was
 * previously downloaded and stored with {@code storeConfig}.
 * @returns {?Object} The Jitsi Meet config.js which was previously downloaded
 * from {@code baseURL} and stored with {@code storeConfig} if it was restored;
 * otherwise, {@code undefined}.
 */
function restoreConfig(baseURL) {
    const key = `${constants_1._CONFIG_STORE_PREFIX}/${baseURL}`;
    const config = js_utils_1.jitsiLocalStorage.getItem(key);
    if (config) {
        try {
            return (0, json_1.safeJsonParse)(config) || undefined;
        }
        catch (e) {
            // Somehow incorrect data ended up in the storage. Clean it up.
            js_utils_1.jitsiLocalStorage.removeItem(key);
        }
    }
    return undefined;
}
exports.restoreConfig = restoreConfig;
/**
 * Inspects the hash part of the location URI and overrides values specified
 * there in the corresponding config objects given as the arguments. The syntax
 * is: {@code https://server.com/room#config.debug=true
 * &interfaceConfig.showButton=false}.
 *
 * In the hash part each parameter will be parsed to JSON and then the root
 * object will be matched with the corresponding config object given as the
 * argument to this function.
 *
 * @param {Object} config - This is the general config.
 * @param {Object} interfaceConfig - This is the interface config.
 * @param {URI} location - The new location to which the app is navigating to.
 * @returns {void}
 */
function setConfigFromURLParams(config, interfaceConfig, location) {
    const params = (0, parseURLParams_1.parseURLParams)(location);
    const json = {};
    // At this point we have:
    // params = {
    //     "config.disableAudioLevels": false,
    //     "config.channelLastN": -1,
    //     "interfaceConfig.APP_NAME": "Jitsi Meet"
    // }
    // We want to have:
    // json = {
    //     config: {
    //         "disableAudioLevels": false,
    //         "channelLastN": -1
    //     },
    //     interfaceConfig: {
    //         "APP_NAME": "Jitsi Meet"
    //     }
    // }
    config && (json.config = {});
    interfaceConfig && (json.interfaceConfig = {});
    for (const param of Object.keys(params)) {
        let base = json;
        const names = param.split('.');
        const last = names.pop() ?? '';
        for (const name of names) {
            base = base[name] = base[name] || {};
        }
        base[last] = params[param];
    }
    overrideConfigJSON(config, interfaceConfig, json);
}
exports.setConfigFromURLParams = setConfigFromURLParams;
/* eslint-enable max-params */
/**
 * Returns the dial out url.
 *
 * @param {Object} state - The state of the app.
 * @returns {string}
 */
function getDialOutStatusUrl(state) {
    return state['features/base/config'].guestDialOutStatusUrl;
}
exports.getDialOutStatusUrl = getDialOutStatusUrl;
/**
 * Returns the dial out status url.
 *
 * @param {Object} state - The state of the app.
 * @returns {string}
 */
function getDialOutUrl(state) {
    return state['features/base/config'].guestDialOutUrl;
}
exports.getDialOutUrl = getDialOutUrl;
/**
 * Selector to return the security UI config.
 *
 * @param {IReduxState} state - State object.
 * @returns {Object}
 */
function getSecurityUiConfig(state) {
    return state['features/base/config']?.securityUi || {};
}
exports.getSecurityUiConfig = getSecurityUiConfig;
/**
 * Returns the terms, privacy and help centre URL's.
 *
 * @param {IReduxState} state - The state of the application.
 * @returns {{
 *  privacy: string,
 *  helpCentre: string,
 *  terms: string
 * }}
 */
function getLegalUrls(state) {
    const helpCentreURL = state['features/base/config']?.helpCentreURL;
    const configLegalUrls = state['features/base/config']?.legalUrls;
    return {
        privacy: configLegalUrls?.privacy || constants_1.DEFAULT_PRIVACY_URL,
        helpCentre: helpCentreURL || configLegalUrls?.helpCentre || constants_1.DEFAULT_HELP_CENTRE_URL,
        terms: configLegalUrls?.terms || constants_1.DEFAULT_TERMS_URL
    };
}
exports.getLegalUrls = getLegalUrls;
