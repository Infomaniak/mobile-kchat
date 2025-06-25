"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSoundsPath = void 0;
const functions_native_1 = require("../../app/functions.native");
/**
 * Returns the location of the sounds. On iOS it's the location of the SDK
 * bundle on the phone. Each sound file must be added to the SDK's XCode project
 * in order to be bundled correctly.
 *
 * @returns {string}
 */
function getSoundsPath() {
    return (0, functions_native_1.getSdkBundlePath)();
}
exports.getSoundsPath = getSoundsPath;
