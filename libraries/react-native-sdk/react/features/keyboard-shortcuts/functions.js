"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyboardShortcutsHelpDescriptions = exports.getKeyboardShortcuts = exports.areKeyboardShortcutsEnabled = void 0;
/**
 * Returns whether or not the keyboard shortcuts are enabled.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean} - Whether or not the keyboard shortcuts are enabled.
 */
function areKeyboardShortcutsEnabled(state) {
    return state['features/keyboard-shortcuts'].enabled;
}
exports.areKeyboardShortcutsEnabled = areKeyboardShortcutsEnabled;
/**
 * Returns the keyboard shortcuts map.
 *
 * @param {Object} state - The redux state.
 * @returns {Map} - The keyboard shortcuts map.
 */
function getKeyboardShortcuts(state) {
    return state['features/keyboard-shortcuts'].shortcuts;
}
exports.getKeyboardShortcuts = getKeyboardShortcuts;
/**
 * Returns the keyboard shortcuts help descriptions.
 *
 * @param {Object} state - The redux state.
 * @returns {Map} - The keyboard shortcuts help descriptions.
 */
function getKeyboardShortcutsHelpDescriptions(state) {
    return state['features/keyboard-shortcuts'].shortcutsHelp;
}
exports.getKeyboardShortcutsHelpDescriptions = getKeyboardShortcutsHelpDescriptions;
