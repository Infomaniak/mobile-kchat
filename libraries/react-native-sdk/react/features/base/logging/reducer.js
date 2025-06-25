"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const functions_1 = require("../redux/functions");
const actionTypes_1 = require("./actionTypes");
const DEFAULT_LOGGING_CONFIG = {
    // default log level for the app and lib-jitsi-meet
    defaultLogLevel: 'trace',
    // Option to disable LogCollector (which stores the logs)
    // disableLogCollector: true,
    loggers: {
        // The following are too verbose in their logging with the
        // {@link #defaultLogLevel}:
        'modules/RTC/TraceablePeerConnection.js': 'info',
        'modules/xmpp/strophe.util.js': 'log'
    }
};
/**
 * The default/initial redux state of the feature base/logging.
 *
 * @type {{
 *     config: Object
 * }}
 */
const DEFAULT_STATE = {
    config: DEFAULT_LOGGING_CONFIG,
    /**
     * The log collector.
     */
    logCollector: undefined
};
// Reduce default verbosity on mobile, it kills performance.
if (navigator.product === 'ReactNative') {
    const RN_LOGGERS = {
        'modules/sdp/SDPUtil.js': 'info',
        'modules/xmpp/ChatRoom.js': 'warn',
        'modules/xmpp/JingleSessionPC.js': 'info',
        'modules/xmpp/strophe.jingle.js': 'info'
    };
    DEFAULT_STATE.config.loggers = {
        ...DEFAULT_LOGGING_CONFIG.loggers,
        ...RN_LOGGERS
    };
}
ReducerRegistry_1.default.register('features/base/logging', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.SET_LOGGING_CONFIG:
            return _setLoggingConfig(state, action);
        case actionTypes_1.SET_LOG_COLLECTOR: {
            return _setLogCollector(state, action);
        }
        default:
            return state;
    }
});
/**
 * Reduces a specific Redux action SET_LOGGING_CONFIG of the feature
 * base/logging.
 *
 * @param {Object} state - The Redux state of the feature base/logging.
 * @param {Action} action - The Redux action SET_LOGGING_CONFIG to reduce.
 * @private
 * @returns {Object} The new state of the feature base/logging after the
 * reduction of the specified action.
 */
function _setLoggingConfig(state, action) {
    const newConfig = lodash_1.default.merge({}, DEFAULT_STATE.config, action.config);
    if ((0, functions_1.equals)(state.config, newConfig)) {
        return state;
    }
    return {
        ...state,
        config: newConfig
    };
}
/**
 * Reduces a specific Redux action SET_LOG_COLLECTOR of the feature
 * base/logging.
 *
 * @param {Object} state - The Redux state of the feature base/logging.
 * @param {Action} action - The Redux action SET_LOG_COLLECTOR to reduce.
 * @private
 * @returns {Object} The new state of the feature base/logging after the
 * reduction of the specified action.
 */
function _setLogCollector(state, action) {
    return (0, functions_1.set)(state, 'logCollector', action.logCollector);
}
