"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTION_HOOK_TYPE_NAME = exports.INPUT_REPORT_EVENT_NAME = exports.COMMANDS = exports.HOOK_STATUS = exports.EVENT_TYPE = void 0;
exports.EVENT_TYPE = {
    INIT_DEVICE: 'INIT_DEVICE',
    UPDATE_DEVICE: 'UPDATE_DEVICE'
};
exports.HOOK_STATUS = {
    ON: 'on',
    OFF: 'off'
};
exports.COMMANDS = {
    ON_HOOK: 'onHook',
    OFF_HOOK: 'offHook',
    MUTE_OFF: 'muteOff',
    MUTE_ON: 'muteOn',
    ON_RING: 'onRing',
    OFF_RING: 'offRing',
    ON_HOLD: 'onHold',
    OFF_HOLD: 'offHold'
};
exports.INPUT_REPORT_EVENT_NAME = {
    ON_DEVICE_HOOK_SWITCH: 'ondevicehookswitch',
    ON_DEVICE_MUTE_SWITCH: 'ondevicemuteswitch'
};
exports.ACTION_HOOK_TYPE_NAME = {
    HOOK_SWITCH_ON: 'HOOK_SWITCH_ON',
    HOOK_SWITCH_OFF: 'HOOK_SWITCH_OFF',
    MUTE_SWITCH_ON: 'MUTE_SWITCH_ON',
    MUTE_SWITCH_OFF: 'MUTE_SWITCH_OFF',
    VOLUME_CHANGE_UP: 'VOLUME_CHANGE_UP',
    VOLUME_CHANGE_DOWN: 'VOLUME_CHANGE_DOWN'
};
