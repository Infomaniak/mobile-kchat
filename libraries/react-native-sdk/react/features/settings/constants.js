"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SS_SUPPORTED_FRAMERATES = exports.SS_DEFAULT_FRAME_RATE = exports.SETTINGS_TABS = void 0;
exports.SETTINGS_TABS = {
    AUDIO: 'audio_tab',
    CALENDAR: 'calendar_tab',
    MORE: 'more_tab',
    MODERATOR: 'moderator-tab',
    NOTIFICATIONS: 'notifications_tab',
    PROFILE: 'profile_tab',
    SHORTCUTS: 'shortcuts_tab',
    VIDEO: 'video_tab',
    VIRTUAL_BACKGROUND: 'virtual-background_tab'
};
/**
 * Default frame rate to be used for capturing screenshare.
 */
exports.SS_DEFAULT_FRAME_RATE = 5;
/**
 * Supported framerates to be used for capturing screenshare.
 */
exports.SS_SUPPORTED_FRAMERATES = [5, 15, 30];
