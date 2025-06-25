"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preloadImage = void 0;
const react_native_1 = require("react-native");
const functions_1 = require("./functions");
/**
 * Tries to preload an image.
 *
 * @param {string | Object} src - Source of the avatar.
 * @param {boolean} _isUsingCORS - Used on web.
 * @returns {Promise}
 */
function preloadImage(src, _isUsingCORS) {
    if ((0, functions_1.isIconUrl)(src)) {
        return Promise.resolve(src);
    }
    return new Promise((resolve, reject) => {
        // @ts-ignore
        react_native_1.Image.prefetch(src).then(() => resolve({
            src,
            isUsingCORS: false
        }), reject);
    });
}
exports.preloadImage = preloadImage;
