"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_WHITEBOARD_OPEN = exports.SETUP_WHITEBOARD = exports.RESET_WHITEBOARD = void 0;
/**
 * Close the whiteboard collaboration session.
 * {{
 *      type: RESET_WHITEBOARD
 * }}
 */
exports.RESET_WHITEBOARD = 'RESET_WHITEBOARD';
/**
 * Configure the whiteboard collaboration details.
 * {{
 *      type: SETUP_WHITEBOARD,
 *      collabDetails
 * }}
 */
exports.SETUP_WHITEBOARD = 'SETUP_WHITEBOARD';
/**
 * Sets the whiteboard visibility state.
 * {{
 *      type: SET_WHITEBOARD_OPEN,
 *      isOpen
 * }}
 */
exports.SET_WHITEBOARD_OPEN = 'SET_WHITEBOARD_OPEN';
