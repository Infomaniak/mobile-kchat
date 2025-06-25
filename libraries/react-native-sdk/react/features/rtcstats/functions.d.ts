import { IStateful } from '../base/app/types';
/**
 * Checks whether rtcstats is enabled or not.
 *
 * @param {IStateful} stateful - The redux store or {@code getState} function.
 * @returns {boolean}
 */
export declare function isRTCStatsEnabled(stateful: IStateful): boolean;
/**
 * Checks if the faceLandmarks data can be sent to the rtcstats server.
 *
 * @param {IStateful} stateful - The redux store or {@code getState} function.
 * @returns {boolean}
 */
export declare function canSendFaceLandmarksRTCStatsData(stateful: IStateful): boolean;
