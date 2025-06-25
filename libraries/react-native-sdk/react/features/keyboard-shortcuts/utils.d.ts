/**
* Returns the currently focused element if it is not blacklisted.
*
* @returns {HTMLElement|null} - The currently focused element.
*/
export declare const getPriorityFocusedElement: () => HTMLElement | null;
/**
* Returns the keyboard key from a KeyboardEvent.
*
* @param {KeyboardEvent} e - The KeyboardEvent.
* @returns {string} - The keyboard key.
*/
export declare const getKeyboardKey: (e: KeyboardEvent) => string;
