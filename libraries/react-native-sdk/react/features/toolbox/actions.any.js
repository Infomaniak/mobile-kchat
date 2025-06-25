"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setShiftUp = exports.handleToggleVideoMuted = exports.toggleToolboxVisible = exports.setToolboxVisible = exports.setToolboxEnabled = void 0;
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const actions_1 = require("../base/audio-only/actions");
const actions_2 = require("../base/media/actions");
const constants_1 = require("../base/media/constants");
const actionTypes_1 = require("./actionTypes");
/**
 * Enables/disables the toolbox.
 *
 * @param {boolean} enabled - True to enable the toolbox or false to disable it.
 * @returns {{
 *     type: SET_TOOLBOX_ENABLED,
 *     enabled: boolean
 * }}
 */
function setToolboxEnabled(enabled) {
    return {
        type: actionTypes_1.SET_TOOLBOX_ENABLED,
        enabled
    };
}
exports.setToolboxEnabled = setToolboxEnabled;
/**
 * Shows/hides the toolbox.
 *
 * @param {boolean} visible - True to show the toolbox or false to hide it.
 * @returns {Function}
 */
function setToolboxVisible(visible) {
    return (dispatch, getState) => {
        const { toolbarConfig } = getState()['features/base/config'];
        const alwaysVisible = toolbarConfig?.alwaysVisible;
        if (!visible && alwaysVisible) {
            return;
        }
        dispatch({
            type: actionTypes_1.SET_TOOLBOX_VISIBLE,
            visible
        });
    };
}
exports.setToolboxVisible = setToolboxVisible;
/**
 * Action to toggle the toolbox visibility.
 *
 * @returns {Function}
 */
function toggleToolboxVisible() {
    return (dispatch, getState) => {
        const state = getState();
        const { toolbarConfig } = getState()['features/base/config'];
        const alwaysVisible = toolbarConfig?.alwaysVisible;
        const { visible } = state['features/toolbox'];
        if (visible && alwaysVisible) {
            return;
        }
        dispatch({
            type: actionTypes_1.TOGGLE_TOOLBOX_VISIBLE
        });
    };
}
exports.toggleToolboxVisible = toggleToolboxVisible;
/**
 * Action to handle toggle video from toolbox's video buttons.
 *
 * @param {boolean} muted - Whether to mute or unmute.
 * @param {boolean} showUI - When set to false will not display any error.
 * @param {boolean} ensureTrack - True if we want to ensure that a new track is
 * created if missing.
 * @returns {Function}
 */
function handleToggleVideoMuted(muted, showUI, ensureTrack) {
    return (dispatch, getState) => {
        const state = getState();
        const { enabled: audioOnly } = state['features/base/audio-only'];
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)(AnalyticsEvents_1.VIDEO_MUTE, { enable: muted }));
        if (audioOnly) {
            dispatch((0, actions_1.setAudioOnly)(false));
        }
        dispatch((0, actions_2.setVideoMuted)(muted, constants_1.VIDEO_MUTISM_AUTHORITY.USER, ensureTrack));
        // FIXME: The old conference logic still relies on this event being
        // emitted.
        typeof APP === 'undefined'
            || APP.conference.muteVideo(muted, showUI);
    };
}
exports.handleToggleVideoMuted = handleToggleVideoMuted;
/**
 * Sets whether the toolbox should be shifted up or not.
 *
 * @param {boolean} shiftUp - Whether the toolbox should shift up or not.
 * @returns {Object}
 */
function setShiftUp(shiftUp) {
    return {
        type: actionTypes_1.SET_TOOLBOX_SHIFT_UP,
        shiftUp
    };
}
exports.setShiftUp = setShiftUp;
