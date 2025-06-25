"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operatesWithEnterKey = exports.isElementInTheViewport = exports.findAncestorByClass = exports.createWebTheme = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const styles_1 = require("@mui/material/styles");
const utils_1 = require("./utils");
/**
 * Creates a MUI theme based on local UI tokens.
 *
 * @param {Object} arg - The ui tokens.
 * @returns {Object}
 */
function createWebTheme({ font, colors, colorMap, shape, spacing, typography, breakpoints }) {
    return (0, styles_1.createTheme)((0, styles_1.adaptV4Theme)({
        spacing,
        palette: (0, utils_1.createColorTokens)(colorMap, colors),
        shape,
        typography: {
            // @ts-ignore
            font,
            ...typography
        },
        breakpoints
    }));
}
exports.createWebTheme = createWebTheme;
/**
 * Find the first styled ancestor component of an element.
 *
 * @param {HTMLElement|null} target - Element to look up.
 * @param {string} cssClass - Styled component reference.
 * @returns {HTMLElement|null} Ancestor.
 */
const findAncestorByClass = (target, cssClass) => {
    if (!target || target.classList.contains(cssClass)) {
        return target;
    }
    return (0, exports.findAncestorByClass)(target.parentElement, cssClass);
};
exports.findAncestorByClass = findAncestorByClass;
/**
 * Checks if the passed element is visible in the viewport.
 *
 * @param {Element} element - The element.
 * @returns {boolean}
 */
function isElementInTheViewport(element) {
    if (!element) {
        return false;
    }
    if (!document.body.contains(element)) {
        return false;
    }
    const { innerHeight, innerWidth } = window;
    const { bottom, left, right, top } = element.getBoundingClientRect();
    if (bottom <= innerHeight && top >= 0 && left >= 0 && right <= innerWidth) {
        return true;
    }
    return false;
}
exports.isElementInTheViewport = isElementInTheViewport;
const enterKeyElements = ['select', 'textarea', 'summary', 'a'];
/**
 * Informs whether or not the given element does something on its own when pressing the Enter key.
 *
 * This is useful to correctly submit custom made "forms" that are not using the native form element,
 * only when the user is not using an element that needs the enter key to work.
 * Note the implementation is incomplete and should be updated as needed if more complex use cases arise
 * (for example, the Tabs aria pattern is not handled).
 *
 * @param {Element} element - The element.
 * @returns {boolean}
 */
function operatesWithEnterKey(element) {
    if (enterKeyElements.includes(element.tagName.toLowerCase())) {
        return true;
    }
    if (element.tagName.toLowerCase() === 'button' && element.getAttribute('role') === 'button') {
        return true;
    }
    return false;
}
exports.operatesWithEnterKey = operatesWithEnterKey;
