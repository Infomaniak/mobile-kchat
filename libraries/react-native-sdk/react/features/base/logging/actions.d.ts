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
export declare function setLogCollector(logCollector?: Object): {
    type: string;
    logCollector: Object | undefined;
};
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
export declare function setLoggingConfig(config: Object): {
    type: string;
    config: Object;
};
