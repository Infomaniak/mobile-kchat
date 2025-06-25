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
exports.isReactionsButtonEnabled = exports.getReactionsMenuVisibility = void 0;
const functions_any_1 = require("./functions.any");
__exportStar(require("./functions.any"), exports);
/**
 * Returns the visibility state of the reactions menu.
 *
 * @param {Object} state - The state of the application.
 * @returns {boolean}
 */
function getReactionsMenuVisibility(state) {
    return state['features/reactions'].visible;
}
exports.getReactionsMenuVisibility = getReactionsMenuVisibility;
/**
 * Whether or not the reactions button is enabled.
 *
 * @param {Object} state - The Redux state object.
 * @returns {boolean}
 */
function isReactionsButtonEnabled(state) {
    const { toolbarButtons } = state['features/toolbox'];
    return Boolean(toolbarButtons?.includes('reactions')) && (0, functions_any_1.isReactionsEnabled)(state);
}
exports.isReactionsButtonEnabled = isReactionsButtonEnabled;
