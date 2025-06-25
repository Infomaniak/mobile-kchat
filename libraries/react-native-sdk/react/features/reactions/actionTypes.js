"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHOW_SOUNDS_NOTIFICATION = exports.PUSH_REACTIONS = exports.SEND_REACTIONS = exports.SET_REACTION_QUEUE = exports.ADD_REACTION_MESSAGE = exports.FLUSH_REACTION_BUFFER = exports.ADD_REACTION_BUFFER = exports.TOGGLE_REACTIONS_VISIBLE = void 0;
/**
 * The type of the (redux) action which shows/hides the reactions menu.
 *
 * {
 *     type: TOGGLE_REACTIONS_VISIBLE,
 *     visible: boolean
 * }
 */
exports.TOGGLE_REACTIONS_VISIBLE = 'TOGGLE_REACTIONS_VISIBLE';
/**
 * The type of the action which adds a new reaction to the reactions message and sets
 * a new timeout.
 *
 * {
 *     type: ADD_REACTION_BUFFER,
 *     message: string,
 *     timeoutID: number
 * }
 */
exports.ADD_REACTION_BUFFER = 'ADD_REACTION_BUFFER';
/**
 * The type of the action which sends the reaction buffer and resets it.
 *
 * {
 *     type: FLUSH_REACTION_BUFFER
 * }
 */
exports.FLUSH_REACTION_BUFFER = 'FLUSH_REACTION_BUFFER';
/**
 * The type of the action which adds a new reaction message to the chat.
 *
 * {
 *     type: ADD_REACTION_MESSAGE,
 *     message: string,
 * }
 */
exports.ADD_REACTION_MESSAGE = 'ADD_REACTION_MESSAGE';
/**
 * The type of the action which sets the reactions queue.
 *
 * {
 *     type: SET_REACTION_QUEUE,
 *     value: Array
 * }
 */
exports.SET_REACTION_QUEUE = 'SET_REACTION_QUEUE';
/**
 * The type of the action which signals a send reaction to everyone in the conference.
 */
exports.SEND_REACTIONS = 'SEND_REACTIONS';
/**
 * The type of action to adds reactions to the queue.
 */
exports.PUSH_REACTIONS = 'PUSH_REACTIONS';
/**
 * The type of action to display disable notification sounds.
 */
exports.SHOW_SOUNDS_NOTIFICATION = 'SHOW_SOUNDS_NOTIFICATION';
