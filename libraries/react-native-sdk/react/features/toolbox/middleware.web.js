"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actionTypes_1 = require("../base/config/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_2 = require("../visitors/actionTypes");
const functions_1 = require("../visitors/functions");
const actionTypes_3 = require("./actionTypes");
const actions_web_1 = require("./actions.web");
const constants_1 = require("./constants");
const types_1 = require("./types");
require("./subscriber.web");
/**
 * Middleware which intercepts Toolbox actions to handle changes to the
 * visibility timeout of the Toolbox.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_3.CLEAR_TOOLBOX_TIMEOUT: {
            const { timeoutID } = store.getState()['features/toolbox'];
            clearTimeout(timeoutID ?? undefined);
            break;
        }
        case actionTypes_1.UPDATE_CONFIG:
        case actionTypes_1.OVERWRITE_CONFIG:
        case actionTypes_2.I_AM_VISITOR_MODE:
        case actionTypes_1.SET_CONFIG: {
            const result = next(action);
            const { dispatch, getState } = store;
            const state = getState();
            if (action.type !== actionTypes_2.I_AM_VISITOR_MODE) {
                const { customToolbarButtons, buttonsWithNotifyClick, participantMenuButtonsWithNotifyClick, customParticipantMenuButtons } = state['features/base/config'];
                (0, react_redux_1.batch)(() => {
                    if (action.type !== actionTypes_2.I_AM_VISITOR_MODE) {
                        dispatch((0, actions_web_1.setMainToolbarThresholds)());
                    }
                    dispatch({
                        type: actionTypes_3.SET_BUTTONS_WITH_NOTIFY_CLICK,
                        buttonsWithNotifyClick: _buildButtonsArray(buttonsWithNotifyClick, customToolbarButtons)
                    });
                    dispatch({
                        type: actionTypes_3.SET_PARTICIPANT_MENU_BUTTONS_WITH_NOTIFY_CLICK,
                        participantMenuButtonsWithNotifyClick: _buildButtonsArray(participantMenuButtonsWithNotifyClick, customParticipantMenuButtons)
                    });
                });
            }
            const toolbarButtons = _getToolbarButtons(state);
            dispatch({
                type: actionTypes_3.SET_TOOLBAR_BUTTONS,
                toolbarButtons
            });
            return result;
        }
        case actionTypes_3.SET_FULL_SCREEN:
            return _setFullScreen(next, action);
        case actionTypes_3.SET_TOOLBOX_TIMEOUT: {
            const { timeoutID } = store.getState()['features/toolbox'];
            const { handler, timeoutMS } = action;
            clearTimeout(timeoutID ?? undefined);
            action.timeoutID = setTimeout(handler, timeoutMS);
            break;
        }
    }
    return next(action);
});
/**
 * Makes an external request to enter or exit full screen mode.
 *
 * @param {Dispatch} next - The redux dispatch function to dispatch the
 * specified action to the specified store.
 * @param {Action} action - The redux action SET_FULL_SCREEN which is being
 * dispatched in the specified store.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _setFullScreen(next, action) {
    const result = next(action);
    const { fullScreen } = action;
    if (fullScreen) {
        const documentElement = document.documentElement || {};
        if (typeof documentElement.requestFullscreen === 'function') {
            documentElement.requestFullscreen();
        }
        else if (typeof documentElement.webkitRequestFullscreen === 'function') {
            documentElement.webkitRequestFullscreen();
        }
        return result;
    }
    if (typeof document.exitFullscreen === 'function') {
        document.exitFullscreen();
    }
    else if (typeof document.webkitExitFullscreen === 'function') {
        document.webkitExitFullscreen();
    }
    return result;
}
/**
 * Common logic to gather buttons that have to notify the api when clicked.
 *
 * @param {Array} buttonsWithNotifyClick - The array of systme buttons that need to notify the api.
 * @param {Array} customButtons - The custom buttons.
 * @returns {Array}
 */
function _buildButtonsArray(buttonsWithNotifyClick, customButtons) {
    const customButtonsWithNotifyClick = customButtons?.map(({ id }) => ([id, types_1.NOTIFY_CLICK_MODE.ONLY_NOTIFY])) ?? [];
    const buttons = (Array.isArray(buttonsWithNotifyClick) ? buttonsWithNotifyClick : [])
        .filter(button => typeof button === 'string' || (typeof button === 'object' && typeof button.key === 'string'))
        .map(button => {
        if (typeof button === 'string') {
            return [button, types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY];
        }
        return [
            button.key,
            button.preventExecution ? types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY : types_1.NOTIFY_CLICK_MODE.ONLY_NOTIFY
        ];
    });
    return new Map([...customButtonsWithNotifyClick, ...buttons]);
}
/**
 * Returns the list of enabled toolbar buttons.
 *
 * @param {Object} state - The redux state.
 * @returns {Array<string>} - The list of enabled toolbar buttons.
 */
function _getToolbarButtons(state) {
    const { toolbarButtons, customToolbarButtons } = state['features/base/config'];
    const customButtons = customToolbarButtons?.map(({ id }) => id);
    let buttons = Array.isArray(toolbarButtons) ? toolbarButtons : constants_1.TOOLBAR_BUTTONS;
    if ((0, functions_1.iAmVisitor)(state)) {
        buttons = constants_1.VISITORS_MODE_BUTTONS.filter(button => buttons.indexOf(button) > -1);
    }
    if (customButtons) {
        return [...buttons, ...customButtons];
    }
    return buttons;
}
