/**
 * Used to set maximumValue for native volume slider.
 * Slider double-precision floating-point number indicating the volume,
 * from 0 mute to 1 max, which converts to 0 mute to 19 max in our case.
 * 0 as muted, 10 as standard and 19 as max remote participant volume level.
 */
export declare const NATIVE_VOLUME_SLIDER_SCALE = 19;
/**
 * Used to modify initialValue, which is expected to be a decimal value between
 * 0 and 1, and converts it to a number representable by an input slider, which
 * recognizes whole numbers.
 */
export declare const VOLUME_SLIDER_SCALE = 100;
/**
 * Participant context menu button keys.
 */
export declare const PARTICIPANT_MENU_BUTTONS: {
    ALLOW_VIDEO: string;
    ASK_UNMUTE: string;
    CONN_STATUS: string;
    DEMOTE: string;
    FLIP_LOCAL_VIDEO: string;
    GRANT_MODERATOR: string;
    HIDE_SELF_VIEW: string;
    KICK: string;
    MUTE: string;
    MUTE_OTHERS: string;
    MUTE_OTHERS_VIDEO: string;
    MUTE_VIDEO: string;
    PIN_TO_STAGE: string;
    PRIVATE_MESSAGE: string;
    REMOTE_CONTROL: string;
    SEND_PARTICIPANT_TO_ROOM: string;
    VERIFY: string;
};
