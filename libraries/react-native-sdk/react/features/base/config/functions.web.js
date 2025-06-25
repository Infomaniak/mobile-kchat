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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._setDeeplinkingDefaults = exports.areAudioLevelsEnabled = exports.getWebHIDFeatureConfig = exports.getReplaceParticipant = exports._cleanupConfig = void 0;
const lib_jitsi_meet_1 = __importDefault(require("../../base/lib-jitsi-meet"));
__exportStar(require("./functions.any"), exports);
/**
 * Removes all analytics related options from the given configuration, in case of a libre build.
 *
 * @param {*} _config - The configuration which needs to be cleaned up.
 * @returns {void}
 */
function _cleanupConfig(_config) {
    return;
}
exports._cleanupConfig = _cleanupConfig;
/**
 * Returns the replaceParticipant config.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
function getReplaceParticipant(state) {
    return state['features/base/config'].replaceParticipant;
}
exports.getReplaceParticipant = getReplaceParticipant;
/**
 * Returns the configuration value of web-hid feature.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean} True if web-hid feature should be enabled, otherwise false.
 */
function getWebHIDFeatureConfig(state) {
    return state['features/base/config'].enableWebHIDFeature || false;
}
exports.getWebHIDFeatureConfig = getWebHIDFeatureConfig;
/**
 * Returns whether audio level measurement is enabled or not.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
function areAudioLevelsEnabled(state) {
    return !state['features/base/config'].disableAudioLevels && lib_jitsi_meet_1.default.isCollectingLocalStats();
}
exports.areAudioLevelsEnabled = areAudioLevelsEnabled;
/**
 * Sets the defaults for deeplinking.
 *
 * @param {IDeeplinkingConfig} deeplinking - The deeplinking config.
 * @returns {void}
 */
function _setDeeplinkingDefaults(deeplinking) {
    deeplinking.desktop = deeplinking.desktop || {};
    deeplinking.android = deeplinking.android || {};
    deeplinking.ios = deeplinking.ios || {};
    const { android, desktop, ios } = deeplinking;
    desktop.appName = desktop.appName || 'Jitsi Meet';
    desktop.appScheme = desktop.appScheme || 'jitsi-meet';
    desktop.download = desktop.download || {};
    desktop.download.windows = desktop.download.windows
        || 'https://github.com/jitsi/jitsi-meet-electron/releases/latest/download/jitsi-meet.exe';
    desktop.download.macos = desktop.download.macos
        || 'https://github.com/jitsi/jitsi-meet-electron/releases/latest/download/jitsi-meet.dmg';
    desktop.download.linux = desktop.download.linux
        || 'https://github.com/jitsi/jitsi-meet-electron/releases/latest/download/jitsi-meet-x86_64.AppImage';
    ios.appName = ios.appName || 'Jitsi Meet';
    ios.appScheme = ios.appScheme || 'org.jitsi.meet';
    ios.downloadLink = ios.downloadLink
        || 'https://itunes.apple.com/us/app/jitsi-meet/id1165103905';
    if (ios.dynamicLink) {
        ios.dynamicLink.apn = ios.dynamicLink.apn || 'org.jitsi.meet';
        ios.dynamicLink.appCode = ios.dynamicLink.appCode || 'w2atb';
        ios.dynamicLink.ibi = ios.dynamicLink.ibi || 'com.atlassian.JitsiMeet.ios';
        ios.dynamicLink.isi = ios.dynamicLink.isi || '1165103905';
    }
    android.appName = android.appName || 'Jitsi Meet';
    android.appScheme = android.appScheme || 'org.jitsi.meet';
    android.downloadLink = android.downloadLink
        || 'https://play.google.com/store/apps/details?id=org.jitsi.meet';
    android.appPackage = android.appPackage || 'org.jitsi.meet';
    android.fDroidUrl = android.fDroidUrl || 'https://f-droid.org/en/packages/org.jitsi.meet/';
    if (android.dynamicLink) {
        android.dynamicLink.apn = android.dynamicLink.apn || 'org.jitsi.meet';
        android.dynamicLink.appCode = android.dynamicLink.appCode || 'w2atb';
        android.dynamicLink.ibi = android.dynamicLink.ibi || 'com.atlassian.JitsiMeet.ios';
        android.dynamicLink.isi = android.dynamicLink.isi || '1165103905';
    }
}
exports._setDeeplinkingDefaults = _setDeeplinkingDefaults;
