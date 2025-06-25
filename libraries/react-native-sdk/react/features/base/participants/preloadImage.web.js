"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preloadImage = void 0;
const functions_1 = require("./functions");
/**
 * Tries to preload an image.
 *
 * @param {string | Object} src - Source of the avatar.
 * @param {boolean} useCORS - Whether to use CORS or not.
 * @param {boolean} tryOnce - If true we try to load the image only using the specified CORS mode. Otherwise both modes
 * (CORS and no CORS) will be used to load the image if the first attempt fails.
 * @returns {Promise}
 */
function preloadImage(src, useCORS = false, tryOnce = false) {
    if ((0, functions_1.isIconUrl)(src)) {
        return Promise.resolve({ src });
    }
    return new Promise((resolve, reject) => {
        const image = document.createElement('img');
        if (useCORS) {
            image.setAttribute('crossOrigin', '');
        }
        image.onload = () => resolve({
            src,
            isUsingCORS: useCORS
        });
        image.onerror = error => {
            if (tryOnce) {
                reject(error);
            }
            else {
                preloadImage(src, !useCORS, true)
                    .then(resolve)
                    .catch(reject);
            }
        };
        image.referrerPolicy = 'no-referrer';
        image.src = src;
    });
}
exports.preloadImage = preloadImage;
