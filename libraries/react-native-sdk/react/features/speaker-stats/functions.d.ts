import { IReduxState } from '../app/types';
import { FaceLandmarks } from '../face-landmarks/types';
import { ISpeakerStats } from './reducer';
/**
 * Checks if the speaker stats search is disabled.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - True if the speaker stats search is disabled and false otherwise.
 */
export declare function isSpeakerStatsSearchDisabled(state: IReduxState): boolean | undefined;
/**
 * Checks if the speaker stats is disabled.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - True if the speaker stats search is disabled and false otherwise.
 */
export declare function isSpeakerStatsDisabled(state: IReduxState): boolean | undefined;
/**
 * Gets whether participants in speaker stats should be ordered or not, and with what priority.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {Array<string>} - The speaker stats order array or an empty array.
 */
export declare function getSpeakerStatsOrder(state: IReduxState): ("role" | "name" | "hasLeft")[];
/**
 * Gets speaker stats.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {Object} - The speaker stats.
 */
export declare function getSpeakerStats(state: IReduxState): ISpeakerStats;
/**
 * Gets speaker stats search criteria.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {string | null} - The search criteria.
 */
export declare function getSearchCriteria(state: IReduxState): string | null;
/**
 * Gets if speaker stats reorder is pending.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - The pending reorder flag.
 */
export declare function getPendingReorder(state: IReduxState): boolean;
/**
 * Get sorted speaker stats ids based on a configuration setting.
 *
 * @param {IState} state - The redux state.
 * @param {IState} stats - The current speaker stats.
 * @returns {string[] | undefined} - Ordered speaker stats ids.
 * @public
 */
export declare function getSortedSpeakerStatsIds(state: IReduxState, stats: ISpeakerStats): string[] | undefined;
/**
 * Filter stats by search criteria.
 *
 * @param {IState} state - The redux state.
 * @param {ISpeakerStats | undefined} stats - The unfiltered stats.
 *
 * @returns {ISpeakerStats} - Filtered speaker stats.
 * @public
 */
export declare function filterBySearchCriteria(state: IReduxState, stats?: ISpeakerStats): ISpeakerStats;
/**
 * Reset the hidden speaker stats.
 *
 * @param {IState} state - The redux state.
 * @param {ISpeakerStats | undefined} stats - The unfiltered stats.
 *
 * @returns {Object} - Speaker stats.
 * @public
 */
export declare function resetHiddenStats(state: IReduxState, stats?: ISpeakerStats): ISpeakerStats;
/**
 * Gets the current duration of the conference.
 *
 * @param {IState} state - The redux state.
 * @returns {number | null} - The duration in milliseconds or null.
 */
export declare function getCurrentDuration(state: IReduxState): number | null;
/**
 * Gets the boundaries of the emotion timeline.
 *
 * @param {IState} state - The redux state.
 * @returns {Object} - The left and right boundaries.
 */
export declare function getTimelineBoundaries(state: IReduxState): {
    left: number;
    right: number;
};
/**
 * Returns the conference start time of the face landmarks.
 *
 * @param {FaceLandmarks} faceLandmarks - The face landmarks.
 * @param {number} startTimestamp - The start timestamp of the conference.
 * @returns {number}
 */
export declare function getFaceLandmarksStart(faceLandmarks: FaceLandmarks, startTimestamp: number): number;
/**
 * Returns the conference end time of the face landmarks.
 *
 * @param {FaceLandmarks} faceLandmarks - The face landmarks.
 * @param {number} startTimestamp - The start timestamp of the conference.
 * @returns {number}
 */
export declare function getFaceLandmarksEnd(faceLandmarks: FaceLandmarks, startTimestamp: number): number;
