"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_DISABLE_BUTTON = exports.RESET_SHARED_VIDEO_STATUS = exports.SET_SHARED_VIDEO_STATUS = void 0;
/**
 * The type of the action which signals to update the current known state of the
 * shared video.
 *
 * {
 *     type: SET_SHARED_VIDEO_STATUS,
 *     status: string
 * }
 */
exports.SET_SHARED_VIDEO_STATUS = 'SET_SHARED_VIDEO_STATUS';
/**
 * The type of the action which signals to reset the current known state of the
 * shared video.
 *
 * {
 *     type: RESET_SHARED_VIDEO_STATUS,
 * }
 */
exports.RESET_SHARED_VIDEO_STATUS = 'RESET_SHARED_VIDEO_STATUS';
/**
 * The type of the action which signals to disable or enable the shared video
 * button.
 *
 * {
 *     type: SET_DISABLE_BUTTON
 * }
 */
exports.SET_DISABLE_BUTTON = 'SET_DISABLE_BUTTON';
