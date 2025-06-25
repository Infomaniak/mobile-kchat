"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODERATION_NOTIFICATIONS = exports.CS_MODERATION_NOTIFICATION_ID = exports.VIDEO_MODERATION_NOTIFICATION_ID = exports.AUDIO_MODERATION_NOTIFICATION_ID = exports.ASKED_TO_UNMUTE_SOUND_ID = exports.ASKED_TO_UNMUTE_NOTIFICATION_ID = exports.MEDIA_TYPE_TO_PENDING_STORE_KEY = exports.MEDIA_TYPE_TO_WHITELIST_STORE_KEY = void 0;
const constants_1 = require("../base/media/constants");
/**
 * Mapping between a media type and the witelist reducer key.
 */
exports.MEDIA_TYPE_TO_WHITELIST_STORE_KEY = {
    [constants_1.MEDIA_TYPE.AUDIO]: 'audioWhitelist',
    [constants_1.MEDIA_TYPE.VIDEO]: 'videoWhitelist'
};
/**
 * Mapping between a media type and the pending reducer key.
 */
exports.MEDIA_TYPE_TO_PENDING_STORE_KEY = {
    [constants_1.MEDIA_TYPE.AUDIO]: 'pendingAudio',
    [constants_1.MEDIA_TYPE.VIDEO]: 'pendingVideo'
};
exports.ASKED_TO_UNMUTE_NOTIFICATION_ID = 'asked-to-unmute';
exports.ASKED_TO_UNMUTE_SOUND_ID = 'ASKED_TO_UNMUTE_SOUND';
exports.AUDIO_MODERATION_NOTIFICATION_ID = 'audio-moderation';
exports.VIDEO_MODERATION_NOTIFICATION_ID = 'video-moderation';
exports.CS_MODERATION_NOTIFICATION_ID = 'screensharing-moderation';
exports.MODERATION_NOTIFICATIONS = {
    [constants_1.MEDIA_TYPE.AUDIO]: exports.AUDIO_MODERATION_NOTIFICATION_ID,
    [constants_1.MEDIA_TYPE.SCREENSHARE]: exports.CS_MODERATION_NOTIFICATION_ID,
    [constants_1.MEDIA_TYPE.VIDEO]: exports.VIDEO_MODERATION_NOTIFICATION_ID
};
