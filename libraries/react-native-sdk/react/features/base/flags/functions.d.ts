import { IStateful } from '../app/types';
/**
 * Gets the value of a specific feature flag.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @param {string} flag - The name of the React {@code Component} prop of
 * the currently mounted {@code App} to get.
 * @param {*} defaultValue - A default value for the flag, in case it's not defined.
 * @returns {*} The value of the specified React {@code Component} prop of the
 * currently mounted {@code App}.
 */
export declare function getFeatureFlag(stateful: IStateful, flag: string, defaultValue?: boolean | string): any;
