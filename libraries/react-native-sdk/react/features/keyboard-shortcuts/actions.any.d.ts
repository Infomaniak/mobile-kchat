import { AnyAction } from 'redux';
import { IKeyboardShortcut } from './types';
/**
 * Action to register a new shortcut.
 *
 * @param {IKeyboardShortcut} shortcut - The shortcut to register.
 * @returns {AnyAction}
*/
export declare const registerShortcut: (shortcut: IKeyboardShortcut) => AnyAction;
/**
* Action to unregister a shortcut.
*
* @param {string} character - The character of the shortcut to unregister.
* @param {boolean} altKey - Whether the shortcut used altKey.
* @returns {AnyAction}
*/
export declare const unregisterShortcut: (character: string, altKey?: boolean) => AnyAction;
/**
 * Action to enable keyboard shortcuts.
 *
 * @returns {AnyAction}
 */
export declare const enableKeyboardShortcuts: () => AnyAction;
/**
 * Action to enable keyboard shortcuts.
 *
 * @returns {AnyAction}
 */
export declare const disableKeyboardShortcuts: () => AnyAction;
