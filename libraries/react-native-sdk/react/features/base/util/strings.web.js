"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAccents = exports.normalizeNFKC = void 0;
/**
 * Applies NFKC normalization to the given text.
 *
 * @param {string} text - The text that needs to be normalized.
 * @returns {string} - The normalized text.
 */
function normalizeNFKC(text) {
    return text.normalize('NFKC');
}
exports.normalizeNFKC = normalizeNFKC;
/**
 * Replaces accent characters with english alphabet characters.
 * NOTE: Here we use the unorm package because the JSC version in React Native for Android crashes.
 *
 * @param {string} text - The text that needs to be normalized.
 * @returns {string} - The normalized text.
 */
function normalizeAccents(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
exports.normalizeAccents = normalizeAccents;
