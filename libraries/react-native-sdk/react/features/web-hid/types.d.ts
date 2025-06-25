/// <reference types="w3c-web-hid" />
export declare const EVENT_TYPE: {
    INIT_DEVICE: string;
    UPDATE_DEVICE: string;
};
export declare const HOOK_STATUS: {
    ON: string;
    OFF: string;
};
export declare const COMMANDS: {
    ON_HOOK: string;
    OFF_HOOK: string;
    MUTE_OFF: string;
    MUTE_ON: string;
    ON_RING: string;
    OFF_RING: string;
    ON_HOLD: string;
    OFF_HOLD: string;
};
export declare const INPUT_REPORT_EVENT_NAME: {
    ON_DEVICE_HOOK_SWITCH: string;
    ON_DEVICE_MUTE_SWITCH: string;
};
export declare const ACTION_HOOK_TYPE_NAME: {
    HOOK_SWITCH_ON: string;
    HOOK_SWITCH_OFF: string;
    MUTE_SWITCH_ON: string;
    MUTE_SWITCH_OFF: string;
    VOLUME_CHANGE_UP: string;
    VOLUME_CHANGE_DOWN: string;
};
export interface IDeviceInfo {
    device: HIDDevice;
    hold: boolean;
    hookStatus: string;
    muted: boolean;
    ring: boolean;
}
