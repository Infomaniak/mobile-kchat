/// <reference types="node" />
import EventEmitter from 'events';
/**
 * The network info service implementation for web (Chrome, Firefox and Safari).
 */
export default class NetworkInfoService extends EventEmitter {
    _onlineStateListener: any;
    _offlineStateListener: any;
    /**
     * Creates new instance...
     */
    constructor();
    /**
     * Callback function to track the online state.
     *
     * @param {boolean} isOnline - Is the browser online or not.
     * @private
     * @returns {void}
     */
    _handleOnlineStatusChange(isOnline: boolean): void;
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
