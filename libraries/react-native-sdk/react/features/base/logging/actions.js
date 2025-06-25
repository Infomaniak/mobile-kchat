"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLoggingConfig = exports.setLogCollector = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Stores a {@code Logger.LogCollector} instance which will be uploading logs.
 *
 * @param {Logger.LogCollector} logCollector - The log collector instance to be
 * stored in the Redux state of base/logging feature.
 * @returns {{
 *     type,
 *     logCollector: Object
 * }}
 */
function setLogCollector(logCollector) {
    return {
        type: actionTypes_1.SET_LOG_COLLECTOR,
        logCollector
    };
}
exports.setLogCollector = setLogCollector;
/**
 * Sets the configuration of the feature base/logging.
 *
 * @param {Object} config - The configuration to set on the features
 * base/logging.
 * @returns {{
 *     type: SET_LOGGING_CONFIG,
 *     config: Object
 * }}
 */
function setLoggingConfig(config) {
    return {
        type: actionTypes_1.SET_LOGGING_CONFIG,
        config
    };
}
exports.setLoggingConfig = setLoggingConfig;
