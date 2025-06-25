"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openURLInBrowser = void 0;
const react_native_1 = require("react-native");
const logger_1 = __importDefault(require("./logger"));
/**
 * Opens URL in the browser.
 *
 * @param {string} url - The URL to be opened.
 * @param {boolean} _ignore - Ignored.
 * @returns {void}
 */
function openURLInBrowser(url, _ignore) {
    react_native_1.Linking.openURL(url).catch(error => {
        logger_1.default.error(`An error occurred while trying to open ${url}`, error);
    });
}
exports.openURLInBrowser = openURLInBrowser;
