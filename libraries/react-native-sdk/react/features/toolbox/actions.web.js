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
exports.closeOverflowMenuIfOpen = exports.setToolboxTimeout = exports.setToolbarHovered = exports.setOverflowMenuVisible = exports.setHangupMenuVisible = exports.clearToolboxTimeout = exports.setOverflowDrawer = exports.showToolbox = exports.setMainToolbarThresholds = exports.setFullScreen = exports.hideToolbox = exports.fullScreenChanged = exports.dockToolbox = void 0;
const actions_1 = require("../base/config/actions");
const utils_1 = require("../base/environment/utils");
const functions_any_1 = require("../video-layout/functions.any");
const actionTypes_1 = require("./actionTypes");
const actions_web_1 = require("./actions.web");
const constants_1 = require("./constants");
const functions_web_1 = require("./functions.web");
__exportStar(require("./actions.any"), exports);
/**
 * Docks/undocks the Toolbox.
 *
 * @param {boolean} dock - True if dock, false otherwise.
 * @returns {Function}
 */
function dockToolbox(dock) {
    return (dispatch, getState) => {
        const state = getState();
        const { visible } = state['features/toolbox'];
        const toolbarTimeout = (0, functions_web_1.getToolbarTimeout)(state);
        if (dock) {
            // First make sure the toolbox is shown.
            visible || dispatch(showToolbox());
            dispatch(clearToolboxTimeout());
        }
        else if (visible) {
            dispatch(setToolboxTimeout(() => dispatch(hideToolbox()), toolbarTimeout));
        }
        else {
            dispatch(showToolbox());
        }
    };
}
exports.dockToolbox = dockToolbox;
/**
 * Signals that full screen mode has been entered or exited.
 *
 * @param {boolean} fullScreen - Whether or not full screen mode is currently
 * enabled.
 * @returns {{
 *     type: FULL_SCREEN_CHANGED,
 *     fullScreen: boolean
 * }}
 */
function fullScreenChanged(fullScreen) {
    return {
        type: actionTypes_1.FULL_SCREEN_CHANGED,
        fullScreen
    };
}
exports.fullScreenChanged = fullScreenChanged;
/**
 * Hides the toolbox.
 *
 * @param {boolean} force - True to force the hiding of the toolbox without
 * caring about the extended toolbar side panels.
 * @returns {Function}
 */
function hideToolbox(force = false) {
    return (dispatch, getState) => {
        const state = getState();
        const { toolbarConfig } = state['features/base/config'];
        const alwaysVisible = toolbarConfig?.alwaysVisible;
        const autoHideWhileChatIsOpen = toolbarConfig?.autoHideWhileChatIsOpen;
        const { hovered } = state['features/toolbox'];
        const toolbarTimeout = (0, functions_web_1.getToolbarTimeout)(state);
        if (alwaysVisible) {
            return;
        }
        dispatch(clearToolboxTimeout());
        const hoverSelector = (0, functions_any_1.isLayoutTileView)(state)
            ? '.remotevideomenu:hover'
            : '.filmstrip:hover,.remotevideomenu:hover';
        const hoveredElem = document.querySelector(hoverSelector);
        if (!force
            && (hovered
                || state['features/invite'].calleeInfoVisible
                || (state['features/chat'].isOpen && !autoHideWhileChatIsOpen)
                || hoveredElem)) {
            dispatch(setToolboxTimeout(() => dispatch(hideToolbox()), toolbarTimeout));
        }
        else {
            dispatch((0, actions_web_1.setToolboxVisible)(false));
        }
    };
}
exports.hideToolbox = hideToolbox;
/**
 * Signals a request to enter or exit full screen mode.
 *
 * @param {boolean} fullScreen - True to enter full screen mode, false to exit.
 * @returns {{
 *     type: SET_FULL_SCREEN,
 *     fullScreen: boolean
 * }}
 */
function setFullScreen(fullScreen) {
    return {
        type: actionTypes_1.SET_FULL_SCREEN,
        fullScreen
    };
}
exports.setFullScreen = setFullScreen;
/**
 * Sets the mainToolbarButtonsThresholds.
 *
 * @returns {Function}
 */
function setMainToolbarThresholds() {
    return (dispatch, getState) => {
        const { mainToolbarButtons } = getState()['features/base/config'];
        if (!mainToolbarButtons || !Array.isArray(mainToolbarButtons) || mainToolbarButtons.length === 0) {
            return;
        }
        const mainToolbarButtonsThresholds = [];
        const mainToolbarButtonsLenghtMap = new Map();
        let orderIsChanged = false;
        mainToolbarButtons.forEach(buttons => {
            if (!Array.isArray(buttons) || buttons.length === 0) {
                return;
            }
            mainToolbarButtonsLenghtMap.set(buttons.length, buttons);
        });
        constants_1.THRESHOLDS.forEach(({ width, order }) => {
            let finalOrder = mainToolbarButtonsLenghtMap.get(order.length);
            if (finalOrder) {
                orderIsChanged = true;
            }
            else {
                finalOrder = order;
            }
            mainToolbarButtonsThresholds.push({
                order: finalOrder,
                width
            });
        });
        if (orderIsChanged) {
            dispatch({
                type: actionTypes_1.SET_MAIN_TOOLBAR_BUTTONS_THRESHOLDS,
                mainToolbarButtonsThresholds
            });
        }
    };
}
exports.setMainToolbarThresholds = setMainToolbarThresholds;
/**
 * Shows the toolbox for specified timeout.
 *
 * @param {number} timeout - Timeout for showing the toolbox.
 * @returns {Function}
 */
function showToolbox(timeout = 0) {
    return (dispatch, getState) => {
        const state = getState();
        const { toolbarConfig } = state['features/base/config'];
        const toolbarTimeout = (0, functions_web_1.getToolbarTimeout)(state);
        const initialTimeout = toolbarConfig?.initialTimeout;
        const alwaysVisible = toolbarConfig?.alwaysVisible;
        const { enabled, visible } = state['features/toolbox'];
        if (enabled && !visible) {
            dispatch((0, actions_web_1.setToolboxVisible)(true));
            // If the Toolbox is always visible, there's no need for a timeout
            // to toggle its visibility.
            if (!alwaysVisible) {
                if (typeof initialTimeout === 'number') {
                    // reset `initialTimeout` once it is consumed once
                    dispatch((0, actions_1.overwriteConfig)({ toolbarConfig: {
                            ...toolbarConfig,
                            initialTimeout: null
                        } }));
                }
                dispatch(setToolboxTimeout(() => dispatch(hideToolbox()), timeout || initialTimeout || toolbarTimeout));
            }
        }
    };
}
exports.showToolbox = showToolbox;
/**
 * Signals a request to display overflow as drawer.
 *
 * @param {boolean} displayAsDrawer - True to display overflow as drawer, false to preserve original behaviour.
 * @returns {{
 *     type: SET_OVERFLOW_DRAWER,
 *     displayAsDrawer: boolean
 * }}
 */
function setOverflowDrawer(displayAsDrawer) {
    return {
        type: actionTypes_1.SET_OVERFLOW_DRAWER,
        displayAsDrawer
    };
}
exports.setOverflowDrawer = setOverflowDrawer;
/**
 * Signals that toolbox timeout should be cleared.
 *
 * @returns {{
 *     type: CLEAR_TOOLBOX_TIMEOUT
 * }}
 */
function clearToolboxTimeout() {
    return {
        type: actionTypes_1.CLEAR_TOOLBOX_TIMEOUT
    };
}
exports.clearToolboxTimeout = clearToolboxTimeout;
/**
 * Shows/hides the hangup menu.
 *
 * @param {boolean} visible - True to show it or false to hide it.
 * @returns {{
 *     type: SET_HANGUP_MENU_VISIBLE,
 *     visible: boolean
 * }}
 */
function setHangupMenuVisible(visible) {
    return {
        type: actionTypes_1.SET_HANGUP_MENU_VISIBLE,
        visible
    };
}
exports.setHangupMenuVisible = setHangupMenuVisible;
/**
 * Shows/hides the overflow menu.
 *
 * @param {boolean} visible - True to show it or false to hide it.
 * @returns {{
 *     type: SET_OVERFLOW_MENU_VISIBLE,
 *     visible: boolean
 * }}
 */
function setOverflowMenuVisible(visible) {
    return {
        type: actionTypes_1.SET_OVERFLOW_MENU_VISIBLE,
        visible
    };
}
exports.setOverflowMenuVisible = setOverflowMenuVisible;
/**
 * Signals that toolbar is hovered value should be changed.
 *
 * @param {boolean} hovered - Flag showing whether toolbar is hovered.
 * @returns {{
 *     type: SET_TOOLBAR_HOVERED,
 *     hovered: boolean
 * }}
 */
function setToolbarHovered(hovered) {
    return {
        type: actionTypes_1.SET_TOOLBAR_HOVERED,
        hovered
    };
}
exports.setToolbarHovered = setToolbarHovered;
/**
 * Dispatches an action which sets new timeout for the toolbox visibility and clears the previous one.
 * On mobile browsers the toolbox does not hide on timeout. It is toggled on simple tap.
 *
 * @param {Function} handler - Function to be invoked after the timeout.
 * @param {number} timeoutMS - Delay.
 * @returns {{
 *     type: SET_TOOLBOX_TIMEOUT,
 *     handler: Function,
 *     timeoutMS: number
 * }}
 */
function setToolboxTimeout(handler, timeoutMS) {
    return function (dispatch) {
        if ((0, utils_1.isMobileBrowser)()) {
            return;
        }
        dispatch({
            type: actionTypes_1.SET_TOOLBOX_TIMEOUT,
            handler,
            timeoutMS
        });
    };
}
exports.setToolboxTimeout = setToolboxTimeout;
/**
     * Closes the overflow menu if opened.
     *
     * @private
     * @returns {void}
     */
function closeOverflowMenuIfOpen() {
    return (dispatch, getState) => {
        const { overflowMenuVisible } = getState()['features/toolbox'];
        overflowMenuVisible && dispatch(setOverflowMenuVisible(false));
    };
}
exports.closeOverflowMenuIfOpen = closeOverflowMenuIfOpen;
