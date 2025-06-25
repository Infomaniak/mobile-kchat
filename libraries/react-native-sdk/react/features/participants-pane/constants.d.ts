/// <reference types="react" />
/**
 * Reducer key for the feature.
 */
export declare const REDUCER_KEY = "features/participants-pane";
export type ActionTrigger = 'Hover' | 'Permanent';
/**
 * Enum of possible participant action triggers.
 */
export declare const ACTION_TRIGGER: {
    HOVER: ActionTrigger;
    PERMANENT: ActionTrigger;
};
export type MediaState = 'DominantSpeaker' | 'Muted' | 'ForceMuted' | 'Unmuted' | 'None';
/**
 * Enum of possible participant media states.
 */
export declare const MEDIA_STATE: {
    [key: string]: MediaState;
};
export type QuickActionButtonType = 'Mute' | 'AskToUnmute' | 'AllowVideo' | 'StopVideo' | 'None';
/**
 * Enum of possible participant mute button states.
 */
export declare const QUICK_ACTION_BUTTON: {
    ALLOW_VIDEO: QuickActionButtonType;
    ASK_TO_UNMUTE: QuickActionButtonType;
    MUTE: QuickActionButtonType;
    NONE: QuickActionButtonType;
    STOP_VIDEO: QuickActionButtonType;
};
/**
 * Icon mapping for possible participant audio states.
 */
export declare const AudioStateIcons: {
    [x: string]: JSX.Element | null;
};
/**
 * Icon mapping for possible participant video states.
 */
export declare const VideoStateIcons: {
    [x: string]: JSX.Element | null;
};
/**
 * Mobile web context menu avatar size.
 */
export declare const AVATAR_SIZE = 20;
