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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOverflowMenuVisible = exports.showToolbox = void 0;
__exportStar(require("./actions.any"), exports);
/**
 * Shows the toolbox for specified timeout.
 *
 * @param {number} _timeout - Timeout for showing the toolbox.
 * @returns {Function}
 */
function showToolbox(_timeout) {
    return {};
}
exports.showToolbox = showToolbox;
/**
 * Shows/hides the overflow menu.
 *
 * @param {boolean} _visible - True to show it or false to hide it.
 * @returns {{
 *     type: SET_OVERFLOW_MENU_VISIBLE,
 *     visible: boolean
 * }}
 */
function setOverflowMenuVisible(_visible) {
    return {};
}
exports.setOverflowMenuVisible = setOverflowMenuVisible;
