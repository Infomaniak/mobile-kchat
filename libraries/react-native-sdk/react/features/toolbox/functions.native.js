"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVideoMuteButtonDisabled = exports.isToolboxVisible = exports.isDesktopShareButtonDisabled = exports.getMovableButtons = void 0;
const functions_1 = require("../base/devices/functions");
const constants_1 = require("../base/flags/constants");
const functions_2 = require("../base/flags/functions");
const functions_3 = require("../base/participants/functions");
const functions_4 = require("../base/redux/functions");
const functions_5 = require("../base/tracks/functions");
__exportStar(require("./functions.any"), exports);
const WIDTH = {
    FIT_9_ICONS: 560,
    FIT_8_ICONS: 500,
    FIT_7_ICONS: 440,
    FIT_6_ICONS: 380
};
/**
 * Returns a set of the buttons that are shown in the toolbar
 * but removed from the overflow menu, based on the width of the screen.
 *
 * @param {number} width - The width of the screen.
 * @returns {Set}
 */
function getMovableButtons(width) {
    let buttons = [];
    switch (true) {
        case width >= WIDTH.FIT_9_ICONS: {
            buttons = ['chat', 'togglecamera', 'screensharing', 'raisehand', 'tileview'];
            break;
        }
        case width >= WIDTH.FIT_8_ICONS: {
            buttons = ['chat', 'togglecamera', 'raisehand', 'tileview'];
            break;
        }
        case width >= WIDTH.FIT_7_ICONS: {
            buttons = ['chat', 'togglecamera', 'raisehand'];
            break;
        }
        case width >= WIDTH.FIT_6_ICONS: {
            buttons = ['chat', 'togglecamera'];
            break;
        }
        default: {
            buttons = ['chat'];
        }
    }
    return new Set(buttons);
}
exports.getMovableButtons = getMovableButtons;
/**
 * Indicates if the desktop share button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
function isDesktopShareButtonDisabled(state) {
    const { muted, unmuteBlocked } = state['features/base/media'].video;
    const videoOrShareInProgress = !muted || (0, functions_5.isLocalVideoTrackDesktop)(state);
    return unmuteBlocked && !videoOrShareInProgress;
}
exports.isDesktopShareButtonDisabled = isDesktopShareButtonDisabled;
/**
 * Returns true if the toolbox is visible.
 *
 * @param {IStateful} stateful - A function or object that can be
 * resolved to Redux state by the function {@code toState}.
 * @returns {boolean}
 */
function isToolboxVisible(stateful) {
    const state = (0, functions_4.toState)(stateful);
    const { toolbarConfig } = state['features/base/config'];
    const { alwaysVisible } = toolbarConfig || {};
    const { enabled, visible } = state['features/toolbox'];
    const participantCount = (0, functions_3.getParticipantCountWithFake)(state);
    const alwaysVisibleFlag = (0, functions_2.getFeatureFlag)(state, constants_1.TOOLBOX_ALWAYS_VISIBLE, false);
    const enabledFlag = (0, functions_2.getFeatureFlag)(state, constants_1.TOOLBOX_ENABLED, true);
    return enabledFlag && enabled
        && (alwaysVisible || visible || participantCount === 1 || alwaysVisibleFlag);
}
exports.isToolboxVisible = isToolboxVisible;
/**
 * Indicates if the video mute button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
function isVideoMuteButtonDisabled(state) {
    const { muted, unmuteBlocked } = state['features/base/media'].video;
    return !(0, functions_1.hasAvailableDevices)(state, 'videoInput')
        || (unmuteBlocked && Boolean(muted))
        || (0, functions_5.isLocalVideoTrackDesktop)(state);
}
exports.isVideoMuteButtonDisabled = isVideoMuteButtonDisabled;
