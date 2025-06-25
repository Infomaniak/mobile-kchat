"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAVE_POLL = exports.RESET_NB_UNREAD_POLLS = exports.RETRACT_VOTE = exports.REGISTER_VOTE = exports.RECEIVE_ANSWER = exports.RECEIVE_POLL = exports.EDIT_POLL = exports.CLEAR_POLLS = exports.CHANGE_VOTE = void 0;
/**
 * The type of the action which signals that a Poll will be changed
 *
 * {
 *     type: CHANGE_VOTE,
 * }
 *
 */
exports.CHANGE_VOTE = 'CHANGE_VOTE';
/**
 * The type of the action which signals that we need to clear all polls from the state.
 * For example we are moving to another conference.
 *
 * {
 *     type: CLEAR_POLLS
 * }
 */
exports.CLEAR_POLLS = 'CLEAR_POLLS';
/**
 * The type of the action triggered when the poll is editing.
 *
 * {
 *     type: EDIT_POLL,
 *     pollId: string,
 *     editing: boolean
 * }
 */
exports.EDIT_POLL = 'EDIT_POLL';
/**
 * The type of the action which signals that a new Poll was received.
 *
 * {
 *     type: RECEIVE_POLL,
 *     poll: Poll,
 *     pollId: string,
 *     notify: boolean
 * }
 *
 */
exports.RECEIVE_POLL = 'RECEIVE_POLL';
/**
 * The type of the action which signals that a new Answer was received.
 *
 * {
 *     type: RECEIVE_ANSWER,
 *     answer: Answer,
 *     pollId: string,
 * }
 */
exports.RECEIVE_ANSWER = 'RECEIVE_ANSWER';
/**
 * The type of the action which registers a vote.
 *
 * {
 *     type: REGISTER_VOTE,
 *     answers: Array<boolean> | null,
 *     pollId: string
 * }
 */
exports.REGISTER_VOTE = 'REGISTER_VOTE';
/**
 * The type of the action which retracts a vote.
 *
 * {
 *     type: RETRACT_VOTE,
 *     pollId: string,
 * }
 */
exports.RETRACT_VOTE = 'RETRACT_VOTE';
/**
 * The type of the action triggered when the poll tab in chat pane is closed
 *
 * {
 *     type: RESET_NB_UNREAD_POLLS,
 * }
 */
exports.RESET_NB_UNREAD_POLLS = 'RESET_NB_UNREAD_POLLS';
/**
 * The type of the action triggered when the poll is saved.
 *
 * {
 *     type: SAVE_POLL,
 *     poll: Poll,
 *     pollId: string,
 *     saved: boolean
 * }
 */
exports.SAVE_POLL = 'SAVE_POLL';
