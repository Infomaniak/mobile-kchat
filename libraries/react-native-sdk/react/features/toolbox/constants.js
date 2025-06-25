"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VISITORS_MODE_BUTTONS = exports.TOOLBAR_BUTTONS = exports.SPINNER_COLOR = exports.ZINDEX_DIALOG_PORTAL = exports.DRAWER_MAX_HEIGHT = exports.TOOLBAR_TIMEOUT = exports.MAIN_TOOLBAR_BUTTONS_PRIORITY = exports.THRESHOLDS = void 0;
/**
 * Thresholds for displaying toolbox buttons.
 */
exports.THRESHOLDS = [
    {
        width: 565,
        order: ['microphone', 'camera', 'desktop', 'chat', 'raisehand', 'reactions', 'participants-pane', 'tileview']
    },
    {
        width: 520,
        order: ['microphone', 'camera', 'desktop', 'chat', 'raisehand', 'participants-pane', 'tileview']
    },
    {
        width: 470,
        order: ['microphone', 'camera', 'desktop', 'chat', 'raisehand', 'participants-pane']
    },
    {
        width: 420,
        order: ['microphone', 'camera', 'desktop', 'chat', 'participants-pane']
    },
    {
        width: 370,
        order: ['microphone', 'camera', 'chat', 'participants-pane']
    },
    {
        width: 225,
        order: ['microphone', 'camera', 'chat']
    },
    {
        width: 200,
        order: ['microphone', 'camera']
    }
];
/**
 * Main toolbar buttons priority used to determine which button should be picked to fill empty spaces for disabled
 * buttons.
 */
exports.MAIN_TOOLBAR_BUTTONS_PRIORITY = [
    'microphone',
    'camera',
    'desktop',
    'chat',
    'raisehand',
    'reactions',
    'participants-pane',
    'tileview',
    'invite',
    'toggle-camera',
    'videoquality',
    'fullscreen',
    'security',
    'closedcaptions',
    'recording',
    'livestreaming',
    'linktosalesforce',
    'sharedvideo',
    'shareaudio',
    'noisesuppression',
    'whiteboard',
    'etherpad',
    'select-background',
    'stats',
    'settings',
    'shortcuts',
    'profile',
    'embedmeeting',
    'feedback',
    'download',
    'help'
];
exports.TOOLBAR_TIMEOUT = 4000;
exports.DRAWER_MAX_HEIGHT = '80dvh - 64px';
// Around 300 to be displayed above components like chat
exports.ZINDEX_DIALOG_PORTAL = 302;
/**
 * Color for spinner displayed in the toolbar.
 */
exports.SPINNER_COLOR = '#929292';
/**
 * The list of all possible UI buttons.
 *
 * @protected
 * @type Array<string>
 */
exports.TOOLBAR_BUTTONS = [
    'camera',
    'chat',
    'closedcaptions',
    'desktop',
    'download',
    'embedmeeting',
    'etherpad',
    'feedback',
    'filmstrip',
    'fullscreen',
    'hangup',
    'help',
    'highlight',
    'invite',
    'linktosalesforce',
    'livestreaming',
    'microphone',
    'mute-everyone',
    'mute-video-everyone',
    'participants-pane',
    'profile',
    'raisehand',
    'recording',
    'security',
    'select-background',
    'settings',
    'shareaudio',
    'noisesuppression',
    'sharedvideo',
    'shortcuts',
    'stats',
    'tileview',
    'toggle-camera',
    'videoquality',
    'whiteboard'
];
/**
 * The toolbar buttons to show when in visitors mode.
 */
exports.VISITORS_MODE_BUTTONS = [
    'chat',
    'hangup',
    'raisehand',
    'settings',
    'tileview',
    'fullscreen',
    'stats',
    'videoquality'
];
