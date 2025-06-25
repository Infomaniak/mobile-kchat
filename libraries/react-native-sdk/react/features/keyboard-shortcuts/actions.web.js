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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initKeyboardShortcuts = void 0;
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const actions_web_1 = require("../filmstrip/actions.web");
const actions_web_2 = require("../settings/actions.web");
const constants_1 = require("../settings/constants");
const functions_2 = require("../visitors/functions");
const actions_any_1 = require("./actions.any");
const functions_3 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
const utils_1 = require("./utils");
__exportStar(require("./actions.any"), exports);
/**
 * Initialise global shortcuts.
 * Global shortcuts are shortcuts for features that don't have a button or
 * link associated with the action. In other words they represent actions
 * triggered _only_ with a shortcut.
 *
 * @returns {Function}
 */
const initGlobalKeyboardShortcuts = () => (dispatch) => {
    (0, react_redux_1.batch)(() => {
        dispatch((0, actions_any_1.registerShortcut)({
            character: '?',
            helpDescription: 'keyboardShortcuts.toggleShortcuts',
            handler: () => {
                (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('help'));
                dispatch((0, actions_web_2.openSettingsDialog)(constants_1.SETTINGS_TABS.SHORTCUTS, false));
            }
        }));
        // register SPACE shortcut in two steps to insure visibility of help message
        dispatch((0, actions_any_1.registerShortcut)({
            character: ' ',
            helpCharacter: 'SPACE',
            helpDescription: 'keyboardShortcuts.pushToTalk',
            handler: () => {
                (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('push.to.talk', AnalyticsEvents_1.ACTION_SHORTCUT_RELEASED));
                logger_1.default.log('Talk shortcut released');
                APP.conference.muteAudio(true);
            }
        }));
        dispatch((0, actions_any_1.registerShortcut)({
            character: '0',
            helpDescription: 'keyboardShortcuts.focusLocal',
            handler: () => {
                dispatch((0, actions_web_1.clickOnVideo)(0));
            }
        }));
        Array(9).fill(1)
            .forEach((_, index) => {
            const num = index + 1;
            dispatch((0, actions_any_1.registerShortcut)({
                character: `${num}`,
                // only show help hint for the first shortcut
                helpCharacter: num === 1 ? '1-9' : undefined,
                helpDescription: num === 1 ? 'keyboardShortcuts.focusRemote' : undefined,
                handler: () => {
                    dispatch((0, actions_web_1.clickOnVideo)(num));
                }
            }));
        });
    });
};
/**
 * Initializes keyboard shortcuts.
 *
 * @returns {Function}
*/
const initKeyboardShortcuts = () => (dispatch, getState) => {
    dispatch(initGlobalKeyboardShortcuts());
    window.onkeyup = (e) => {
        const state = getState();
        const enabled = (0, functions_3.areKeyboardShortcutsEnabled)(state);
        const shortcuts = (0, functions_3.getKeyboardShortcuts)(state);
        if (!enabled || (0, utils_1.getPriorityFocusedElement)()) {
            return;
        }
        const key = (0, utils_1.getKeyboardKey)(e).toUpperCase();
        if (shortcuts.has(key)) {
            shortcuts.get(key)?.handler(e);
        }
    };
    window.onkeydown = (e) => {
        const state = getState();
        const enabled = (0, functions_3.areKeyboardShortcutsEnabled)(state);
        if (!enabled || (0, functions_2.iAmVisitor)(state)) {
            return;
        }
        const focusedElement = (0, utils_1.getPriorityFocusedElement)();
        const key = (0, utils_1.getKeyboardKey)(e).toUpperCase();
        if (key === ' ' && !focusedElement) {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('push.to.talk', AnalyticsEvents_1.ACTION_SHORTCUT_PRESSED));
            logger_1.default.log('Talk shortcut pressed');
            APP.conference.muteAudio(false);
        }
        else if (key === 'ESCAPE') {
            focusedElement?.blur();
        }
    };
};
exports.initKeyboardShortcuts = initKeyboardShortcuts;
