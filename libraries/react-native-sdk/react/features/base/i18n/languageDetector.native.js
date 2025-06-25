"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const languages_json_1 = __importDefault(require("../../../../lang/languages.json"));
const LANGUAGES = Object.keys(languages_json_1.default);
/**
 * The singleton language detector for React Native which uses the system-wide
 * locale.
 */
exports.default = {
    /**
     * Does not support caching.
     *
     * @returns {void}
     */
    cacheUserLanguage: Function.prototype,
    detect() {
        const { LocaleDetector } = react_native_1.NativeModules;
        const parts = LocaleDetector.locale.replace(/_/, '-').split('-');
        const [lang, regionOrScript, region] = parts;
        let locale;
        if (parts.length >= 3) {
            locale = `${lang}${region}`;
        }
        else if (parts.length === 2) {
            locale = `${lang}${regionOrScript}`;
        }
        else {
            locale = lang;
        }
        if (LANGUAGES.includes(locale)) {
            return locale;
        }
        return lang;
    },
    init: Function.prototype,
    type: 'languageDetector'
};
