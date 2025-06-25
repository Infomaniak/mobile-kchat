"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
/**
 * The initial state of the feature speaker-stats.
 *
 * @type {Object}
 */
const INITIAL_STATE = {
    stats: {},
    isOpen: false,
    pendingReorder: true,
    criteria: null,
    showFaceExpressions: false,
    sortedSpeakerStatsIds: [],
    timelineBoundary: null,
    offsetLeft: 0,
    offsetRight: 0,
    timelinePanning: {
        active: false,
        x: 0
    }
};
ReducerRegistry_1.default.register('features/speaker-stats', (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.INIT_SEARCH:
            return _updateCriteria(state, action);
        case actionTypes_1.UPDATE_STATS:
            return _updateStats(state, action);
        case actionTypes_1.INIT_REORDER_STATS:
            return _initReorderStats(state);
        case actionTypes_1.UPDATE_SORTED_SPEAKER_STATS_IDS:
            return _updateSortedSpeakerStats(state, action);
        case actionTypes_1.RESET_SEARCH_CRITERIA:
            return _updateCriteria(state, { criteria: null });
        case actionTypes_1.TOGGLE_FACE_EXPRESSIONS: {
            return {
                ...state,
                showFaceExpressions: !state.showFaceExpressions
            };
        }
        case actionTypes_1.ADD_TO_OFFSET: {
            return {
                ...state,
                offsetLeft: state.offsetLeft + action.value,
                offsetRight: state.offsetRight + action.value
            };
        }
        case actionTypes_1.ADD_TO_OFFSET_RIGHT: {
            return {
                ...state,
                offsetRight: state.offsetRight + action.value
            };
        }
        case actionTypes_1.ADD_TO_OFFSET_LEFT: {
            return {
                ...state,
                offsetLeft: state.offsetLeft + action.value
            };
        }
        case actionTypes_1.SET_TIMELINE_BOUNDARY: {
            return {
                ...state,
                timelineBoundary: action.boundary
            };
        }
        case actionTypes_1.SET_PANNING: {
            return {
                ...state,
                timelinePanning: action.panning
            };
        }
    }
    return state;
});
/**
 * Reduces a specific Redux action INIT_SEARCH of the feature
 * speaker-stats.
 *
 * @param {Object} state - The Redux state of the feature speaker-stats.
 * @param {Action} action - The Redux action INIT_SEARCH to reduce.
 * @private
 * @returns {Object} The new state after the reduction of the specified action.
 */
function _updateCriteria(state, { criteria }) {
    return lodash_1.default.assign({}, state, { criteria });
}
/**
 * Reduces a specific Redux action UPDATE_STATS of the feature speaker-stats.
 *
 * @param {Object} state - The Redux state of the feature speaker-stats.
 * @param {Action} action - The Redux action UPDATE_STATS to reduce.
 * @private
 * @returns {Object} - The new state after the reduction of the specified action.
 */
function _updateStats(state, { stats }) {
    return {
        ...state,
        stats
    };
}
/**
 * Reduces a specific Redux action UPDATE_SORTED_SPEAKER_STATS_IDS of the feature speaker-stats.
 *
 * @param {Object} state - The Redux state of the feature speaker-stats.
 * @param {Action} action - The Redux action UPDATE_SORTED_SPEAKER_STATS_IDS to reduce.
 * @private
 * @returns {Object} The new state after the reduction of the specified action.
 */
function _updateSortedSpeakerStats(state, { participantIds }) {
    return {
        ...state,
        sortedSpeakerStatsIds: participantIds,
        pendingReorder: false
    };
}
/**
 * Reduces a specific Redux action INIT_REORDER_STATS of the feature
 * speaker-stats.
 *
 * @param {Object} state - The Redux state of the feature speaker-stats.
 * @private
 * @returns {Object} The new state after the reduction of the specified action.
 */
function _initReorderStats(state) {
    return lodash_1.default.assign({}, state, { pendingReorder: true });
}
