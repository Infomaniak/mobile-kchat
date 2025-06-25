"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_TOOLBOX_SHIFT_UP = exports.TOGGLE_TOOLBOX_VISIBLE = exports.SET_TOOLBOX_VISIBLE = exports.SET_TOOLBOX_TIMEOUT = exports.SET_TOOLBOX_ENABLED = exports.SET_TOOLBAR_HOVERED = exports.SET_TOOLBAR_BUTTONS = exports.SET_OVERFLOW_MENU_VISIBLE = exports.SET_OVERFLOW_DRAWER = exports.SET_MAIN_TOOLBAR_BUTTONS_THRESHOLDS = exports.SET_HANGUP_MENU_VISIBLE = exports.SET_FULL_SCREEN = exports.SET_PARTICIPANT_MENU_BUTTONS_WITH_NOTIFY_CLICK = exports.SET_BUTTONS_WITH_NOTIFY_CLICK = exports.FULL_SCREEN_CHANGED = exports.CLEAR_TOOLBOX_TIMEOUT = void 0;
/**
 * The type of the action which clears the Toolbox visibility timeout.
 *
 * {
 *     type: CLEAR_TOOLBOX_TIMEOUT
 * }
 */
exports.CLEAR_TOOLBOX_TIMEOUT = 'CLEAR_TOOLBOX_TIMEOUT';
/**
 * The type of (redux) action which updates whether the conference is or is not
 * currently in full screen view.
 *
 * {
 *     type: FULL_SCREEN_CHANGED,
 *     fullScreen: boolean
 * }
 */
exports.FULL_SCREEN_CHANGED = 'FULL_SCREEN_CHANGED';
/**
 * The type of (redux) action which sets the buttonsWithNotifyClick redux property.
 *
 * {
 *     type: SET_BUTTONS_WITH_NOTIFY_CLICK,
 *     buttonsWithNotifyClick: Map<string, NOTIFY_CLICK_MODE>
 * }
 */
exports.SET_BUTTONS_WITH_NOTIFY_CLICK = 'SET_BUTTONS_WITH_NOTIFY_CLICK';
/**
 * The type of (redux) action which sets the participantMenuButtonsWithNotifyClick redux property.
 *
 * {
 *     type: SET_BUTTONS_WITH_NOTIFY_CLICK,
 *     participantMenuButtonsWithNotifyClick: Map<string, NOTIFY_CLICK_MODE>
 * }
 */
exports.SET_PARTICIPANT_MENU_BUTTONS_WITH_NOTIFY_CLICK = 'SET_PARTICIPANT_MENU_BUTTONS_WITH_NOTIFY_CLICK';
/**
 * The type of (redux) action which requests full screen mode be entered or
 * exited.
 *
 * {
 *     type: SET_FULL_SCREEN,
 *     fullScreen: boolean
 * }
 */
exports.SET_FULL_SCREEN = 'SET_FULL_SCREEN';
/**
 * The type of the (redux) action which shows/hides the hangup menu.
 *
 * {
 *     type: SET_HANGUP_MENU_VISIBLE,
 *     visible: boolean
 * }
 */
exports.SET_HANGUP_MENU_VISIBLE = 'SET_HANGUP_MENU_VISIBLE';
/**
 * The type of the (redux) action which sets the main toolbar thresholds.
 *
 * {
 *     type: SET_MAIN_TOOLBAR_BUTTONS_THRESHOLDS,
 *     mainToolbarButtonsThresholds: IMainToolbarButtonThresholds
 * }
 */
exports.SET_MAIN_TOOLBAR_BUTTONS_THRESHOLDS = 'SET_MAIN_TOOLBAR_BUTTONS_THRESHOLDS';
/**
 * The type of the redux action that toggles whether the overflow menu(s) should be shown as drawers.
 */
exports.SET_OVERFLOW_DRAWER = 'SET_OVERFLOW_DRAWER';
/**
 * The type of the (redux) action which shows/hides the OverflowMenu.
 *
 * {
 *     type: SET_OVERFLOW_MENU_VISIBLE,
 *     visible: boolean
 * }
 */
exports.SET_OVERFLOW_MENU_VISIBLE = 'SET_OVERFLOW_MENU_VISIBLE';
/**
 * The type of the action which sets enabled toolbar buttons.
 *
 * {
 *     type: SET_TOOLBAR_BUTTONS,
 *     toolbarButtons: Array<string>
 * }
 */
exports.SET_TOOLBAR_BUTTONS = 'SET_TOOLBAR_BUTTONS';
/**
 * The type of the action which sets the indicator which determines whether a
 * fToolbar in the Toolbox is hovered.
 *
 * {
 *     type: SET_TOOLBAR_HOVERED,
 *     hovered: boolean
 * }
 */
exports.SET_TOOLBAR_HOVERED = 'SET_TOOLBAR_HOVERED';
/**
 * The type of the (redux) action which enables/disables the Toolbox.
 *
 * {
 *     type: SET_TOOLBOX_ENABLED,
 *     enabled: boolean
 * }
 */
exports.SET_TOOLBOX_ENABLED = 'SET_TOOLBOX_ENABLED';
/**
 * The type of the action which sets a new Toolbox visibility timeout and its
 * delay.
 *
 * {
 *     type: SET_TOOLBOX_TIMEOUT,
 *     handler: Function,
 *     timeoutMS: number
 * }
 */
exports.SET_TOOLBOX_TIMEOUT = 'SET_TOOLBOX_TIMEOUT';
/**
 * The type of the (redux) action which shows/hides the Toolbox.
 *
 * {
 *     type: SET_TOOLBOX_VISIBLE,
 *     visible: boolean
 * }
 */
exports.SET_TOOLBOX_VISIBLE = 'SET_TOOLBOX_VISIBLE';
/**
 * The type of the redux action which toggles the toolbox visibility regardless of it's current state.
 *
 * {
 *     type: TOGGLE_TOOLBOX_VISIBLE
 * }
 */
exports.TOGGLE_TOOLBOX_VISIBLE = 'TOGGLE_TOOLBOX_VISIBLE';
/**
 * The type of the redux action which sets whether the toolbox should be shifted up or not.
 *
 * {
 *     type: SET_TOOLBOX_SHIFT_UP
 * }
 */
exports.SET_TOOLBOX_SHIFT_UP = 'SET_TOOLBOX_SHIFT_UP';
