import { IGUMPendingState } from './types';
/**
 * Media state object for local audio.
 *
 * @typedef {Object} AudioMediaState
 * @property {boolean} muted=false - Audio muted state.
 */
/**
 * Initial state for local audio.
 *
 * @type {AudioMediaState}
 */
export declare const _AUDIO_INITIAL_MEDIA_STATE: {
    available: boolean;
    gumPending: IGUMPendingState;
    unmuteBlocked: boolean;
    muted: boolean;
};
/**
 * Media state object for local screenshare.
 *
 * @typedef {Object} ScreenshareMediaState
 * @property {boolean} available=true - Screenshare available state.
 * @property {boolean} muted=true - Screenshare muted state.
 * @property {boolean} unmuteBlocked=false - Screenshare unmute blocked state.
 */
/**
 * Initial state for video.
 *
 * @type {ScreenshareMediaState}
 */
export declare const _SCREENSHARE_INITIAL_MEDIA_STATE: {
    available: boolean;
    muted: number;
    unmuteBlocked: boolean;
};
/**
 * Media state object for local video.
 *
 * @typedef {Object} VideoMediaState
 * @property {CAMERA_FACING_MODE} facingMode='user' - Camera facing mode.
 * @property {boolean} muted=false - Video muted state.
 */
/**
 * Initial state for video.
 *
 * @type {VideoMediaState}
 */
export declare const _VIDEO_INITIAL_MEDIA_STATE: {
    available: boolean;
    gumPending: IGUMPendingState;
    unmuteBlocked: boolean;
    facingMode: string;
    muted: number;
    /**
     * The video {@link Transform}s applied to {@code MediaStream}s by
     * {@code id} i.e. "pinch to zoom".
     */
    transforms: {};
};
interface IAudioState {
    available: boolean;
    gumPending: IGUMPendingState;
    muted: boolean;
    unmuteBlocked: boolean;
}
interface IScreenshareState {
    available: boolean;
    muted: number;
    unmuteBlocked: boolean;
}
interface IVideoState {
    available: boolean;
    facingMode: string;
    gumPending: IGUMPendingState;
    muted: number;
    transforms: Object;
    unmuteBlocked: boolean;
}
export interface IMediaState {
    audio: IAudioState;
    screenshare: IScreenshareState;
    video: IVideoState;
}
export {};
