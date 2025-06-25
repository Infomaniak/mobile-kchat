"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeout = exports.resizeImage = exports.toDataURL = exports.blobToData = exports.checkVirtualBackgroundEnabled = exports.checkBlurSupport = void 0;
let filterSupport;
/**
 * Checks context filter support.
 *
 * @returns {boolean} True if the filter is supported and false if the filter is not supported by the browser.
 */
function checkBlurSupport() {
    if (typeof filterSupport === 'undefined') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        filterSupport = typeof ctx?.filter !== 'undefined';
        canvas.remove();
    }
    return filterSupport;
}
exports.checkBlurSupport = checkBlurSupport;
/**
 * Checks if virtual background is enabled.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean} True if virtual background is enabled and false if virtual background is disabled.
 */
function checkVirtualBackgroundEnabled(state) {
    return state['features/base/config'].disableVirtualBackground !== true;
}
exports.checkVirtualBackgroundEnabled = checkVirtualBackgroundEnabled;
/**
 * Convert blob to base64.
 *
 * @param {Blob} blob - The link to add info with.
 * @returns {Promise<string>}
 */
const blobToData = (blob) => new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result?.toString());
    reader.readAsDataURL(blob);
});
exports.blobToData = blobToData;
/**
 * Convert blob to base64.
 *
 * @param {string} url - The image url.
 * @returns {Object} - Returns the converted blob to base64.
 */
const toDataURL = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const resData = await (0, exports.blobToData)(blob);
    return resData;
};
exports.toDataURL = toDataURL;
/**
 * Resize image and adjust original aspect ratio.
 *
 * @param {Object} base64image - Base64 image extraction.
 * @param {number} width - Value for resizing the image width.
 * @param {number} height - Value for resizing the image height.
 * @returns {Promise<string>}
 */
function resizeImage(base64image, width = 1920, height = 1080) {
    // In order to work on Firefox browser we need to handle the asynchronous nature of image loading;  We need to use
    // a promise mechanism. The reason why it 'works' without this mechanism in Chrome is actually 'by accident' because
    // the image happens to be in the cache and the browser is able to deliver the uncompressed/decoded image
    // before using the image in the drawImage call.
    return new Promise(resolve => {
        const img = document.createElement('img');
        img.onload = function () {
            // Create an off-screen canvas.
            const canvas = document.createElement('canvas');
            // Set its dimension to target size.
            const context = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            // Draw source image into the off-screen canvas.
            // TODO: keep aspect ratio and implement object-fit: cover.
            context?.drawImage(img, 0, 0, width, height);
            // Encode image to data-uri with base64 version of compressed image.
            resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
        img.src = base64image;
    });
}
exports.resizeImage = resizeImage;
/**
 * Creating a wrapper for promises on a specific time interval.
 *
 * @param {number} milliseconds - The number of milliseconds to wait the specified
 * {@code promise} to settle before automatically rejecting the returned
 * {@code Promise}.
 * @param {Promise} promise - The {@code Promise} for which automatic rejecting
 * after the specified timeout is to be implemented.
 * @returns {Promise}
 */
function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('408'));
            return;
        }, milliseconds);
        promise.then(resolve, reject);
    });
}
exports.timeout = timeout;
