"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPictureInPictureEnabled = void 0;
const react_native_1 = require("react-native");
/**
 * Enabled/Disables the PictureInPicture mode in PiP native module.
 *
 * @param {boolean} enabled - Whether the PiP mode should be enabled.
 * @returns {void}
 */
function setPictureInPictureEnabled(enabled) {
    const { PictureInPicture } = react_native_1.NativeModules;
    if (PictureInPicture) {
        PictureInPicture.setPictureInPictureEnabled(enabled);
    }
}
exports.setPictureInPictureEnabled = setPictureInPictureEnabled;
