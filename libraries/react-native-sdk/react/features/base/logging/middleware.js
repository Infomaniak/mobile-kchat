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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error
const logger_1 = __importDefault(require("@jitsi/logger"));
const actionTypes_1 = require("../app/actionTypes");
const actionTypes_2 = require("../conference/actionTypes");
const functions_1 = require("../conference/functions");
const actionTypes_3 = require("../config/actionTypes");
const lib_jitsi_meet_1 = __importStar(require("../lib-jitsi-meet"));
const actionTypes_4 = require("../lib-jitsi-meet/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const functions_2 = require("../testing/functions");
const ExternalApiLogTransport_1 = __importDefault(require("./ExternalApiLogTransport"));
const JitsiMeetInMemoryLogStorage_1 = __importDefault(require("./JitsiMeetInMemoryLogStorage"));
const JitsiMeetLogStorage_1 = __importDefault(require("./JitsiMeetLogStorage"));
const actionTypes_5 = require("./actionTypes");
const actions_1 = require("./actions");
/**
 * The Redux middleware of the feature base/logging.
 *
 * @param {Store} store - The Redux store.
 * @returns {Function}
 * @private
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            return _appWillMount(store, next, action);
        case actionTypes_2.CONFERENCE_JOINED:
            return _conferenceJoined(store, next, action);
        case actionTypes_4.LIB_WILL_INIT:
            return _libWillInit(store, next, action);
        case actionTypes_3.SET_CONFIG:
            return _setConfig(store, next, action);
        case actionTypes_5.SET_LOGGING_CONFIG:
            return _setLoggingConfig(store, next, action);
    }
    return next(action);
});
/**
 * Notifies the feature base/logging that the action {@link APP_WILL_MOUNT} is
 * being dispatched within a specific Redux {@code store}.
 *
 * @param {Store} store - The Redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The Redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The Redux action {@code APP_WILL_MOUNT} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the
 * specified {@code action}.
 */
function _appWillMount({ getState }, next, action) {
    const { config } = getState()['features/base/logging'];
    _setLogLevels(logger_1.default, config);
    // FIXME Until the logic of conference.js is rewritten into the React
    // app we, JitsiMeetJS.init is to not be used for the React app.
    // Consequently, LIB_WILL_INIT will not be dispatched. In the meantime, do
    // the following:
    typeof APP === 'undefined' || _setLogLevels(lib_jitsi_meet_1.default, config);
    return next(action);
}
/**
 * Starts the log collector, after {@link CONFERENCE_JOINED} action is reduced.
 *
 * @param {Store} store - The Redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The Redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The Redux action {@code CONFERENCE_JOINED} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {*}
 */
function _conferenceJoined({ getState }, next, action) {
    // Wait until the joined event is processed, so that the JitsiMeetLogStorage
    // will be ready.
    const result = next(action);
    const { conference } = action;
    const { logCollector } = getState()['features/base/logging'];
    if (logCollector && conference === (0, functions_1.getCurrentConference)(getState())) {
        // Start the LogCollector's periodic "store logs" task
        logCollector.start();
        // Make an attempt to flush in case a lot of logs have been cached,
        // before the collector was started.
        logCollector.flush();
        // This event listener will flush the logs, before the statistics module
        // is stopped.
        //
        // NOTE The LogCollector is not stopped, because this event can be
        // triggered multiple times during single conference (whenever
        // statistics module is stopped). That includes the case when Jicofo
        // terminates a single person conference (one person left in the room
        // waiting for someone to join). It will then restart the media session
        // when someone eventually joins the room which will start the stats
        // again.
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.BEFORE_STATISTICS_DISPOSED, () => logCollector.flush());
    }
    return result;
}
/**
 * Initializes logging in the app.
 *
 * @param {Store} store - The Redux store in which context the logging is to be
 * initialized.
 * @param {Object} loggingConfig - The configuration with which logging is to be
 * initialized.
 * @param {boolean} isTestingEnabled - Is debug logging enabled.
 * @private
 * @returns {void}
 */
function _initLogging({ dispatch, getState }, loggingConfig, isTestingEnabled) {
    const { logCollector } = getState()['features/base/logging'];
    // Create the LogCollector and register it as the global log transport. It
    // is done early to capture as much logs as possible. Captured logs will be
    // cached, before the JitsiMeetLogStorage gets ready (statistics module is
    // initialized).
    if (!logCollector && !loggingConfig.disableLogCollector) {
        const _logCollector = new logger_1.default.LogCollector(new JitsiMeetLogStorage_1.default(getState));
        const { apiLogLevels } = getState()['features/base/config'];
        if (apiLogLevels && Array.isArray(apiLogLevels) && typeof APP === 'object') {
            const transport = (0, ExternalApiLogTransport_1.default)(apiLogLevels);
            logger_1.default.addGlobalTransport(transport);
            lib_jitsi_meet_1.default.addGlobalLogTransport(transport);
        }
        logger_1.default.addGlobalTransport(_logCollector);
        lib_jitsi_meet_1.default.addGlobalLogTransport(_logCollector);
        dispatch((0, actions_1.setLogCollector)(_logCollector));
        // The JitsiMeetInMemoryLogStorage can not be accessed on mobile through
        // the 'executeScript' method like it's done in torture tests for WEB.
        if (isTestingEnabled && typeof APP === 'object') {
            APP.debugLogs = new JitsiMeetInMemoryLogStorage_1.default();
            const debugLogCollector = new logger_1.default.LogCollector(APP.debugLogs, { storeInterval: 1000 });
            logger_1.default.addGlobalTransport(debugLogCollector);
            lib_jitsi_meet_1.default.addGlobalLogTransport(debugLogCollector);
            debugLogCollector.start();
        }
    }
    else if (logCollector && loggingConfig.disableLogCollector) {
        logger_1.default.removeGlobalTransport(logCollector);
        lib_jitsi_meet_1.default.removeGlobalLogTransport(logCollector);
        logCollector.stop();
        dispatch((0, actions_1.setLogCollector)(undefined));
    }
}
/**
 * Notifies the feature base/logging that the action {@link LIB_WILL_INIT} is
 * being dispatched within a specific Redux {@code store}.
 *
 * @param {Store} store - The Redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The Redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The Redux action {@code LIB_WILL_INIT} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the
 * specified {@code action}.
 */
function _libWillInit({ getState }, next, action) {
    // Adding the if in order to preserve the logic for web after enabling
    // LIB_WILL_INIT action for web in initLib action.
    if (typeof APP === 'undefined') {
        _setLogLevels(lib_jitsi_meet_1.default, getState()['features/base/logging'].config);
    }
    return next(action);
}
/**
 * This feature that the action SET_CONFIG is being
 * dispatched within a specific Redux store.
 *
 * @param {Store} store - The Redux store in which the specified action is being
 * dispatched.
 * @param {Dispatch} next - The Redux dispatch function to dispatch the
 * specified action to the specified store.
 * @param {Action} action - The Redux action SET_CONFIG which is being
 * dispatched in the specified store.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the
 * specified action.
 */
function _setConfig({ dispatch }, next, action) {
    const result = next(action);
    dispatch((0, actions_1.setLoggingConfig)(action.config?.logging));
    return result;
}
/**
 * Notifies the feature base/logging that the action {@link SET_LOGGING_CONFIG}
 * is being dispatched within a specific Redux {@code store}.
 *
 * @param {Store} store - The Redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The Redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The Redux action {@code SET_LOGGING_CONFIG} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the
 * specified {@code action}.
 */
function _setLoggingConfig({ dispatch, getState }, next, action) {
    const result = next(action);
    const newValue = getState()['features/base/logging'].config;
    const isTestingEnabled = (0, functions_2.isTestModeEnabled)(getState());
    // TODO Generally, we'll want to _setLogLevels and _initLogging only if the
    // logging config values actually change.
    // XXX Unfortunately, we don't currently have a (nice) way of determining
    // whether _setLogLevels or _initLogging have been invoked so we have to
    // invoke them unconditionally even if none of the values have actually
    // changed.
    _setLogLevels(logger_1.default, newValue);
    _setLogLevels(lib_jitsi_meet_1.default, newValue);
    _initLogging({
        dispatch,
        getState
    }, newValue, isTestingEnabled);
    return result;
}
/**
 * Sets the log levels of {@link Logger} or {@link JitsiMeetJS} in accord with
 * a specific configuration.
 *
 * @param {Object} logger - The object on which the log levels are to be set.
 * @param {Object} config - The configuration specifying the log levels to be
 * set on {@code Logger} or {@code JitsiMeetJS}.
 * @private
 * @returns {void}
 */
function _setLogLevels(logger, config) {
    // XXX The loggers of the library lib-jitsi-meet and the application
    // jitsi-meet are separate, so the log levels have to be set in both.
    // First, set the default log level.
    logger.setLogLevel(config.defaultLogLevel);
    // Second, set the log level of each logger explicitly overridden by config.
    for (const [id, level] of Object.entries(config.loggers)) {
        logger.setLogLevelById(level, id);
    }
}
