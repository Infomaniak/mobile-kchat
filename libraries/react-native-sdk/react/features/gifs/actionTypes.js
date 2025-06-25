"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHOW_GIF_FOR_PARTICIPANT = exports.SET_GIF_MENU_VISIBILITY = exports.REMOVE_GIF_FOR_PARTICIPANT = exports.HIDE_GIF_FOR_PARTICIPANT = exports.ADD_GIF_FOR_PARTICIPANT = void 0;
/**
 * Adds a gif for a given participant.
 * {{
 *      type: ADD_GIF_FOR_PARTICIPANT,
 *      participantId: string,
 *      gifUrl: string,
 *      timeoutID: number
 * }}
 */
exports.ADD_GIF_FOR_PARTICIPANT = 'ADD_GIF_FOR_PARTICIPANT';
/**
 * Set timeout to hide a gif for a given participant.
 * {{
 *      type: HIDE_GIF_FOR_PARTICIPANT,
 *      participantId: string
 * }}
 */
exports.HIDE_GIF_FOR_PARTICIPANT = 'HIDE_GIF_FOR_PARTICIPANT';
/**
 * Removes a gif for a given participant.
 * {{
 *      type: REMOVE_GIF_FOR_PARTICIPANT,
 *      participantId: string
 * }}
 */
exports.REMOVE_GIF_FOR_PARTICIPANT = 'REMOVE_GIF_FOR_PARTICIPANT';
/**
 * Set gif menu visibility.
 * {{
 *      type: SET_GIF_MENU_VISIBILITY,
 *      visible: boolean
 * }}
 */
exports.SET_GIF_MENU_VISIBILITY = 'SET_GIF_MENU_VISIBILITY';
/**
 * Keep showing a gif for a given participant.
 * {{
 *      type: SHOW_GIF_FOR_PARTICIPANT,
 *      participantId: string
 * }}
 */
exports.SHOW_GIF_FOR_PARTICIPANT = 'SHOW_GIF_FOR_PARTICIPANT';
