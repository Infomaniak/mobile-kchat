import { IStore } from '../app/types';
import { ISpeakerStats } from './reducer';
/**
 * Starts a search by criteria.
 *
 * @param {string} criteria - The search criteria.
 * @returns {Object}
 */
export declare function initSearch(criteria: string): {
    type: string;
    criteria: string;
};
/**
 * Gets the new stats and triggers update.
 *
 * @param {Function} getSpeakerStats - Function to get the speaker stats.
 * @returns {Object}
 */
export declare function initUpdateStats(getSpeakerStats: () => ISpeakerStats): {
    type: string;
    getSpeakerStats: () => ISpeakerStats;
};
/**
 * Updates the stats with new stats.
 *
 * @param {Object} stats - The new stats.
 * @returns {Object}
 */
export declare function updateStats(stats: Object): {
    type: string;
    stats: Object;
};
/**
 * Updates the speaker stats order.
 *
 * @param {Array<string>} participantIds - Participant ids.
 * @returns {Object}
 */
export declare function updateSortedSpeakerStatsIds(participantIds: Array<string>): {
    type: string;
    participantIds: string[];
};
/**
 * Initiates reordering of the stats.
 *
 * @returns {Object}
 */
export declare function initReorderStats(): {
    type: string;
};
/**
 * Resets the search criteria.
 *
 * @returns {Object}
 */
export declare function resetSearchCriteria(): {
    type: string;
};
/**
 * Toggles the face expressions grid.
 *
 * @returns {Object}
 */
export declare function toggleFaceExpressions(): {
    type: string;
};
/**
 * Adds a value to the boundary offset of the timeline.
 *
 * @param {number} value - The value to be added.
 * @param {number} left - The left boundary.
 * @param {number} right - The right boundary.
 * @param {number} currentDuration - The currentDuration of the conference.
 * @returns {Object}
 */
export declare function addToOffset(value: number): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Adds the value to the offset of the left boundary for the timeline.
 *
 * @param {number} value - The new value for the offset.
 * @returns {Object}
 */
export declare function addToOffsetLeft(value: number): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Adds the value to the offset of the right boundary for the timeline.
 *
 * @param {number} value - The new value for the offset.
 * @returns {Object}
 */
export declare function addToOffsetRight(value: number): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sets the current time boundary of the timeline, when zoomed in.
 *
 * @param {number} boundary - The current time boundary.
 * @returns {Object}
 */
export declare function setTimelineBoundary(boundary: number): {
    type: string;
    boundary: number;
};
/**
 * Clears the current time boundary of the timeline, when zoomed out full.
 *
 * @returns {Object}
 */
export declare function clearTimelineBoundary(): {
    type: string;
    boundary: null;
};
/**
 * Sets the state of the timeline panning.
 *
 * @param {Object} panning - The state of the timeline panning.
 * @returns {Object}
 */
export declare function setTimelinePanning(panning: {
    active: boolean;
    x: number;
}): {
    type: string;
    panning: {
        active: boolean;
        x: number;
    };
};
