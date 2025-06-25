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
exports._setDeeplinkingDefaults = exports.getReplaceParticipant = exports._cleanupConfig = void 0;
const react_native_1 = require("react-native");
const constants_1 = require("../flags/constants");
const functions_1 = require("../flags/functions");
__exportStar(require("./functions.any"), exports);
/**
 * Removes all analytics related options from the given configuration, in case of a libre build.
 *
 * @param {*} config - The configuration which needs to be cleaned up.
 * @returns {void}
 */
function _cleanupConfig(config) {
    config.analytics = config.analytics ?? {};
    config.analytics.scriptURLs = [];
    if (react_native_1.NativeModules.AppInfo.LIBRE_BUILD) {
        delete config.analytics?.amplitudeAPPKey;
        delete config.analytics?.googleAnalyticsTrackingId;
        delete config.analytics?.rtcstatsEnabled;
        delete config.analytics?.rtcstatsEndpoint;
        delete config.analytics?.rtcstatsPollInterval;
        delete config.analytics?.rtcstatsSendSdp;
        delete config.analytics?.rtcstatsUseLegacy;
        delete config.analytics?.obfuscateRoomName;
        delete config.analytics?.watchRTCEnabled;
        delete config.watchRTCConfigParams;
        config.giphy = { enabled: false };
    }
}
exports._cleanupConfig = _cleanupConfig;
/**
 * Returns the replaceParticipant config.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
function getReplaceParticipant(state) {
    return (0, functions_1.getFeatureFlag)(state, constants_1.REPLACE_PARTICIPANT, false);
}
exports.getReplaceParticipant = getReplaceParticipant;
/**
 * Sets the defaults for deeplinking.
 *
 * @param {IDeeplinkingConfig} _deeplinking - The deeplinking config.
 * @returns {void}
 */
function _setDeeplinkingDefaults(_deeplinking) {
    return;
}
exports._setDeeplinkingDefaults = _setDeeplinkingDefaults;
