"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleScreenshotCaptureSummary = void 0;
const functions_1 = require("../base/tracks/functions");
const actionTypes_1 = require("./actionTypes");
const functions_2 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
let screenshotSummary;
/**
 * Marks the on-off state of screenshot captures.
 *
 * @param {boolean} enabled - Whether to turn screen captures on or off.
 * @returns {{
    *      type: START_SCREENSHOT_CAPTURE,
    *      payload: enabled
    * }}
*/
function setScreenshotCapture(enabled) {
    return {
        type: actionTypes_1.SET_SCREENSHOT_CAPTURE,
        payload: enabled
    };
}
/**
* Action that toggles the screenshot captures.
*
* @param {boolean} enabled - Bool that represents the intention to start/stop screenshot captures.
* @returns {Promise}
*/
function toggleScreenshotCaptureSummary(enabled) {
    return async function (dispatch, getState) {
        const state = getState();
        if (state['features/screenshot-capture'].capturesEnabled !== enabled) {
            if (!screenshotSummary) {
                try {
                    screenshotSummary = await (0, functions_2.createScreenshotCaptureSummary)(state);
                }
                catch (err) {
                    logger_1.default.error('Cannot create screenshotCaptureSummary', err);
                }
            }
            if (enabled) {
                try {
                    const jitsiTrack = (0, functions_1.getLocalJitsiDesktopTrack)(state);
                    await screenshotSummary.start(jitsiTrack);
                    dispatch(setScreenshotCapture(enabled));
                }
                catch {
                    // Handle promise rejection from {@code start} due to stream type not being desktop.
                    logger_1.default.error('Unsupported stream type.');
                }
            }
            else {
                screenshotSummary.stop();
                dispatch(setScreenshotCapture(enabled));
            }
        }
        return Promise.resolve();
    };
}
exports.toggleScreenshotCaptureSummary = toggleScreenshotCaptureSummary;
