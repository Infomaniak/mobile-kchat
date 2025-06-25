"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBMIT_FEEDBACK_SUCCESS = exports.SUBMIT_FEEDBACK_ERROR = exports.CANCEL_FEEDBACK = void 0;
/**
 * The type of the action which signals feedback was closed without submitting.
 *
 * {
 *     type: CANCEL_FEEDBACK,
 *     message: string,
 *     score: number
 * }
 */
exports.CANCEL_FEEDBACK = 'CANCEL_FEEDBACK';
/**
 * The type of the action which signals feedback failed to be recorded.
 *
 * {
 *     type: SUBMIT_FEEDBACK_ERROR
 *     error: string
 * }
 */
exports.SUBMIT_FEEDBACK_ERROR = 'SUBMIT_FEEDBACK_ERROR';
/**
 * The type of the action which signals feedback has been recorded.
 *
 * {
 *     type: SUBMIT_FEEDBACK_SUCCESS,
 * }
 */
exports.SUBMIT_FEEDBACK_SUCCESS = 'SUBMIT_FEEDBACK_SUCCESS';
