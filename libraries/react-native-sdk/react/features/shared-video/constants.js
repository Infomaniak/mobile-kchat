"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAYBACK_STATUSES = exports.SHARED_VIDEO = exports.YOUTUBE_PLAYER_PARTICIPANT_NAME = exports.VIDEO_PLAYER_PARTICIPANT_NAME = void 0;
/**
 * Fixed name of the video player fake participant.
 *
 * @type {string}
 */
exports.VIDEO_PLAYER_PARTICIPANT_NAME = 'Video';
/**
 * Fixed name of the youtube player fake participant.
 *
 * @type {string}
 */
exports.YOUTUBE_PLAYER_PARTICIPANT_NAME = 'YouTube';
/**
 * Shared video command.
 *
 * @type {string}
 */
exports.SHARED_VIDEO = 'shared-video';
/**
 * Available playback statuses.
 */
exports.PLAYBACK_STATUSES = {
    PLAYING: 'playing',
    PAUSED: 'pause',
    STOPPED: 'stop'
};
