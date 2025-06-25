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
exports.cancelKnocking = void 0;
const react_redux_1 = require("react-redux");
const actions_native_1 = require("../app/actions.native");
const actions_any_1 = require("./actions.any");
__exportStar(require("./actions.any"), exports);
/**
 * Cancels the ongoing knocking and abandons the join flow.
 *
 * @returns {Function}
 */
function cancelKnocking() {
    return (dispatch) => {
        (0, react_redux_1.batch)(() => {
            dispatch((0, actions_any_1.setKnockingState)(false));
            dispatch((0, actions_any_1.hideLobbyScreen)());
            dispatch((0, actions_native_1.appNavigate)(undefined));
        });
    };
}
exports.cancelKnocking = cancelKnocking;
