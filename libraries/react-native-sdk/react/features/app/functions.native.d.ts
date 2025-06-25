import { IStateful } from '../base/app/types';
export * from './functions.any';
/**
 * Retrieves the default URL for the app. This can either come from a prop to
 * the root App component or be configured in the settings.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {string} - Default URL for the app.
 */
export declare function getDefaultURL(stateful: IStateful): string;
/**
 * Returns application name.
 *
 * @returns {string} The application name.
 */
export declare function getName(): any;
/**
 * Returns the path to the Jitsi Meet SDK bundle on iOS. On Android it will be
 * undefined.
 *
 * @returns {string|undefined}
 */
export declare function getSdkBundlePath(): any;
