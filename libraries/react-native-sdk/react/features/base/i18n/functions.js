"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateToHTML = exports.translate = exports.changeLanguageBundle = void 0;
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const i18next_1 = __importDefault(require("./i18next"));
/**
 * Changes the main translation bundle.
 *
 * @param {string} language - The language e.g. 'en', 'fr'.
 * @param {string} url - The url of the translation bundle.
 * @returns {void}
 */
async function changeLanguageBundle(language, url) {
    const res = await fetch(url);
    const bundle = await res.json();
    i18next_1.default.addResourceBundle(language, 'main', bundle, true, true);
}
exports.changeLanguageBundle = changeLanguageBundle;
/**
 * Wraps a specific React Component in order to enable translations in it.
 *
 * @param {Component} component - The React Component to wrap.
 * @returns {Component} The React Component which wraps {@link component} and
 * enables translations in it.
 */
function translate(component) {
    // Use the default list of namespaces.
    return (0, react_i18next_1.withTranslation)(['main', 'languages', 'countries'])(component);
}
exports.translate = translate;
/**
 * Translates a specific key to text containing HTML via a specific translate
 * function.
 *
 * @param {Function} t - The translate function.
 * @param {string} key - The key to translate.
 * @param {Array<*>} options - The options, if any, to pass to {@link t}.
 * @returns {ReactElement} A ReactElement which depicts the translated HTML
 * text.
 */
function translateToHTML(t, key, options = {}) {
    // eslint-disable-next-line react/no-danger
    return react_1.default.createElement("span", { dangerouslySetInnerHTML: { __html: t(key, options) } });
}
exports.translateToHTML = translateToHTML;
