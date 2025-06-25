import type { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';
import EventEmitter from 'events';
import type { NetworkInfo } from './types';
/**
 * The network info service implementation for iOS and Android. 'react-native-netinfo' seems to support windows as well,
 * but that has not been tested and is nto used by jitsi-meet.
 */
export default class NetworkInfoService extends EventEmitter {
    /**
     * Stores the native subscription for future cleanup.
     */
    _subscription?: NetInfoSubscription;
    /**
     * Converts library's structure to {@link NetworkInfo} used by jitsi-meet.
     *
     * @param {NetInfoState} netInfoState - The new state given by the native library.
     * @private
     * @returns {NetworkInfo}
     */
    static _convertNetInfoState(netInfoState: NetInfoState): NetworkInfo;
    /**
     * Checks for support.
     *
     * @returns {boolean}
     */
    static isSupported(): boolean;
    /**
     * Starts the service.
     *
     * @returns {void}
     */
    start(): void;
    /**
     * Stops the service.
     *
     * @returns {void}
     */
    stop(): void;
}
