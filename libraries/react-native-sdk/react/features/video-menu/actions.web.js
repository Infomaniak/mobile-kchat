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
exports.renderConnectionStatus = void 0;
const actionTypes_1 = require("../base/connection/actionTypes");
__exportStar(require("./actions.any"), exports);
/**
 * Sets whether to render the connection status info into the Popover of the thumbnail or the context menu buttons.
 *
 * @param {boolean} showConnectionInfo - Whether it should show the connection
 * info or the context menu buttons on thumbnail popover.
 * @returns {Object}
 */
function renderConnectionStatus(showConnectionInfo) {
    return {
        type: actionTypes_1.SHOW_CONNECTION_INFO,
        showConnectionInfo
    };
}
exports.renderConnectionStatus = renderConnectionStatus;
