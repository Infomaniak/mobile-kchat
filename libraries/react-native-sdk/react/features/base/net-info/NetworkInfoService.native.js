"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const netinfo_1 = __importDefault(require("@react-native-community/netinfo"));
// eslint-disable-next-line lines-around-comment
// @ts-expect-error
const events_1 = __importDefault(require("events"));
const events_2 = require("./events");
/**
 * The network info service implementation for iOS and Android. 'react-native-netinfo' seems to support windows as well,
 * but that has not been tested and is nto used by jitsi-meet.
 */
class NetworkInfoService extends events_1.default {
    /**
     * Converts library's structure to {@link NetworkInfo} used by jitsi-meet.
     *
     * @param {NetInfoState} netInfoState - The new state given by the native library.
     * @private
     * @returns {NetworkInfo}
     */
    static _convertNetInfoState(netInfoState) {
        return {
            isOnline: Boolean(netInfoState.isInternetReachable),
            details: netInfoState.details,
            networkType: netInfoState.type
        };
    }
    /**
     * Checks for support.
     *
     * @returns {boolean}
     */
    static isSupported() {
        return Boolean(netinfo_1.default);
    }
    /**
     * Starts the service.
     *
     * @returns {void}
     */
    start() {
        this._subscription = netinfo_1.default.addEventListener(netInfoState => {
            super.emit(events_2.ONLINE_STATE_CHANGED_EVENT, NetworkInfoService._convertNetInfoState(netInfoState));
        });
    }
    /**
     * Stops the service.
     *
     * @returns {void}
     */
    stop() {
        if (this._subscription) {
            this._subscription();
            this._subscription = undefined;
        }
    }
}
exports.default = NetworkInfoService;
