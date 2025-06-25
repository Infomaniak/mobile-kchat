"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pixelmatch_1 = __importDefault(require("pixelmatch"));
const constants_1 = require("./constants");
let timer;
const canvas = new OffscreenCanvas(0, 0);
const ctx = canvas.getContext('2d');
let storedImageData;
/**
 * Sends Blob with the screenshot to main thread.
 *
  * @param {ImageData} imageData - The image of the screenshot.
 * @returns {void}
 */
async function sendBlob(imageData) {
    let imageBlob = await canvas.convertToBlob({ type: 'image/jpeg' });
    if (imageBlob.size > constants_1.MAX_FILE_SIZE) {
        const quality = Number((constants_1.MAX_FILE_SIZE / imageBlob.size).toFixed(2)) * 0.92;
        imageBlob = await canvas.convertToBlob({ type: 'image/jpeg',
            quality });
    }
    storedImageData = imageData;
    postMessage({
        id: constants_1.TIMEOUT_TICK,
        imageBlob
    });
}
/**
 * Sends empty message to main thread.
 *
 * @returns {void}
 */
function sendEmpty() {
    postMessage({
        id: constants_1.TIMEOUT_TICK
    });
}
/**
 * Draws the image bitmap on the canvas and checks the difference percent with the previous image
 * if there is no previous image the percentage is not calculated.
 *
 * @param {ImageBitmap} imageBitmap - The image bitmap that is drawn on canvas.
 * @returns {void}
 */
function checkScreenshot(imageBitmap) {
    const { height, width } = imageBitmap;
    if (canvas.width !== width) {
        canvas.width = width;
    }
    if (canvas.height !== height) {
        canvas.height = height;
    }
    ctx?.drawImage(imageBitmap, 0, 0, width, height);
    const imageData = ctx?.getImageData(0, 0, width, height);
    imageBitmap.close();
    if (!imageData) {
        sendEmpty();
        return;
    }
    if (!storedImageData || imageData.data.length !== storedImageData.data.length) {
        sendBlob(imageData);
        return;
    }
    let numOfPixels = 0;
    try {
        numOfPixels = (0, pixelmatch_1.default)(imageData.data, storedImageData.data, null, width, height);
    }
    catch {
        sendEmpty();
        return;
    }
    const percent = numOfPixels / imageData.data.length * 100;
    if (percent >= constants_1.PERCENTAGE_LOWER_BOUND) {
        sendBlob(imageData);
    }
    else {
        sendEmpty();
    }
}
onmessage = function (request) {
    switch (request.data.id) {
        case constants_1.SET_TIMEOUT: {
            timer = setTimeout(async () => {
                const imageBitmap = request.data.imageBitmap;
                if (imageBitmap) {
                    checkScreenshot(imageBitmap);
                }
                else {
                    sendEmpty();
                }
            }, request.data.timeMs);
            break;
        }
        case constants_1.CLEAR_TIMEOUT: {
            if (timer) {
                clearTimeout(timer);
            }
            break;
        }
    }
};
