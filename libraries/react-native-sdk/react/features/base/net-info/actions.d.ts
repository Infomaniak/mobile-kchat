import { NetworkInfo } from './types';
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
export declare function setNetworkInfo({ isOnline, networkType, details }: NetworkInfo): {
    type: string;
    isOnline: boolean;
    networkType: import("@react-native-community/netinfo").NetInfoStateType | undefined;
    details: {
        cellularGeneration?: import("@react-native-community/netinfo").NetInfoCellularGeneration | null | undefined;
        isConnectionExpensive?: boolean | undefined;
    } | null | undefined;
};
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
export declare function _storeNetworkInfoCleanup(cleanup?: Function): {
    type: string;
    cleanup: Function | undefined;
};
