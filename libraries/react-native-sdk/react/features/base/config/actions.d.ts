import { IStore } from '../../app/types';
import { IConfig } from './configType';
/**
 * Updates the config with new options.
 *
 * @param {Object} config - The new options (to add).
 * @returns {Function}
 */
export declare function updateConfig(config: IConfig): {
    type: string;
    config: IConfig;
};
/**
 * Signals that the configuration (commonly known in Jitsi Meet as config.js)
 * for a specific locationURL will be loaded now.
 *
 * @param {URL} locationURL - The URL of the location which necessitated the
 * loading of a configuration.
 * @param {string} room - The name of the room (conference) for which we're loading the config for.
 * @returns {{
 *     type: CONFIG_WILL_LOAD,
 *     locationURL: URL,
 *     room: string
 * }}
 */
export declare function configWillLoad(locationURL: URL, room: string): {
    type: string;
    locationURL: URL;
    room: string;
};
/**
 * Signals that a configuration (commonly known in Jitsi Meet as config.js)
 * could not be loaded due to a specific error.
 *
 * @param {Error} error - The {@code Error} which prevented the successful
 * loading of a configuration.
 * @param {URL} locationURL - The URL of the location which necessitated the
 * loading of a configuration.
 * @returns {{
 *     type: LOAD_CONFIG_ERROR,
 *     error: Error,
 *     locationURL: URL
 * }}
 */
export declare function loadConfigError(error: Error, locationURL: URL): {
    type: string;
    error: Error;
    locationURL: URL;
};
/**
 * Overwrites some config values.
 *
 * @param {Object} config - The new options (to overwrite).
 * @returns {{
 *     type: OVERWRITE_CONFIG,
 *     config: Object
 * }}
 */
export declare function overwriteConfig(config: Object): {
    type: string;
    config: Object;
};
/**
 * Sets the configuration represented by the feature base/config. The
 * configuration is defined and consumed by the library lib-jitsi-meet but some
 * of its properties are consumed by the application jitsi-meet as well.
 *
 * @param {Object} config - The configuration to be represented by the feature
 * base/config.
 * @param {URL} locationURL - The URL of the location which necessitated the
 * loading of a configuration.
 * @returns {Function}
 */
export declare function setConfig(config: IConfig | undefined, locationURL: URL | undefined): {
    type: string;
    config: IConfig;
};
/**
 * Stores a specific Jitsi Meet config.js object into {@code localStorage}.
 *
 * @param {string} baseURL - The base URL from which the config.js was
 * downloaded.
 * @param {Object} config - The Jitsi Meet config.js to store.
 * @returns {Function}
 */
export declare function storeConfig(baseURL: string, config: Object): (dispatch: IStore['dispatch']) => boolean;
