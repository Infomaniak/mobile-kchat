"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUTTON_MODES = exports.TEXT_OVERFLOW_TYPES = exports.BUTTON_TYPES = void 0;
/**
 * The types of the buttons.
 */
var BUTTON_TYPES;
(function (BUTTON_TYPES) {
    BUTTON_TYPES["DESTRUCTIVE"] = "destructive";
    BUTTON_TYPES["PRIMARY"] = "primary";
    BUTTON_TYPES["SECONDARY"] = "secondary";
    BUTTON_TYPES["TERTIARY"] = "tertiary";
})(BUTTON_TYPES = exports.BUTTON_TYPES || (exports.BUTTON_TYPES = {}));
/**
 * Behaviour types for showing overflow text content.
 */
var TEXT_OVERFLOW_TYPES;
(function (TEXT_OVERFLOW_TYPES) {
    TEXT_OVERFLOW_TYPES["ELLIPSIS"] = "ellipsis";
    TEXT_OVERFLOW_TYPES["SCROLL_ON_HOVER"] = "scroll-on-hover";
})(TEXT_OVERFLOW_TYPES = exports.TEXT_OVERFLOW_TYPES || (exports.TEXT_OVERFLOW_TYPES = {}));
/**
 * The modes of the buttons.
 */
exports.BUTTON_MODES = {
    CONTAINED: 'contained',
    TEXT: 'text'
};
