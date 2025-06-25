import { IReduxState } from '../../app/types';
import { IStateful } from '../app/types';
/**
 * Returns the effective value of a configuration/preference/setting by applying
 * a precedence among the values specified by JWT, URL, settings,
 * and config.
 *
 * @param {Object|Function} stateful - The redux state object or {@code getState} function.
 * @param {string} propertyName - The name of the
 * configuration/preference/setting (property) to retrieve.
 * @param {Object} sources - Flags indicating the configuration/preference/setting sources to
 * consider/retrieve values from.
 * @param {boolean} sources.config - Config.
 * @param {boolean} jwt - JWT.
 * @param {boolean} settings - Settings.
 * @param {boolean} urlParams - URL parameters.
 * @returns {any}
 */
export declare function getPropertyValue(stateful: IStateful, propertyName: string, sources?: any): any;
/**
 * Gets the currently configured server URL.
 *
 * @param {Object|Function} stateful - The redux state object or
 * {@code getState} function.
 * @returns {string} - The currently configured server URL.
 */
export declare function getServerURL(stateful: IStateful): string;
/**
 * Should we hide the helper dialog when a user tries to do audio only screen sharing.
 *
 * @param {Object} state - The state of the application.
 * @returns {boolean}
 */
export declare function shouldHideShareAudioHelper(state: IReduxState): boolean | undefined;
/**
 * Gets the disabled self view setting.
 *
 * @param {Object} state - Redux state.
 * @returns {boolean}
 */
export declare function getHideSelfView(state: IReduxState): boolean;
