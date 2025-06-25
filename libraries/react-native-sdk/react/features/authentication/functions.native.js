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
exports.getTokenAuthUrl = void 0;
const react_native_1 = require("react-native");
const functions_any_1 = require("./functions.any");
__exportStar(require("./functions.any"), exports);
/**
 * Creates the URL pointing to JWT token authentication service. It is
 * formatted from the 'urlPattern' argument which can contain the following
 * constants:
 * '{room}' - name of the conference room passed as <tt>roomName</tt>
 * argument to this method.
 *
 * @param {Object} config - Configuration state object from store. A URL pattern pointing to the login service.
 * @param {URL} locationURL - The location URL.
 * @param {Object} options:  - Config options {
 *     audioMuted: boolean | undefined
 *     audioOnlyEnabled: boolean | undefined,
 *     skipPrejoin: boolean | undefined,
 *     videoMuted: boolean | undefined
 * }.
 * @param {string?} roomName - The room name.
 * @param {string?} tenant - The tenant name if any.
 *
 * @returns {Promise<string|undefined>} - The URL pointing to JWT login service or
 * <tt>undefined</tt> if the pattern stored in config is not a string and the URL can not be
 * constructed.
 */
const getTokenAuthUrl = (config, locationURL, options, roomName, 
// eslint-disable-next-line max-params
tenant) => {
    const { audioMuted = false, audioOnlyEnabled = false, skipPrejoin = false, videoMuted = false } = options;
    let url = config.tokenAuthUrl;
    if (!url || !roomName) {
        return Promise.resolve(undefined);
    }
    if (url.indexOf('{state}')) {
        const state = (0, functions_any_1._getTokenAuthState)(locationURL, {
            audioMuted,
            audioOnlyEnabled,
            skipPrejoin,
            videoMuted
        }, roomName, tenant);
        // Append ios=true or android=true to the token URL.
        // @ts-ignore
        state[react_native_1.Platform.OS] = true;
        url = url.replace('{state}', encodeURIComponent(JSON.stringify(state)));
    }
    return Promise.resolve(url.replace('{room}', roomName));
};
exports.getTokenAuthUrl = getTokenAuthUrl;
