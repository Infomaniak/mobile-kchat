import { IReduxState } from '../../app/types';
import { IConfig, IDeeplinkingConfig } from './configType';
export * from './functions.any';
/**
 * Removes all analytics related options from the given configuration, in case of a libre build.
 *
 * @param {*} config - The configuration which needs to be cleaned up.
 * @returns {void}
 */
export declare function _cleanupConfig(config: IConfig): void;
/**
 * Returns the replaceParticipant config.
 *
 * @param {Object} state - The state of the app.
 * @returns {boolean}
 */
export declare function getReplaceParticipant(state: IReduxState): string;
/**
 * Sets the defaults for deeplinking.
 *
 * @param {IDeeplinkingConfig} _deeplinking - The deeplinking config.
 * @returns {void}
 */
export declare function _setDeeplinkingDefaults(_deeplinking: IDeeplinkingConfig): void;
