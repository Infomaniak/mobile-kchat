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
const actions_web_1 = require("../app/actions.web");
__exportStar(require("./actions.any"), exports);
/**
 * Cancels the ongoing knocking and abandons the join flow.
 *
 * @returns {Function}
 */
function cancelKnocking() {
    return async (dispatch) => {
        // when we are redirecting the library should handle any
        // unload and clean of the connection.
        APP.API.notifyReadyToClose();
        dispatch((0, actions_web_1.maybeRedirectToWelcomePage)());
    };
}
exports.cancelKnocking = cancelKnocking;
