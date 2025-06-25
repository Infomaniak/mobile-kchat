import React from 'react';
/**
 * Enumerates the supported keys.
 * NOTE: The maps represents physical keys on the keyboard, not chars.
 *
 * @readonly
 * @enum {string}
 */
export declare const KEYS: {
    BACKSPACE: string;
    DELETE: string;
    RETURN: string;
    TAB: string;
    ESCAPE: string;
    UP: string;
    DOWN: string;
    RIGHT: string;
    LEFT: string;
    HOME: string;
    END: string;
    PAGEUP: string;
    PAGEDOWN: string;
    F1: string;
    F2: string;
    F3: string;
    F4: string;
    F5: string;
    F6: string;
    F7: string;
    F8: string;
    F9: string;
    F10: string;
    F11: string;
    F12: string;
    META: string;
    CMD_L: string;
    CMD_R: string;
    ALT: string;
    CONTROL: string;
    SHIFT: string;
    CAPS_LOCK: string;
    SPACE: string;
    PRINTSCREEN: string;
    INSERT: string;
    NUMPAD_0: string;
    NUMPAD_1: string;
    NUMPAD_2: string;
    NUMPAD_3: string;
    NUMPAD_4: string;
    NUMPAD_5: string;
    NUMPAD_6: string;
    NUMPAD_7: string;
    NUMPAD_8: string;
    NUMPAD_9: string;
    COMMA: string;
    PERIOD: string;
    SEMICOLON: string;
    QUOTE: string;
    BRACKET_LEFT: string;
    BRACKET_RIGHT: string;
    BACKQUOTE: string;
    BACKSLASH: string;
    MINUS: string;
    EQUAL: string;
    SLASH: string;
    ASTERISK: string;
    PLUS: string;
};
/**
 * Returns key associated with the keyCode from the passed event.
 *
 * @param {KeyboardEvent} event - The event.
 * @returns {KEYS} - The key on the keyboard.
 */
export declare function keyboardEventToKey(event: React.KeyboardEvent): string;
