import { IReduxState } from '../app/types';
/**
 * Returns whether or not the keyboard shortcuts are enabled.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean} - Whether or not the keyboard shortcuts are enabled.
 */
export declare function areKeyboardShortcutsEnabled(state: IReduxState): boolean;
/**
 * Returns the keyboard shortcuts map.
 *
 * @param {Object} state - The redux state.
 * @returns {Map} - The keyboard shortcuts map.
 */
export declare function getKeyboardShortcuts(state: IReduxState): Map<string, import("./types").IKeyboardShortcut>;
/**
 * Returns the keyboard shortcuts help descriptions.
 *
 * @param {Object} state - The redux state.
 * @returns {Map} - The keyboard shortcuts help descriptions.
 */
export declare function getKeyboardShortcutsHelpDescriptions(state: IReduxState): Map<string, string>;
