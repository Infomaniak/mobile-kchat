"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_PANNING = exports.SET_TIMELINE_BOUNDARY = exports.ADD_TO_OFFSET_RIGHT = exports.ADD_TO_OFFSET_LEFT = exports.SET_OFFSET = exports.ADD_TO_OFFSET = exports.DECREASE_ZOOM = exports.INCREASE_ZOOM = exports.TOGGLE_FACE_EXPRESSIONS = exports.RESET_SEARCH_CRITERIA = exports.INIT_REORDER_STATS = exports.UPDATE_SORTED_SPEAKER_STATS_IDS = exports.UPDATE_STATS = exports.INIT_UPDATE_STATS = exports.INIT_SEARCH = void 0;
/**
 * Action type to start search.
 *
 * {
 *     type: INIT_SEARCH
 * }
 */
exports.INIT_SEARCH = 'INIT_SEARCH';
/**
 * Action type to start stats retrieval.
 *
 * {
 *     type: INIT_UPDATE_STATS,
 *     getSpeakerStats: Function
 * }
 */
exports.INIT_UPDATE_STATS = 'INIT_UPDATE_STATS';
/**
 * Action type to update stats.
 *
 * {
 *     type: UPDATE_STATS,
 *     stats: Object
 * }
 */
exports.UPDATE_STATS = 'UPDATE_STATS';
/**
 * Action type to update the speaker stats order.
 * {
 *     type: UPDATE_SORTED_SPEAKER_STATS_IDS
 * }
 */
exports.UPDATE_SORTED_SPEAKER_STATS_IDS = 'UPDATE_SORTED_SPEAKER_STATS_IDS';
/**
 * Action type to initiate reordering of the stats.
 *
 * {
 *     type: INIT_REORDER_STATS
 * }
 */
exports.INIT_REORDER_STATS = 'INIT_REORDER_STATS';
/**
 * Action type to reset the search criteria.
 *
 * {
 *     type: RESET_SEARCH_CRITERIA
 * }
 */
exports.RESET_SEARCH_CRITERIA = 'RESET_SEARCH_CRITERIA';
/**
 * Action type to toggle the face expressions grid.
 * {
 *     type: TOGGLE_FACE_EXPRESSIONS
 * }
 */
exports.TOGGLE_FACE_EXPRESSIONS = 'SHOW_FACE_EXPRESSIONS';
exports.INCREASE_ZOOM = 'INCREASE_ZOOM';
exports.DECREASE_ZOOM = 'DECREASE_ZOOM';
exports.ADD_TO_OFFSET = 'ADD_TO_OFFSET';
exports.SET_OFFSET = 'RESET_OFFSET';
exports.ADD_TO_OFFSET_LEFT = 'ADD_TO_OFFSET_LEFT';
exports.ADD_TO_OFFSET_RIGHT = 'ADD_TO_OFFSET_RIGHT';
exports.SET_TIMELINE_BOUNDARY = 'SET_TIMELINE_BOUNDARY';
exports.SET_PANNING = 'SET_PANNING';
