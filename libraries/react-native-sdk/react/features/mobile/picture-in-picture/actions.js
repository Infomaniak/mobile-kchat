"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterPictureInPicture = void 0;
const react_native_1 = require("react-native");
const constants_1 = require("../../base/flags/constants");
const functions_1 = require("../../base/flags/functions");
const Platform_native_1 = __importDefault(require("../../base/react/Platform.native"));
const actionTypes_1 = require("./actionTypes");
const logger_1 = __importDefault(require("./logger"));
/**
 * Enters (or rather initiates entering) picture-in-picture.
 * Helper function to enter PiP mode. This is triggered by user request
 * (either pressing the button in the toolbox or the home button on Android)
 * and this triggers the PiP mode, iff it's available and we are in a
 * conference.
 *
 * @public
 * @returns {Function}
 */
function enterPictureInPicture() {
    return (dispatch, getState) => {
        // XXX At the time of this writing this action can only be dispatched by
        // the button which is on the conference view, which means that it's
        // fine to enter PiP mode.
        if ((0, functions_1.getFeatureFlag)(getState, constants_1.PIP_ENABLED)) {
            const { PictureInPicture } = react_native_1.NativeModules;
            const p = Platform_native_1.default.OS === 'android'
                ? PictureInPicture
                    ? PictureInPicture.enterPictureInPicture()
                    : Promise.reject(new Error('Picture-in-Picture not supported'))
                : Promise.resolve();
            p.catch((e) => logger_1.default.warn(`Error entering PiP mode: ${e}`));
            // We should still dispatch ENTER_PICTURE_IN_PICTURE for cases where
            // the external app needs to handle the event (ie. react-native-sdk)
            p.finally(() => dispatch({ type: actionTypes_1.ENTER_PICTURE_IN_PICTURE }));
        }
    };
}
exports.enterPictureInPicture = enterPictureInPicture;
