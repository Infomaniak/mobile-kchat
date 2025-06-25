"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isScreenshotCaptureEnabled = exports.createScreenshotCaptureSummary = void 0;
const functions_1 = require("../base/redux/functions");
const functions_2 = require("../recording/functions");
const functions_3 = require("../screen-share/functions");
const ScreenshotCaptureSummary_1 = __importDefault(require("./ScreenshotCaptureSummary"));
/**
 * Creates a new instance of ScreenshotCapture.
 *
 * @param {Object | Function} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {Promise<ScreenshotCapture>}
 */
function createScreenshotCaptureSummary(stateful) {
    if (!MediaStreamTrack.prototype.getSettings && !MediaStreamTrack.prototype.getConstraints) {
        return Promise.reject(new Error('ScreenshotCaptureSummary not supported!'));
    }
    return new ScreenshotCaptureSummary_1.default((0, functions_1.toState)(stateful));
}
exports.createScreenshotCaptureSummary = createScreenshotCaptureSummary;
/**
 * Checks if the screenshot capture is enabled based on the config.
 *
 * @param {Object} state - Redux state.
 * @param {boolean} checkSharing - Whether to check if screensharing is on.
 * @param {boolean} checkRecording - Whether to check is recording is on.
 * @returns {boolean}
 */
function isScreenshotCaptureEnabled(state, checkSharing, checkRecording) {
    const { screenshotCapture } = state['features/base/config'];
    if (!screenshotCapture?.enabled) {
        return false;
    }
    if (checkSharing && !(0, functions_3.isScreenVideoShared)(state)) {
        return false;
    }
    if (checkRecording) {
        // Feature enabled always.
        if (screenshotCapture.mode === 'always') {
            return true;
        }
        // Feature enabled only when recording is also on.
        return (0, functions_2.isCloudRecordingRunning)(state);
    }
    return true;
}
exports.isScreenshotCaptureEnabled = isScreenshotCaptureEnabled;
