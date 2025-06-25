import { IReduxState, IStore } from '../app/types';
import { IStateful } from '../base/app/types';
export * from './functions.any';
/**
 * Adds a Jitsi link to a calendar entry.
 *
 * @param {Object} state - The Redux state.
 * @param {string} id - The ID of the calendar entry.
 * @param {string} link - The link to add info with.
 * @returns {Promise<*>}
 */
export declare function addLinkToCalendarEntry(state: IReduxState, id: string, link: string): Promise<any>;
/**
 * Determines whether the calendar feature is enabled by the app. For
 * example, Apple through its App Store requires
 * {@code NSCalendarsUsageDescription} in the app's Info.plist or App Store
 * rejects the app. It could also be disabled with a feature flag.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {boolean} If the app has enabled the calendar feature, {@code true};
 * otherwise, {@code false}.
 */
export declare function isCalendarEnabled(stateful: IStateful): any;
/**
 * Reads the user's calendar and updates the stored entries if need be.
 *
 * @param {Object} store - The redux store.
 * @param {boolean} maybePromptForPermission - Flag to tell the app if it should
 * prompt for a calendar permission if it wasn't granted yet.
 * @param {boolean|undefined} forcePermission - Whether to force to re-ask for
 * the permission or not.
 * @private
 * @returns {void}
 */
export declare function _fetchCalendarEntries(store: IStore, maybePromptForPermission: boolean, forcePermission?: boolean): void;
