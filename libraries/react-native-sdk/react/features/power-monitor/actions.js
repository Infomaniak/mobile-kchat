"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTransport = exports.suspendDetected = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Signals that suspend was detected.
 *
 * @public
 * @returns {{
 *     type: SUSPEND_DETECTED
 * }}
 */
function suspendDetected() {
    return {
        type: actionTypes_1.SUSPEND_DETECTED
    };
}
exports.suspendDetected = suspendDetected;
/**
 * Signals setting of a transport.
 *
 * @param {Transport} transport - The transport to save in the state.
 * @returns {{
 *      transport: Transport,
 *      type: string
 *  }}
 */
function setTransport(transport) {
    return {
        type: actionTypes_1.SET_TRANSPORT,
        transport
    };
}
exports.setTransport = setTransport;
