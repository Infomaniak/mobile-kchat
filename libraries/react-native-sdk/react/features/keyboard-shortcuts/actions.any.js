"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableKeyboardShortcuts = exports.enableKeyboardShortcuts = exports.unregisterShortcut = exports.registerShortcut = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Action to register a new shortcut.
 *
 * @param {IKeyboardShortcut} shortcut - The shortcut to register.
 * @returns {AnyAction}
*/
const registerShortcut = (shortcut) => {
    return {
        type: actionTypes_1.REGISTER_KEYBOARD_SHORTCUT,
        shortcut
    };
};
exports.registerShortcut = registerShortcut;
/**
* Action to unregister a shortcut.
*
* @param {string} character - The character of the shortcut to unregister.
* @param {boolean} altKey - Whether the shortcut used altKey.
* @returns {AnyAction}
*/
const unregisterShortcut = (character, altKey = false) => {
    return {
        alt: altKey,
        type: actionTypes_1.UNREGISTER_KEYBOARD_SHORTCUT,
        character
    };
};
exports.unregisterShortcut = unregisterShortcut;
/**
 * Action to enable keyboard shortcuts.
 *
 * @returns {AnyAction}
 */
const enableKeyboardShortcuts = () => {
    return {
        type: actionTypes_1.ENABLE_KEYBOARD_SHORTCUTS
    };
};
exports.enableKeyboardShortcuts = enableKeyboardShortcuts;
/**
 * Action to enable keyboard shortcuts.
 *
 * @returns {AnyAction}
 */
const disableKeyboardShortcuts = () => {
    return {
        type: actionTypes_1.DISABLE_KEYBOARD_SHORTCUTS
    };
};
exports.disableKeyboardShortcuts = disableKeyboardShortcuts;
