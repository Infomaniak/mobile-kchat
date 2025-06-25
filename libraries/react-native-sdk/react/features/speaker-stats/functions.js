"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFaceLandmarksEnd = exports.getFaceLandmarksStart = exports.getTimelineBoundaries = exports.getCurrentDuration = exports.resetHiddenStats = exports.filterBySearchCriteria = exports.getSortedSpeakerStatsIds = exports.getPendingReorder = exports.getSearchCriteria = exports.getSpeakerStats = exports.getSpeakerStatsOrder = exports.isSpeakerStatsDisabled = exports.isSpeakerStatsSearchDisabled = void 0;
const lodash_1 = __importDefault(require("lodash"));
const functions_1 = require("../base/conference/functions");
const constants_1 = require("../base/participants/constants");
const functions_2 = require("../base/participants/functions");
const constants_2 = require("./constants");
/**
 * Checks if the speaker stats search is disabled.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - True if the speaker stats search is disabled and false otherwise.
 */
function isSpeakerStatsSearchDisabled(state) {
    return state['features/base/config']?.speakerStats?.disableSearch;
}
exports.isSpeakerStatsSearchDisabled = isSpeakerStatsSearchDisabled;
/**
 * Checks if the speaker stats is disabled.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - True if the speaker stats search is disabled and false otherwise.
 */
function isSpeakerStatsDisabled(state) {
    return state['features/base/config']?.speakerStats?.disabled;
}
exports.isSpeakerStatsDisabled = isSpeakerStatsDisabled;
/**
 * Gets whether participants in speaker stats should be ordered or not, and with what priority.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {Array<string>} - The speaker stats order array or an empty array.
 */
function getSpeakerStatsOrder(state) {
    return state['features/base/config']?.speakerStats?.order ?? [
        'role',
        'name',
        'hasLeft'
    ];
}
exports.getSpeakerStatsOrder = getSpeakerStatsOrder;
/**
 * Gets speaker stats.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {Object} - The speaker stats.
 */
function getSpeakerStats(state) {
    return state['features/speaker-stats']?.stats ?? {};
}
exports.getSpeakerStats = getSpeakerStats;
/**
 * Gets speaker stats search criteria.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {string | null} - The search criteria.
 */
function getSearchCriteria(state) {
    return state['features/speaker-stats']?.criteria;
}
exports.getSearchCriteria = getSearchCriteria;
/**
 * Gets if speaker stats reorder is pending.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - The pending reorder flag.
 */
function getPendingReorder(state) {
    return state['features/speaker-stats']?.pendingReorder ?? false;
}
exports.getPendingReorder = getPendingReorder;
/**
 * Get sorted speaker stats ids based on a configuration setting.
 *
 * @param {IState} state - The redux state.
 * @param {IState} stats - The current speaker stats.
 * @returns {string[] | undefined} - Ordered speaker stats ids.
 * @public
 */
function getSortedSpeakerStatsIds(state, stats) {
    const orderConfig = getSpeakerStatsOrder(state);
    if (orderConfig) {
        const enhancedStats = getEnhancedStatsForOrdering(state, stats, orderConfig);
        return Object.entries(enhancedStats)
            .sort(([, a], [, b]) => compareFn(a, b))
            .map(el => el[0]);
    }
    /**
     *
     * Compares the order of two participants in the speaker stats list.
     *
     * @param {ISpeaker} currentParticipant - The first participant for comparison.
     * @param {ISpeaker} nextParticipant - The second participant for comparison.
     * @returns {number} - The sort order of the two participants.
     */
    function compareFn(currentParticipant, nextParticipant) {
        if (orderConfig.includes('hasLeft')) {
            if (nextParticipant.hasLeft() && !currentParticipant.hasLeft()) {
                return -1;
            }
            else if (currentParticipant.hasLeft() && !nextParticipant.hasLeft()) {
                return 1;
            }
        }
        let result = 0;
        for (const sortCriteria of orderConfig) {
            switch (sortCriteria) {
                case 'role':
                    if (!nextParticipant.isModerator && currentParticipant.isModerator) {
                        result = -1;
                    }
                    else if (!currentParticipant.isModerator && nextParticipant.isModerator) {
                        result = 1;
                    }
                    else {
                        result = 0;
                    }
                    break;
                case 'name':
                    result = (currentParticipant.displayName || '').localeCompare(nextParticipant.displayName || '');
                    break;
            }
            if (result !== 0) {
                break;
            }
        }
        return result;
    }
}
exports.getSortedSpeakerStatsIds = getSortedSpeakerStatsIds;
/**
 * Enhance speaker stats to include data needed for ordering.
 *
 * @param {IState} state - The redux state.
 * @param {ISpeakerStats} stats - Speaker stats.
 * @param {Array<string>} orderConfig - Ordering configuration.
 * @returns {ISpeakerStats} - Enhanced speaker stats.
 * @public
 */
function getEnhancedStatsForOrdering(state, stats, orderConfig) {
    if (!orderConfig) {
        return stats;
    }
    for (const id in stats) {
        if (stats[id].hasOwnProperty('_hasLeft') && !stats[id].hasLeft()) {
            if (orderConfig.includes('role')) {
                const participant = (0, functions_2.getParticipantById)(state, stats[id].getUserId());
                stats[id].isModerator = participant && participant.role === constants_1.PARTICIPANT_ROLE.MODERATOR;
            }
        }
    }
    return stats;
}
/**
 * Filter stats by search criteria.
 *
 * @param {IState} state - The redux state.
 * @param {ISpeakerStats | undefined} stats - The unfiltered stats.
 *
 * @returns {ISpeakerStats} - Filtered speaker stats.
 * @public
 */
function filterBySearchCriteria(state, stats) {
    const filteredStats = lodash_1.default.cloneDeep(stats ?? getSpeakerStats(state));
    const criteria = getSearchCriteria(state);
    if (criteria !== null) {
        const searchRegex = new RegExp(criteria, 'gi');
        for (const id in filteredStats) {
            if (filteredStats[id].hasOwnProperty('_isLocalStats')) {
                const name = filteredStats[id].getDisplayName();
                filteredStats[id].hidden = !name?.match(searchRegex);
            }
        }
    }
    return filteredStats;
}
exports.filterBySearchCriteria = filterBySearchCriteria;
/**
 * Reset the hidden speaker stats.
 *
 * @param {IState} state - The redux state.
 * @param {ISpeakerStats | undefined} stats - The unfiltered stats.
 *
 * @returns {Object} - Speaker stats.
 * @public
 */
function resetHiddenStats(state, stats) {
    const resetStats = lodash_1.default.cloneDeep(stats ?? getSpeakerStats(state));
    for (const id in resetStats) {
        if (resetStats[id].hidden) {
            resetStats[id].hidden = false;
        }
    }
    return resetStats;
}
exports.resetHiddenStats = resetHiddenStats;
/**
 * Gets the current duration of the conference.
 *
 * @param {IState} state - The redux state.
 * @returns {number | null} - The duration in milliseconds or null.
 */
function getCurrentDuration(state) {
    const startTimestamp = (0, functions_1.getConferenceTimestamp)(state);
    return startTimestamp ? Date.now() - startTimestamp : null;
}
exports.getCurrentDuration = getCurrentDuration;
/**
 * Gets the boundaries of the emotion timeline.
 *
 * @param {IState} state - The redux state.
 * @returns {Object} - The left and right boundaries.
 */
function getTimelineBoundaries(state) {
    const { timelineBoundary, offsetLeft, offsetRight } = state['features/speaker-stats'];
    const currentDuration = getCurrentDuration(state) ?? 0;
    const rightBoundary = timelineBoundary ? timelineBoundary : currentDuration;
    let leftOffset = 0;
    if (rightBoundary > constants_2.THRESHOLD_FIXED_AXIS) {
        leftOffset = rightBoundary - constants_2.THRESHOLD_FIXED_AXIS;
    }
    const left = offsetLeft + leftOffset;
    const right = rightBoundary + offsetRight;
    return {
        left,
        right
    };
}
exports.getTimelineBoundaries = getTimelineBoundaries;
/**
 * Returns the conference start time of the face landmarks.
 *
 * @param {FaceLandmarks} faceLandmarks - The face landmarks.
 * @param {number} startTimestamp - The start timestamp of the conference.
 * @returns {number}
 */
function getFaceLandmarksStart(faceLandmarks, startTimestamp) {
    return faceLandmarks.timestamp - startTimestamp;
}
exports.getFaceLandmarksStart = getFaceLandmarksStart;
/**
 * Returns the conference end time of the face landmarks.
 *
 * @param {FaceLandmarks} faceLandmarks - The face landmarks.
 * @param {number} startTimestamp - The start timestamp of the conference.
 * @returns {number}
 */
function getFaceLandmarksEnd(faceLandmarks, startTimestamp) {
    return getFaceLandmarksStart(faceLandmarks, startTimestamp) + faceLandmarks.duration;
}
exports.getFaceLandmarksEnd = getFaceLandmarksEnd;
