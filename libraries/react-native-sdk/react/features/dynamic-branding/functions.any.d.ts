import { IReduxState } from '../app/types';
import { IStateful } from '../base/app/types';
/**
 * Extracts the fqn part from a path, where fqn represents
 * tenant/roomName.
 *
 * @param {Object} state - A redux state.
 * @returns {string}
 */
export declare function extractFqnFromPath(state?: IReduxState): string;
/**
 * Returns the url used for fetching dynamic branding.
 *
 * @param {Object | Function} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {string}
 */
export declare function getDynamicBrandingUrl(stateful: IStateful): Promise<string | undefined>;
/**
 * Selector used for getting the load state of the dynamic branding data.
 *
 * @param {Object} state - Global state of the app.
 * @returns {boolean}
 */
export declare function isDynamicBrandingDataLoaded(state: IReduxState): boolean;
/**
 * Fetch SVG XMLs from branding icons urls.
 *
 * @param {Object} customIcons - The map of branded icons.
 * @returns {Object}
 */
export declare const fetchCustomIcons: (customIcons: Record<string, string>) => Promise<Record<string, string>>;
