"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._storeNetworkInfoCleanup = exports.setNetworkInfo = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Up[dates the network info state.
 *
 * @param {NetworkInfo} networkInfo - The new network state to be set.
 * @returns {{
 *     type: SET_NETWORK_INFO,
 *     isOnline: boolean,
 *     networkType: string,
 *     details: Object
 * }}
 */
function setNetworkInfo({ isOnline, networkType, details }) {
    return {
        type: actionTypes_1.SET_NETWORK_INFO,
        isOnline,
        networkType,
        details
    };
}
exports.setNetworkInfo = setNetworkInfo;
/**
 * Stored the cleanup function used to shutdown the {@code NetworkInfoService}.
 *
 * @param {Function} cleanup - The cleanup function to be called on {@code APP_WILL_UNMOUNT}.
 * @returns {{
 *     type: _STORE_NETWORK_INFO_CLEANUP,
 *     cleanup: Function
 * }}
 * @private
 */
function _storeNetworkInfoCleanup(cleanup) {
    return {
        type: actionTypes_1._STORE_NETWORK_INFO_CLEANUP,
        cleanup
    };
}
exports._storeNetworkInfoCleanup = _storeNetworkInfoCleanup;
