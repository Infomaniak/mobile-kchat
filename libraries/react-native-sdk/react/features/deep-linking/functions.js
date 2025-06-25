"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDesktopApp = exports.getDeepLinkingPage = exports.generateDeepLinkingURL = void 0;
const utils_1 = require("../base/environment/utils");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const Platform_1 = __importDefault(require("../base/react/Platform"));
const uri_1 = require("../base/util/uri");
const functions_1 = require("../jaas/functions");
const DeepLinkingDesktopPage_1 = __importDefault(require("./components/DeepLinkingDesktopPage"));
const DeepLinkingMobilePage_1 = __importDefault(require("./components/DeepLinkingMobilePage"));
const NoMobileApp_1 = __importDefault(require("./components/NoMobileApp"));
const openDesktopApp_1 = require("./openDesktopApp");
/**
 * Generates a deep linking URL based on the current window URL.
 *
 * @param {Object} state - Object containing current redux state.
 *
 * @returns {string} - The generated URL.
 */
function generateDeepLinkingURL(state) {
    // If the user installed the app while this Component was displayed
    // (e.g. the user clicked the Download the App button), then we would
    // like to open the current URL in the mobile app. The only way to do it
    // appears to be a link with an app-specific scheme, not a Universal
    // Link.
    const { href } = window.location;
    const regex = new RegExp(uri_1.URI_PROTOCOL_PATTERN, 'gi');
    // @ts-ignore
    const mobileConfig = state['features/base/config'].deeplinking?.[Platform_1.default.OS] || {};
    const { appScheme, appPackage } = mobileConfig;
    // Android: use an intent link, custom schemes don't work in all browsers.
    // https://developer.chrome.com/multidevice/android/intents
    if (Platform_1.default.OS === 'android') {
        // https://meet.jit.si/foo -> meet.jit.si/foo
        const url = href.replace(regex, '').substr(2);
        return `intent://${url}#Intent;scheme=${appScheme};package=${appPackage};end`;
    }
    // iOS: Replace the protocol part with the app scheme.
    return href.replace(regex, `${appScheme}:`);
}
exports.generateDeepLinkingURL = generateDeepLinkingURL;
/**
 * Resolves with the component that should be displayed if the deep linking page
 * should be shown and with <tt>undefined</tt> otherwise.
 *
 * @param {Object} state - Object containing current redux state.
 * @returns {Promise<Component>}
 */
function getDeepLinkingPage(state) {
    const { room } = state['features/base/conference'];
    const { launchInWeb } = state['features/deep-linking'];
    const deeplinking = state['features/base/config'].deeplinking || {};
    // @ts-ignore
    const { appScheme } = deeplinking?.[Platform_1.default.OS] || {};
    // Show only if we are about to join a conference.
    if (launchInWeb
        || !room
        || state['features/base/config'].deeplinking?.disabled
        || lib_jitsi_meet_1.browser.isElectron()
        || ((0, functions_1.isVpaasMeeting)(state) && (!appScheme || appScheme === 'com.8x8.meet'))) {
        return Promise.resolve();
    }
    if ((0, utils_1.isMobileBrowser)()) { // mobile
        const mobileAppPromo = typeof interfaceConfig === 'object'
            && interfaceConfig.MOBILE_APP_PROMO;
        return Promise.resolve(typeof mobileAppPromo === 'undefined' || Boolean(mobileAppPromo)
            ? DeepLinkingMobilePage_1.default : NoMobileApp_1.default);
    }
    return (0, openDesktopApp_1._openDesktopApp)(state).then(
    // eslint-disable-next-line no-confusing-arrow
    result => result ? DeepLinkingDesktopPage_1.default : undefined);
}
exports.getDeepLinkingPage = getDeepLinkingPage;
/**
 * Opens the desktop app.
 *
 * @param {Object} state - Object containing current redux state.
 * @returns {Promise<boolean>} - Resolves with true if the attempt to open the desktop app was successful and resolves
 * with false otherwise.
 */
function openDesktopApp(state) {
    return (0, openDesktopApp_1._openDesktopApp)(state);
}
exports.openDesktopApp = openDesktopApp;
