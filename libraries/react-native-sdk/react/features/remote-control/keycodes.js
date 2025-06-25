"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyboardEventToKey = exports.KEYS = void 0;
/**
 * Enumerates the supported keys.
 * NOTE: The maps represents physical keys on the keyboard, not chars.
 *
 * @readonly
 * @enum {string}
 */
exports.KEYS = {
    BACKSPACE: 'backspace',
    DELETE: 'delete',
    RETURN: 'enter',
    TAB: 'tab',
    ESCAPE: 'escape',
    UP: 'up',
    DOWN: 'down',
    RIGHT: 'right',
    LEFT: 'left',
    HOME: 'home',
    END: 'end',
    PAGEUP: 'pageup',
    PAGEDOWN: 'pagedown',
    F1: 'f1',
    F2: 'f2',
    F3: 'f3',
    F4: 'f4',
    F5: 'f5',
    F6: 'f6',
    F7: 'f7',
    F8: 'f8',
    F9: 'f9',
    F10: 'f10',
    F11: 'f11',
    F12: 'f12',
    META: 'command',
    CMD_L: 'command',
    CMD_R: 'command',
    ALT: 'alt',
    CONTROL: 'control',
    SHIFT: 'shift',
    CAPS_LOCK: 'caps_lock',
    SPACE: 'space',
    PRINTSCREEN: 'printscreen',
    INSERT: 'insert',
    NUMPAD_0: 'numpad_0',
    NUMPAD_1: 'numpad_1',
    NUMPAD_2: 'numpad_2',
    NUMPAD_3: 'numpad_3',
    NUMPAD_4: 'numpad_4',
    NUMPAD_5: 'numpad_5',
    NUMPAD_6: 'numpad_6',
    NUMPAD_7: 'numpad_7',
    NUMPAD_8: 'numpad_8',
    NUMPAD_9: 'numpad_9',
    COMMA: ',',
    PERIOD: '.',
    SEMICOLON: ';',
    QUOTE: '\'',
    BRACKET_LEFT: '[',
    BRACKET_RIGHT: ']',
    BACKQUOTE: '`',
    BACKSLASH: '\\',
    MINUS: '-',
    EQUAL: '=',
    SLASH: '/',
    ASTERISK: '*',
    PLUS: '+'
};
/**
 * Mapping between the key codes and keys defined in KEYS.
 * The mappings are based on
 * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode#Specifications.
 */
/* eslint-enable max-len */
const keyCodeToKey = {
    8: exports.KEYS.BACKSPACE,
    9: exports.KEYS.TAB,
    13: exports.KEYS.RETURN,
    16: exports.KEYS.SHIFT,
    17: exports.KEYS.CONTROL,
    18: exports.KEYS.ALT,
    20: exports.KEYS.CAPS_LOCK,
    27: exports.KEYS.ESCAPE,
    32: exports.KEYS.SPACE,
    33: exports.KEYS.PAGEUP,
    34: exports.KEYS.PAGEDOWN,
    35: exports.KEYS.END,
    36: exports.KEYS.HOME,
    37: exports.KEYS.LEFT,
    38: exports.KEYS.UP,
    39: exports.KEYS.RIGHT,
    40: exports.KEYS.DOWN,
    42: exports.KEYS.PRINTSCREEN,
    44: exports.KEYS.PRINTSCREEN,
    45: exports.KEYS.INSERT,
    46: exports.KEYS.DELETE,
    59: exports.KEYS.SEMICOLON,
    61: exports.KEYS.EQUAL,
    91: exports.KEYS.CMD_L,
    92: exports.KEYS.CMD_R,
    93: exports.KEYS.CMD_R,
    96: exports.KEYS.NUMPAD_0,
    97: exports.KEYS.NUMPAD_1,
    98: exports.KEYS.NUMPAD_2,
    99: exports.KEYS.NUMPAD_3,
    100: exports.KEYS.NUMPAD_4,
    101: exports.KEYS.NUMPAD_5,
    102: exports.KEYS.NUMPAD_6,
    103: exports.KEYS.NUMPAD_7,
    104: exports.KEYS.NUMPAD_8,
    105: exports.KEYS.NUMPAD_9,
    106: exports.KEYS.ASTERISK,
    107: exports.KEYS.PLUS,
    109: exports.KEYS.MINUS,
    110: exports.KEYS.PERIOD,
    111: exports.KEYS.SLASH,
    112: exports.KEYS.F1,
    113: exports.KEYS.F2,
    114: exports.KEYS.F3,
    115: exports.KEYS.F4,
    116: exports.KEYS.F5,
    117: exports.KEYS.F6,
    118: exports.KEYS.F7,
    119: exports.KEYS.F8,
    120: exports.KEYS.F9,
    121: exports.KEYS.F10,
    122: exports.KEYS.F11,
    123: exports.KEYS.F12,
    124: exports.KEYS.PRINTSCREEN,
    173: exports.KEYS.MINUS,
    186: exports.KEYS.SEMICOLON,
    187: exports.KEYS.EQUAL,
    188: exports.KEYS.COMMA,
    189: exports.KEYS.MINUS,
    190: exports.KEYS.PERIOD,
    191: exports.KEYS.SLASH,
    192: exports.KEYS.BACKQUOTE,
    219: exports.KEYS.BRACKET_LEFT,
    220: exports.KEYS.BACKSLASH,
    221: exports.KEYS.BRACKET_RIGHT,
    222: exports.KEYS.QUOTE,
    224: exports.KEYS.META,
    229: exports.KEYS.SEMICOLON
};
/**
 * Generate codes for digit keys (0-9).
 */
for (let i = 0; i < 10; i++) {
    keyCodeToKey[(i + 48)] = `${i}`;
}
/**
 * Generate codes for letter keys (a-z).
 */
for (let i = 0; i < 26; i++) {
    const keyCode = i + 65;
    keyCodeToKey[keyCode] = String.fromCharCode(keyCode).toLowerCase();
}
/**
 * Returns key associated with the keyCode from the passed event.
 *
 * @param {KeyboardEvent} event - The event.
 * @returns {KEYS} - The key on the keyboard.
 */
function keyboardEventToKey(event) {
    return keyCodeToKey[event.which];
}
exports.keyboardEventToKey = keyboardEventToKey;
