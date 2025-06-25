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
exports.setDisableButton = void 0;
const actionTypes_1 = require("./actionTypes");
__exportStar(require("./actions.any"), exports);
/**
 * Disabled share video button.
 *
 * @param {boolean} disabled - The current state of the share video button.
 * @returns {{
 *     type: SET_DISABLE_BUTTON,
 *     disabled: boolean
 * }}
 */
function setDisableButton(disabled) {
    return {
        type: actionTypes_1.SET_DISABLE_BUTTON,
        disabled
    };
}
exports.setDisableButton = setDisableButton;
