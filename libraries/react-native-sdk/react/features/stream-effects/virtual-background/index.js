"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVirtualBackgroundEffect = void 0;
const actions_1 = require("../../notifications/actions");
const constants_1 = require("../../notifications/constants");
const functions_1 = require("../../virtual-background/functions");
const logger_1 = __importDefault(require("../../virtual-background/logger"));
const JitsiStreamBackgroundEffect_1 = __importDefault(require("./JitsiStreamBackgroundEffect"));
// @ts-expect-error
const tflite_1 = __importDefault(require("./vendor/tflite/tflite"));
// @ts-expect-error
const tflite_simd_1 = __importDefault(require("./vendor/tflite/tflite-simd"));
const models = {
    modelLandscape: 'libs/selfie_segmentation_landscape.tflite'
};
/* eslint-enable lines-around-comment */
let modelBuffer;
let tflite;
let wasmCheck;
let isWasmDisabled = false;
const segmentationDimensions = {
    modelLandscape: {
        height: 144,
        width: 256
    }
};
/**
 * Creates a new instance of JitsiStreamBackgroundEffect. This loads the Meet background model that is used to
 * extract person segmentation.
 *
 * @param {Object} virtualBackground - The virtual object that contains the background image source and
 * the isVirtualBackground flag that indicates if virtual image is activated.
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {Promise<JitsiStreamBackgroundEffect>}
 */
async function createVirtualBackgroundEffect(virtualBackground, dispatch) {
    if (!MediaStreamTrack.prototype.getSettings && !MediaStreamTrack.prototype.getConstraints) {
        throw new Error('JitsiStreamBackgroundEffect not supported!');
    }
    if (isWasmDisabled) {
        dispatch?.((0, actions_1.showWarningNotification)({
            titleKey: 'virtualBackground.backgroundEffectError'
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
        return;
    }
    // Checks if WebAssembly feature is supported or enabled by/in the browser.
    // Conditional import of wasm-check package is done to prevent
    // the browser from crashing when the user opens the app.
    if (!tflite) {
        try {
            wasmCheck = require('wasm-check');
            const tfliteTimeout = 10000;
            if (wasmCheck?.feature?.simd) {
                tflite = await (0, functions_1.timeout)(tfliteTimeout, (0, tflite_simd_1.default)());
            }
            else {
                tflite = await (0, functions_1.timeout)(tfliteTimeout, (0, tflite_1.default)());
            }
        }
        catch (err) {
            if (err?.message === '408') {
                logger_1.default.error('Failed to download tflite model!');
                dispatch?.((0, actions_1.showWarningNotification)({
                    titleKey: 'virtualBackground.backgroundEffectError'
                }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
            }
            else {
                isWasmDisabled = true;
                logger_1.default.error('Looks like WebAssembly is disabled or not supported on this browser', err);
                dispatch?.((0, actions_1.showWarningNotification)({
                    titleKey: 'virtualBackground.webAssemblyWarning',
                    descriptionKey: 'virtualBackground.webAssemblyWarningDescription'
                }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
            }
            return;
        }
    }
    if (!modelBuffer) {
        const modelResponse = await fetch(models.modelLandscape);
        if (!modelResponse.ok) {
            throw new Error('Failed to download tflite model!');
        }
        modelBuffer = await modelResponse.arrayBuffer();
        tflite.HEAPU8.set(new Uint8Array(modelBuffer), tflite._getModelBufferMemoryOffset());
        tflite._loadModel(modelBuffer.byteLength);
    }
    const options = {
        ...segmentationDimensions.modelLandscape,
        virtualBackground
    };
    return new JitsiStreamBackgroundEffect_1.default(tflite, options);
}
exports.createVirtualBackgroundEffect = createVirtualBackgroundEffect;
