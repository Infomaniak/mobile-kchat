"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const events_2 = require("./events");
/**
 * The network info service implementation for web (Chrome, Firefox and Safari).
 */
class NetworkInfoService extends events_1.default {
    /**
     * Creates new instance...
     */
    constructor() {
        super();
        this._onlineStateListener = this._handleOnlineStatusChange.bind(this, /* online */ true);
        this._offlineStateListener = this._handleOnlineStatusChange.bind(this, /* offline */ false);
    }
    /**
     * Callback function to track the online state.
     *
     * @param {boolean} isOnline - Is the browser online or not.
     * @private
     * @returns {void}
     */
    _handleOnlineStatusChange(isOnline) {
        this.emit(events_2.ONLINE_STATE_CHANGED_EVENT, { isOnline });
    }
    /**
     * Checks for support.
     *
     * @returns {boolean}
     */
    static isSupported() {
        return Boolean(window.addEventListener) && typeof navigator.onLine !== 'undefined';
    }
    /**
     * Starts the service.
     *
     * @returns {void}
     */
    start() {
        window.addEventListener('online', this._onlineStateListener);
        window.addEventListener('offline', this._offlineStateListener);
    }
    /**
     * Stops the service.
     *
     * @returns {void}
     */
    stop() {
        window.removeEventListener('online', this._onlineStateListener);
        window.removeEventListener('offline', this._offlineStateListener);
    }
}
exports.default = NetworkInfoService;
