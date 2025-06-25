import { IReduxState } from '../../app/types';
import { IConfig } from './configType';
export { default as getRoomName } from './getRoomName';
/**
 * Create a "fake" configuration object for the given base URL. This is used in case the config
 * couldn't be loaded in the welcome page, so at least we have something to try with.
 *
 * @param {string} baseURL - URL of the deployment for which we want the fake config.
 * @returns {Object}
 */
export declare function createFakeConfig(baseURL: string): {
    hosts: {
        domain: string;
        muc: string;
    };
    bosh: string;
    p2p: {
        enabled: boolean;
    };
};
/**
 * Selector used to get the meeting region.
 *
 * @param {Object} state - The global state.
 * @returns {string}
 */
export declare function getMeetingRegion(state: IReduxState): string;
/**
 * Selector used to get the SSRC-rewriting feature flag.
 *
 * @param {Object} state - The global state.
 * @returns {boolean}
 */
export declare function getSsrcRewritingFeatureFlag(state: IReduxState): never;
/**
 * Selector used to get a feature flag.
 *
 * @param {Object} state - The global state.
 * @param {string} featureFlag - The name of the feature flag.
 * @returns {boolean}
 */
export declare function getFeatureFlag(state: IReduxState, featureFlag: string): never;
/**
 * Selector used to get the disableRemoveRaisedHandOnFocus.
 *
 * @param {Object} state - The global state.
 * @returns {boolean}
 */
export declare function getDisableRemoveRaisedHandOnFocus(state: IReduxState): boolean;
/**
 * Selector used to get the endpoint used for fetching the recording.
 *
 * @param {Object} state - The global state.
 * @returns {string}
 */
export declare function getRecordingSharingUrl(state: IReduxState): string | undefined;
/**
 * Overrides JSON properties in {@code config} and
 * {@code interfaceConfig} Objects with the values from {@code newConfig}.
 * Overrides only the whitelisted keys.
 *
 * @param {Object} config - The config Object in which we'll be overriding
 * properties.
 * @param {Object} interfaceConfig - The interfaceConfig Object in which we'll
 * be overriding properties.
 * @param {Object} json - Object containing configuration properties.
 * Destination object is selected based on root property name:
 * {
 *     config: {
 *         // config.js properties here
 *     },
 *     interfaceConfig: {
 *         // interface_config.js properties here
 *     }
 * }.
 * @returns {void}
 */
export declare function overrideConfigJSON(config: IConfig, interfaceConfig: any, json: any): void;
/**
 * Apply whitelist filtering for configs with whitelists.
 * Only extracts overridden values for keys we allow to be overridden.
 *
 * @param {string} configName - The config name, one of config or interfaceConfig.
 * @param {Object} configJSON - The object with keys and values to override.
 * @returns {Object} - The result object only with the keys
 * that are whitelisted.
 */
export declare function getWhitelistedJSON(configName: 'interfaceConfig' | 'config', configJSON: any): Object;
/**
 * Selector for determining if the display name is read only.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export declare function isNameReadOnly(state: IReduxState): boolean;
/**
 * Selector for determining if the display name is visible.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export declare function isDisplayNameVisible(state: IReduxState): boolean;
/**
 * Restores a Jitsi Meet config.js from {@code localStorage} if it was
 * previously downloaded from a specific {@code baseURL} and stored with
 * {@link storeConfig}.
 *
 * @param {string} baseURL - The base URL from which the config.js was
 * previously downloaded and stored with {@code storeConfig}.
 * @returns {?Object} The Jitsi Meet config.js which was previously downloaded
 * from {@code baseURL} and stored with {@code storeConfig} if it was restored;
 * otherwise, {@code undefined}.
 */
export declare function restoreConfig(baseURL: string): any;
/**
 * Inspects the hash part of the location URI and overrides values specified
 * there in the corresponding config objects given as the arguments. The syntax
 * is: {@code https://server.com/room#config.debug=true
 * &interfaceConfig.showButton=false}.
 *
 * In the hash part each parameter will be parsed to JSON and then the root
 * object will be matched with the corresponding config object given as the
 * argument to this function.
 *
 * @param {Object} config - This is the general config.
 * @param {Object} interfaceConfig - This is the interface config.
 * @param {URI} location - The new location to which the app is navigating to.
 * @returns {void}
 */
export declare function setConfigFromURLParams(config: IConfig, interfaceConfig: any, location: string | URL): void;
/**
 * Returns the dial out url.
 *
 * @param {Object} state - The state of the app.
 * @returns {string}
 */
export declare function getDialOutStatusUrl(state: IReduxState): string | undefined;
/**
 * Returns the dial out status url.
 *
 * @param {Object} state - The state of the app.
 * @returns {string}
 */
export declare function getDialOutUrl(state: IReduxState): string | undefined;
/**
 * Selector to return the security UI config.
 *
 * @param {IReduxState} state - State object.
 * @returns {Object}
 */
export declare function getSecurityUiConfig(state: IReduxState): {
    disableLobbyPassword?: boolean | undefined;
    hideLobbyButton?: boolean | undefined;
};
/**
 * Returns the terms, privacy and help centre URL's.
 *
 * @param {IReduxState} state - The state of the application.
 * @returns {{
 *  privacy: string,
 *  helpCentre: string,
 *  terms: string
 * }}
 */
export declare function getLegalUrls(state: IReduxState): {
    privacy: string;
    helpCentre: string;
    terms: string;
};
