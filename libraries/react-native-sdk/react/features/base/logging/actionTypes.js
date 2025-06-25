"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_LOGGING_CONFIG = exports.SET_LOG_COLLECTOR = void 0;
/**
 * The type of redux action which stores the log collector that will be
 * submitting the logs to a service
 *
 * {
 *     type: SET_LOG_COLLECTOR,
 *     logCollector: Logger.LogCollector
 * }
 */
exports.SET_LOG_COLLECTOR = 'SET_LOG_COLLECTOR';
/**
 * The type of redux action which sets the configuration of the feature
 * base/logging.
 *
 * {
 *     type: SET_LOGGING_CONFIG,
 *     config: Object
 * }
 */
exports.SET_LOGGING_CONFIG = 'SET_LOGGING_CONFIG';
