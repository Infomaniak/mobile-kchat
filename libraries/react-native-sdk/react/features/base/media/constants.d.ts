/**
 * The set of facing modes for camera.
 *
 * @enum {string}
 */
export declare const CAMERA_FACING_MODE: {
    ENVIRONMENT: string;
    USER: string;
};
export type MediaType = 'audio' | 'video' | 'screenshare';
/**
 * The set of media types.
 *
 * @enum {string}
 */
export declare const MEDIA_TYPE: {
    AUDIO: MediaType;
    SCREENSHARE: MediaType;
    VIDEO: MediaType;
};
/**
 * The types of authorities which may mute/unmute the local screenshare.
 *
 * @enum {number}
 */
export declare const SCREENSHARE_MUTISM_AUTHORITY: {
    AUDIO_ONLY: number;
    USER: number;
};
/**
 * The languages supported for audio files.
 */
export declare enum AudioSupportedLanguage {
    en = "en",
    fr = "fr",
    frCA = "frCA"
}
/**
 * The types of authorities which may mute/unmute the local video.
 *
 * @enum {number}
 */
export declare const VIDEO_MUTISM_AUTHORITY: {
    AUDIO_ONLY: number;
    BACKGROUND: number;
    USER: number;
    CAR_MODE: number;
    SCREEN_SHARE: number;
};
/**
 * The types of video tracks.
 *
 * @enum {string}
 */
export declare const VIDEO_TYPE: {
    [key: string]: VideoType;
};
export type VideoType = 'camera' | 'desktop';
