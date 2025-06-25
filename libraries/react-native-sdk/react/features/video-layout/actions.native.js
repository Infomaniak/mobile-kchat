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
exports.setIsCarmode = void 0;
const actionTypes_1 = require("./actionTypes");
__exportStar(require("./actions.any"), exports);
/**
 * Creates a (redux) action which tells whether we are in carmode.
 *
 * @param {boolean} enabled - Whether we are in carmode.
 * @returns {{
 *     type: SET_CAR_MODE,
 *    enabled: boolean
 * }}
 */
function setIsCarmode(enabled) {
    return {
        type: actionTypes_1.SET_CAR_MODE,
        enabled
    };
}
exports.setIsCarmode = setIsCarmode;
