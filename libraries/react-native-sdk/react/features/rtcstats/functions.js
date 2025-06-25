"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canSendFaceLandmarksRTCStatsData = exports.isRTCStatsEnabled = void 0;
const functions_1 = require("../base/redux/functions");
/**
 * Checks whether rtcstats is enabled or not.
 *
 * @param {IStateful} stateful - The redux store or {@code getState} function.
 * @returns {boolean}
 */
function isRTCStatsEnabled(stateful) {
    const state = (0, functions_1.toState)(stateful);
    const { analytics } = state['features/base/config'];
    return analytics?.rtcstatsEnabled ?? false;
}
exports.isRTCStatsEnabled = isRTCStatsEnabled;
/**
 * Checks if the faceLandmarks data can be sent to the rtcstats server.
 *
 * @param {IStateful} stateful - The redux store or {@code getState} function.
 * @returns {boolean}
 */
function canSendFaceLandmarksRTCStatsData(stateful) {
    const state = (0, functions_1.toState)(stateful);
    const { faceLandmarks } = state['features/base/config'];
    return Boolean(faceLandmarks?.enableRTCStats && isRTCStatsEnabled(state));
}
exports.canSendFaceLandmarksRTCStatsData = canSendFaceLandmarksRTCStatsData;
