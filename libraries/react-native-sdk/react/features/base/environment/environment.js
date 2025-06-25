"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupportedMobileBrowser = exports.isSupportedBrowser = exports.isSuboptimalBrowser = exports.isWindows = exports.isMacOS = exports.isBrowsersOptimal = void 0;
const lib_jitsi_meet_1 = __importDefault(require("../lib-jitsi-meet"));
const Platform_1 = __importDefault(require("../react/Platform"));
const utils_1 = require("./utils");
const { browser } = lib_jitsi_meet_1.default.util;
const DEFAULT_OPTIMAL_BROWSERS = [
    'chrome',
    'chromium',
    'electron',
    'firefox',
    'safari',
    'webkit'
];
const DEFAULT_UNSUPPORTED_BROWSERS = [];
const browserNameToCheck = {
    chrome: browser.isChrome.bind(browser),
    chromium: browser.isChromiumBased.bind(browser),
    electron: browser.isElectron.bind(browser),
    firefox: browser.isFirefox.bind(browser),
    safari: browser.isSafari.bind(browser),
    webkit: browser.isWebKitBased.bind(browser)
};
/**
 * Returns whether or not jitsi is optimized and targeted for the  provided
 * browser name.
 *
 * @param {string} browserName - The name of the browser to check.
 * @returns {boolean}
 */
function isBrowsersOptimal(browserName) {
    return (interfaceConfig.OPTIMAL_BROWSERS || DEFAULT_OPTIMAL_BROWSERS)
        .includes(browserName);
}
exports.isBrowsersOptimal = isBrowsersOptimal;
/**
 * Returns whether or not the current OS is Mac.
 *
 * @returns {boolean}
 */
function isMacOS() {
    return Platform_1.default.OS === 'macos';
}
exports.isMacOS = isMacOS;
/**
 * Returns whether or not the current OS is Windows.
 *
 * @returns {boolean}
 */
function isWindows() {
    return Platform_1.default.OS === 'windows';
}
exports.isWindows = isWindows;
/**
 * Returns whether or not the current browser or the list of passed in browsers
 * is considered suboptimal. Suboptimal means it is a supported browser but has
 * not been explicitly listed as being optimal, possibly due to functionality
 * issues.
 *
 * @param {Array<string>} [browsers] - A list of browser names to check. Will
 * default to a whitelist.
 * @returns {boolean}
 */
function isSuboptimalBrowser() {
    const optimalBrowsers = interfaceConfig.OPTIMAL_BROWSERS || DEFAULT_OPTIMAL_BROWSERS;
    return !_isCurrentBrowserInList(optimalBrowsers) && isSupportedBrowser();
}
exports.isSuboptimalBrowser = isSuboptimalBrowser;
/**
 * Returns whether or not the current browser should allow the app to display.
 * A supported browser is assumed to be able to support WebRtc.
 *
 * @returns {boolean}
 */
function isSupportedBrowser() {
    if (navigator.product === 'ReactNative') {
        return false;
    }
    // Blacklists apply to desktop browsers only right now.
    if (!(0, utils_1.isMobileBrowser)() && _isCurrentBrowserInList(interfaceConfig.UNSUPPORTED_BROWSERS || DEFAULT_UNSUPPORTED_BROWSERS)) {
        return false;
    }
    return (0, utils_1.isMobileBrowser)() ? isSupportedMobileBrowser() : lib_jitsi_meet_1.default.isWebRtcSupported();
}
exports.isSupportedBrowser = isSupportedBrowser;
/**
 * Returns whether or not the current environment is a supported
 * browser on a mobile device.
 *
 * @returns {boolean}
 */
function isSupportedMobileBrowser() {
    return (Platform_1.default.OS === 'android' && browser.isSupportedAndroidBrowser())
        || (Platform_1.default.OS === 'ios' && browser.isSupportedIOSBrowser());
}
exports.isSupportedMobileBrowser = isSupportedMobileBrowser;
/**
 * Runs various browser checks to know if the current browser is found within
 * the list.
 *
 * @param {Array<string>} list - Browser names to check. The names should be
 * keys in {@link browserNameToCheck}.
 * @private
 * @returns {boolean}
 */
function _isCurrentBrowserInList(list) {
    return Boolean(list.find(browserName => {
        const checkFunction = browserNameToCheck[browserName];
        return checkFunction ? checkFunction.call(browser) : false;
    }));
}
