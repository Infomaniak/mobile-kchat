"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setScreenshareFramerate = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Updates the capture frame rate for screenshare in redux.
 *
 * @param {number} captureFrameRate - The frame rate to be used for screenshare.
 * @returns {{
 *      type: SET_SCREENSHARE_CAPTURE_FRAME_RATE,
 *      captureFrameRate: number
 * }}
 */
function setScreenshareFramerate(captureFrameRate) {
    return {
        type: actionTypes_1.SET_SCREENSHARE_CAPTURE_FRAME_RATE,
        captureFrameRate
    };
}
exports.setScreenshareFramerate = setScreenshareFramerate;
