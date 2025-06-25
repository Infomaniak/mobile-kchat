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
exports.restrictWhiteboard = exports.toggleWhiteboard = void 0;
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const actions_any_1 = require("./actions.any");
const functions_2 = require("./functions");
const types_1 = require("./types");
__exportStar(require("./actions.any"), exports);
/**
 * API to toggle the whiteboard.
 *
 * @returns {Function}
 */
function toggleWhiteboard() {
    return async (dispatch, getState) => {
        const state = getState();
        const isAllowed = (0, functions_2.isWhiteboardAllowed)(state);
        const isOpen = (0, functions_2.isWhiteboardOpen)(state);
        if (isAllowed) {
            if (isOpen && !(0, functions_2.isWhiteboardVisible)(state)) {
                dispatch((0, actions_any_1.setWhiteboardOpen)(true));
            }
            else if (isOpen && (0, functions_2.isWhiteboardVisible)(state)) {
                dispatch((0, actions_any_1.setWhiteboardOpen)(false));
            }
            else if (!isOpen) {
                dispatch((0, actions_any_1.setWhiteboardOpen)(true));
            }
        }
        else if (typeof APP !== 'undefined') {
            APP.API.notifyWhiteboardStatusChanged(types_1.WhiteboardStatus.FORBIDDEN);
        }
    };
}
exports.toggleWhiteboard = toggleWhiteboard;
/**
 * Restricts the whiteboard usage.
 *
 * @param {boolean} shouldCloseWhiteboard - Whether to dismiss the whiteboard.
 * @returns {Function}
 */
const restrictWhiteboard = (shouldCloseWhiteboard = true) => (dispatch) => {
    if (shouldCloseWhiteboard) {
        dispatch((0, actions_any_1.setWhiteboardOpen)(false));
    }
    dispatch((0, actions_any_1.resetWhiteboard)());
    (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRestrictWhiteboardEvent)());
};
exports.restrictWhiteboard = restrictWhiteboard;
