"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const functions_1 = require("../base/redux/functions");
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
/**
 * Initial state of toolbox's part of Redux store.
 */
const INITIAL_STATE = {
    buttonsWithNotifyClick: new Map(),
    /**
     * The indicator which determines whether the Toolbox is enabled.
     *
     * @type {boolean}
     */
    enabled: true,
    /**
     * The indicator which determines whether the hangup menu is visible.
     *
     * @type {boolean}
     */
    hangupMenuVisible: false,
    /**
     * The indicator which determines whether a Toolbar in the Toolbox is
     * hovered.
     *
     * @type {boolean}
     */
    hovered: false,
    /**
     * The thresholds for screen size and visible main toolbar buttons.
     */
    mainToolbarButtonsThresholds: constants_1.THRESHOLDS,
    participantMenuButtonsWithNotifyClick: new Map(),
    /**
     * The indicator which determines whether the overflow menu(s) are to be displayed as drawers.
     *
     * @type {boolean}
     */
    overflowDrawer: false,
    /**
     * The indicator which determines whether the OverflowMenu is visible.
     *
     * @type {boolean}
     */
    overflowMenuVisible: false,
    /**
     * Whether to shift the toolbar up (in case it overlaps the tiles names).
     */
    shiftUp: false,
    /**
     * A number, non-zero value which identifies the timer created by a call
     * to setTimeout().
     *
     * @type {number|null}
     */
    timeoutID: null,
    /**
     * The list of enabled toolbar buttons.
     *
     * @type {Array<string>}
     */
    toolbarButtons: [],
    /**
     * The indicator that determines whether the Toolbox is visible.
     *
     * @type {boolean}
     */
    visible: false
};
ReducerRegistry_1.default.register('features/toolbox', (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.CLEAR_TOOLBOX_TIMEOUT:
            return {
                ...state,
                timeoutID: undefined
            };
        case actionTypes_1.FULL_SCREEN_CHANGED:
            return {
                ...state,
                fullScreen: action.fullScreen
            };
        case actionTypes_1.SET_HANGUP_MENU_VISIBLE:
            return {
                ...state,
                hangupMenuVisible: action.visible
            };
        case actionTypes_1.SET_OVERFLOW_DRAWER:
            return {
                ...state,
                overflowDrawer: action.displayAsDrawer
            };
        case actionTypes_1.SET_OVERFLOW_MENU_VISIBLE:
            return {
                ...state,
                overflowMenuVisible: action.visible
            };
        case actionTypes_1.SET_TOOLBAR_BUTTONS:
            return {
                ...state,
                toolbarButtons: action.toolbarButtons
            };
        case actionTypes_1.SET_BUTTONS_WITH_NOTIFY_CLICK:
            return {
                ...state,
                buttonsWithNotifyClick: action.buttonsWithNotifyClick
            };
        case actionTypes_1.SET_MAIN_TOOLBAR_BUTTONS_THRESHOLDS:
            return {
                ...state,
                mainToolbarButtonsThresholds: action.mainToolbarButtonsThresholds
            };
        case actionTypes_1.SET_TOOLBAR_HOVERED:
            return {
                ...state,
                hovered: action.hovered
            };
        case actionTypes_1.SET_TOOLBOX_ENABLED:
            return {
                ...state,
                enabled: action.enabled
            };
        case actionTypes_1.SET_TOOLBOX_TIMEOUT:
            return {
                ...state,
                timeoutID: action.timeoutID
            };
        case actionTypes_1.SET_TOOLBOX_SHIFT_UP:
            return {
                ...state,
                shiftUp: action.shiftUp
            };
        case actionTypes_1.SET_TOOLBOX_VISIBLE:
            return (0, functions_1.set)(state, 'visible', action.visible);
        case actionTypes_1.SET_PARTICIPANT_MENU_BUTTONS_WITH_NOTIFY_CLICK:
            return {
                ...state,
                participantMenuButtonsWithNotifyClick: action.participantMenuButtonsWithNotifyClick
            };
        case actionTypes_1.TOGGLE_TOOLBOX_VISIBLE:
            return (0, functions_1.set)(state, 'visible', !state.visible);
    }
    return state;
});
