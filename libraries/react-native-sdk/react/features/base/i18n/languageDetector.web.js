"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_browser_languagedetector_1 = __importDefault(require("i18next-browser-languagedetector"));
const configLanguageDetector_1 = __importDefault(require("./configLanguageDetector"));
const customNavigatorDetector_1 = __importDefault(require("./customNavigatorDetector"));
/**
 * The ordered list (by name) of language detectors to be utilized as backends
 * by the singleton language detector for Web.
 *
 * @type {Array<string>}
 */
const order = [
    'querystring',
    'localStorage'
];
// Allow i18next to detect the system language reported by the Web browser
// itself.
interfaceConfig.LANG_DETECTION && order.push(customNavigatorDetector_1.default.name);
// Default use configured language
order.push(configLanguageDetector_1.default.name);
/**
 * The singleton language detector for Web.
 */
const languageDetector = new i18next_browser_languagedetector_1.default(
/* services */ null, 
/* options */ {
    caches: ['localStorage'],
    lookupLocalStorage: 'language',
    lookupQuerystring: 'lang',
    order
});
// Add the language detector which looks the language up in the config. Its
// order has already been established above.
// @ts-ignore
languageDetector.addDetector(customNavigatorDetector_1.default);
// @ts-ignore
languageDetector.addDetector(configLanguageDetector_1.default);
exports.default = languageDetector;
