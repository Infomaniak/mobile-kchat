/**
 * Adds a gif for a given participant.
 * {{
 *      type: ADD_GIF_FOR_PARTICIPANT,
 *      participantId: string,
 *      gifUrl: string,
 *      timeoutID: number
 * }}
 */
export declare const ADD_GIF_FOR_PARTICIPANT = "ADD_GIF_FOR_PARTICIPANT";
/**
 * Set timeout to hide a gif for a given participant.
 * {{
 *      type: HIDE_GIF_FOR_PARTICIPANT,
 *      participantId: string
 * }}
 */
export declare const HIDE_GIF_FOR_PARTICIPANT = "HIDE_GIF_FOR_PARTICIPANT";
/**
 * Removes a gif for a given participant.
 * {{
 *      type: REMOVE_GIF_FOR_PARTICIPANT,
 *      participantId: string
 * }}
 */
export declare const REMOVE_GIF_FOR_PARTICIPANT = "REMOVE_GIF_FOR_PARTICIPANT";
/**
 * Set gif menu visibility.
 * {{
 *      type: SET_GIF_MENU_VISIBILITY,
 *      visible: boolean
 * }}
 */
export declare const SET_GIF_MENU_VISIBILITY = "SET_GIF_MENU_VISIBILITY";
/**
 * Keep showing a gif for a given participant.
 * {{
 *      type: SHOW_GIF_FOR_PARTICIPANT,
 *      participantId: string
 * }}
 */
export declare const SHOW_GIF_FOR_PARTICIPANT = "SHOW_GIF_FOR_PARTICIPANT";
