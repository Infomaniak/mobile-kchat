/**
 * Action type to start search.
 *
 * {
 *     type: INIT_SEARCH
 * }
 */
export declare const INIT_SEARCH = "INIT_SEARCH";
/**
 * Action type to start stats retrieval.
 *
 * {
 *     type: INIT_UPDATE_STATS,
 *     getSpeakerStats: Function
 * }
 */
export declare const INIT_UPDATE_STATS = "INIT_UPDATE_STATS";
/**
 * Action type to update stats.
 *
 * {
 *     type: UPDATE_STATS,
 *     stats: Object
 * }
 */
export declare const UPDATE_STATS = "UPDATE_STATS";
/**
 * Action type to update the speaker stats order.
 * {
 *     type: UPDATE_SORTED_SPEAKER_STATS_IDS
 * }
 */
export declare const UPDATE_SORTED_SPEAKER_STATS_IDS = "UPDATE_SORTED_SPEAKER_STATS_IDS";
/**
 * Action type to initiate reordering of the stats.
 *
 * {
 *     type: INIT_REORDER_STATS
 * }
 */
export declare const INIT_REORDER_STATS = "INIT_REORDER_STATS";
/**
 * Action type to reset the search criteria.
 *
 * {
 *     type: RESET_SEARCH_CRITERIA
 * }
 */
export declare const RESET_SEARCH_CRITERIA = "RESET_SEARCH_CRITERIA";
/**
 * Action type to toggle the face expressions grid.
 * {
 *     type: TOGGLE_FACE_EXPRESSIONS
 * }
 */
export declare const TOGGLE_FACE_EXPRESSIONS = "SHOW_FACE_EXPRESSIONS";
export declare const INCREASE_ZOOM = "INCREASE_ZOOM";
export declare const DECREASE_ZOOM = "DECREASE_ZOOM";
export declare const ADD_TO_OFFSET = "ADD_TO_OFFSET";
export declare const SET_OFFSET = "RESET_OFFSET";
export declare const ADD_TO_OFFSET_LEFT = "ADD_TO_OFFSET_LEFT";
export declare const ADD_TO_OFFSET_RIGHT = "ADD_TO_OFFSET_RIGHT";
export declare const SET_TIMELINE_BOUNDARY = "SET_TIMELINE_BOUNDARY";
export declare const SET_PANNING = "SET_PANNING";
