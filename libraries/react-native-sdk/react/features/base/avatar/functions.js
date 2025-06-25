"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIcon = exports.isCORSAvatarURL = exports.getInitials = exports.getAvatarColor = void 0;
const grapheme_splitter_1 = __importDefault(require("grapheme-splitter"));
const lodash_1 = __importDefault(require("lodash"));
const AVATAR_COLORS = [
    '#6A50D3',
    '#FF9B42',
    '#DF486F',
    '#73348C',
    '#B23683',
    '#F96E57',
    '#4380E2',
    '#238561',
    '#00A8B3'
];
const wordSplitRegex = (/\s+|\.+|_+|;+|-+|,+|\|+|\/+|\\+|"+|'+|\(+|\)+|#+|&+/);
const splitter = new grapheme_splitter_1.default();
/**
 * Generates the background color of an initials based avatar.
 *
 * @param {string?} initials - The initials of the avatar.
 * @param {Array<string>} customAvatarBackgrounds - Custom avatar background values.
 * @returns {string}
 */
function getAvatarColor(initials, customAvatarBackgrounds) {
    const hasCustomAvatarBackgronds = customAvatarBackgrounds?.length;
    const colorsBase = hasCustomAvatarBackgronds ? customAvatarBackgrounds : AVATAR_COLORS;
    let colorIndex = 0;
    if (initials) {
        let nameHash = 0;
        for (const s of initials) {
            nameHash += Number(s.codePointAt(0));
        }
        colorIndex = nameHash % colorsBase.length;
    }
    return colorsBase[colorIndex];
}
exports.getAvatarColor = getAvatarColor;
/**
 * Returns the first grapheme from a word, uppercased.
 *
 * @param {string} word - The string to get grapheme from.
 * @returns {string}
 */
function getFirstGraphemeUpper(word) {
    if (!word?.length) {
        return '';
    }
    return splitter.splitGraphemes(word)[0].toUpperCase();
}
/**
 * Generates initials for a simple string.
 *
 * @param {string?} s - The string to generate initials for.
 * @returns {string?}
 */
function getInitials(s) {
    // We don't want to use the domain part of an email address, if it is one
    const initialsBasis = lodash_1.default.split(s, '@')[0];
    const [firstWord, secondWord] = initialsBasis.split(wordSplitRegex).filter(Boolean);
    return getFirstGraphemeUpper(firstWord) + getFirstGraphemeUpper(secondWord);
}
exports.getInitials = getInitials;
/**
 * Checks if the passed URL should be loaded with CORS.
 *
 * @param {string} url - The URL.
 * @param {Array<string>} corsURLs - The URL pattern that matches a URL that needs to be handled with CORS.
 * @returns {void}
 */
function isCORSAvatarURL(url, corsURLs = []) {
    return corsURLs.some(pattern => url.startsWith(pattern));
}
exports.isCORSAvatarURL = isCORSAvatarURL;
/**
 * Checks if the passed prop is a loaded icon or not.
 *
 * @param {string? | Object?} iconProp - The prop to check.
 * @returns {boolean}
 */
function isIcon(iconProp) {
    return Boolean(iconProp) && (typeof iconProp === 'object' || typeof iconProp === 'function');
}
exports.isIcon = isIcon;
