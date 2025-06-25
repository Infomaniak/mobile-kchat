"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_FOLLOW_ME_STATE = exports.SET_FOLLOW_ME_MODERATOR = void 0;
/**
 * The id of the Follow Me moderator.
 *
 * {
 *     type: SET_FOLLOW_ME_MODERATOR,
 *     id: boolean
 * }
 */
exports.SET_FOLLOW_ME_MODERATOR = 'SET_FOLLOW_ME_MODERATOR';
/**
 * The type of (redux) action which updates the current known state of the
 * Follow Me feature.
 *
 *
 * {
 *     type: SET_FOLLOW_ME_STATE,
 *     state: boolean
 * }
 */
exports.SET_FOLLOW_ME_STATE = 'SET_FOLLOW_ME_STATE';
