"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTimelinePanning = exports.clearTimelineBoundary = exports.setTimelineBoundary = exports.addToOffsetRight = exports.addToOffsetLeft = exports.addToOffset = exports.toggleFaceExpressions = exports.resetSearchCriteria = exports.initReorderStats = exports.updateSortedSpeakerStatsIds = exports.updateStats = exports.initUpdateStats = exports.initSearch = void 0;
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
const functions_1 = require("./functions");
/**
 * Starts a search by criteria.
 *
 * @param {string} criteria - The search criteria.
 * @returns {Object}
 */
function initSearch(criteria) {
    return {
        type: actionTypes_1.INIT_SEARCH,
        criteria
    };
}
exports.initSearch = initSearch;
/**
 * Gets the new stats and triggers update.
 *
 * @param {Function} getSpeakerStats - Function to get the speaker stats.
 * @returns {Object}
 */
function initUpdateStats(getSpeakerStats) {
    return {
        type: actionTypes_1.INIT_UPDATE_STATS,
        getSpeakerStats
    };
}
exports.initUpdateStats = initUpdateStats;
/**
 * Updates the stats with new stats.
 *
 * @param {Object} stats - The new stats.
 * @returns {Object}
 */
function updateStats(stats) {
    return {
        type: actionTypes_1.UPDATE_STATS,
        stats
    };
}
exports.updateStats = updateStats;
/**
 * Updates the speaker stats order.
 *
 * @param {Array<string>} participantIds - Participant ids.
 * @returns {Object}
 */
function updateSortedSpeakerStatsIds(participantIds) {
    return {
        type: actionTypes_1.UPDATE_SORTED_SPEAKER_STATS_IDS,
        participantIds
    };
}
exports.updateSortedSpeakerStatsIds = updateSortedSpeakerStatsIds;
/**
 * Initiates reordering of the stats.
 *
 * @returns {Object}
 */
function initReorderStats() {
    return {
        type: actionTypes_1.INIT_REORDER_STATS
    };
}
exports.initReorderStats = initReorderStats;
/**
 * Resets the search criteria.
 *
 * @returns {Object}
 */
function resetSearchCriteria() {
    return {
        type: actionTypes_1.RESET_SEARCH_CRITERIA
    };
}
exports.resetSearchCriteria = resetSearchCriteria;
/**
 * Toggles the face expressions grid.
 *
 * @returns {Object}
 */
function toggleFaceExpressions() {
    return {
        type: actionTypes_1.TOGGLE_FACE_EXPRESSIONS
    };
}
exports.toggleFaceExpressions = toggleFaceExpressions;
/**
 * Adds a value to the boundary offset of the timeline.
 *
 * @param {number} value - The value to be added.
 * @param {number} left - The left boundary.
 * @param {number} right - The right boundary.
 * @param {number} currentDuration - The currentDuration of the conference.
 * @returns {Object}
 */
function addToOffset(value) {
    return (dispatch, getState) => {
        const state = getState();
        const { left, right } = (0, functions_1.getTimelineBoundaries)(state);
        const currentDuration = (0, functions_1.getCurrentDuration)(state) ?? 0;
        const newLeft = left + value;
        const newRight = right + value;
        if (newLeft >= 0 && newRight <= currentDuration) {
            dispatch({
                type: actionTypes_1.ADD_TO_OFFSET,
                value
            });
        }
        else if (newLeft < 0) {
            dispatch({
                type: actionTypes_1.ADD_TO_OFFSET,
                value: -left
            });
        }
        else if (newRight > currentDuration) {
            dispatch({
                type: actionTypes_1.ADD_TO_OFFSET,
                value: currentDuration - right
            });
        }
    };
}
exports.addToOffset = addToOffset;
/**
 * Adds the value to the offset of the left boundary for the timeline.
 *
 * @param {number} value - The new value for the offset.
 * @returns {Object}
 */
function addToOffsetLeft(value) {
    return (dispatch, getState) => {
        const state = getState();
        const { left, right } = (0, functions_1.getTimelineBoundaries)(state);
        const newLeft = left + value;
        if (newLeft >= 0 && right - newLeft > constants_1.MINIMUM_INTERVAL) {
            dispatch({
                type: actionTypes_1.ADD_TO_OFFSET_LEFT,
                value
            });
        }
        else if (newLeft < 0) {
            dispatch({
                type: actionTypes_1.ADD_TO_OFFSET_LEFT,
                value: -left
            });
        }
    };
}
exports.addToOffsetLeft = addToOffsetLeft;
/**
 * Adds the value to the offset of the right boundary for the timeline.
 *
 * @param {number} value - The new value for the offset.
 * @returns {Object}
 */
function addToOffsetRight(value) {
    return (dispatch, getState) => {
        const state = getState();
        const { left, right } = (0, functions_1.getTimelineBoundaries)(state);
        const currentDuration = (0, functions_1.getCurrentDuration)(state) ?? 0;
        const newRight = right + value;
        if (newRight <= currentDuration && newRight - left > constants_1.MINIMUM_INTERVAL) {
            dispatch({
                type: actionTypes_1.ADD_TO_OFFSET_RIGHT,
                value
            });
        }
        else if (newRight > currentDuration) {
            dispatch({
                type: actionTypes_1.ADD_TO_OFFSET_RIGHT,
                value: currentDuration - right
            });
        }
    };
}
exports.addToOffsetRight = addToOffsetRight;
/**
 * Sets the current time boundary of the timeline, when zoomed in.
 *
 * @param {number} boundary - The current time boundary.
 * @returns {Object}
 */
function setTimelineBoundary(boundary) {
    return {
        type: actionTypes_1.SET_TIMELINE_BOUNDARY,
        boundary
    };
}
exports.setTimelineBoundary = setTimelineBoundary;
/**
 * Clears the current time boundary of the timeline, when zoomed out full.
 *
 * @returns {Object}
 */
function clearTimelineBoundary() {
    return {
        type: actionTypes_1.SET_TIMELINE_BOUNDARY,
        boundary: null
    };
}
exports.clearTimelineBoundary = clearTimelineBoundary;
/**
 * Sets the state of the timeline panning.
 *
 * @param {Object} panning - The state of the timeline panning.
 * @returns {Object}
 */
function setTimelinePanning(panning) {
    return {
        type: actionTypes_1.SET_PANNING,
        panning
    };
}
exports.setTimelinePanning = setTimelinePanning;
