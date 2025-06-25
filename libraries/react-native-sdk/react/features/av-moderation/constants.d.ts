/**
 * Mapping between a media type and the witelist reducer key.
 */
export declare const MEDIA_TYPE_TO_WHITELIST_STORE_KEY: {
    [key: string]: string;
};
/**
 * Mapping between a media type and the pending reducer key.
 */
export declare const MEDIA_TYPE_TO_PENDING_STORE_KEY: {
    [key: string]: 'pendingAudio' | 'pendingVideo';
};
export declare const ASKED_TO_UNMUTE_NOTIFICATION_ID = "asked-to-unmute";
export declare const ASKED_TO_UNMUTE_SOUND_ID = "ASKED_TO_UNMUTE_SOUND";
export declare const AUDIO_MODERATION_NOTIFICATION_ID = "audio-moderation";
export declare const VIDEO_MODERATION_NOTIFICATION_ID = "video-moderation";
export declare const CS_MODERATION_NOTIFICATION_ID = "screensharing-moderation";
export declare const MODERATION_NOTIFICATIONS: {
    [x: string]: string;
};
