import { IReduxState } from '../../app/types';
import { IConfig, IDeeplinkingConfig } from './configType';
export * from './functions.any';
/**
 * Removes all analytics related options from the given configuration, in case of a libre build.
 *
 * @param {*} _config - The configuration which needs to be cleaned up.
 * @returns {void}
 */
export declare function _cleanupConfig(_config: IConfig): void;
/**
 * Returns the replaceParticipant config.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export declare function getReplaceParticipant(state: IReduxState): string | undefined;
/**
 * Returns the configuration value of web-hid feature.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean} True if web-hid feature should be enabled, otherwise false.
 */
export declare function getWebHIDFeatureConfig(state: IReduxState): boolean;
/**
 * Returns whether audio level measurement is enabled or not.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export declare function areAudioLevelsEnabled(state: IReduxState): boolean;
/**
 * Sets the defaults for deeplinking.
 *
 * @param {IDeeplinkingConfig} deeplinking - The deeplinking config.
 * @returns {void}
 */
export declare function _setDeeplinkingDefaults(deeplinking: IDeeplinkingConfig): void;
