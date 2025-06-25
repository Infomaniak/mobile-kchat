import { IStore } from '../app/types';
/**
 * Sends an event through the lib-jitsi-meet AnalyticsAdapter interface.
 *
 * @param {Object} event - The event to send. It should be formatted as
 * described in AnalyticsAdapter.js in lib-jitsi-meet.
 * @returns {void}
 */
export declare function sendAnalytics(event: Object): void;
/**
 * Return saved amplitude identity info such as session id, device id and user id. We assume these do not change for
 * the duration of the conference.
 *
 * @returns {Object}
 */
export declare function getAmplitudeIdentity(): any;
/**
 * Resets the analytics adapter to its initial state - removes handlers, cache,
 * disabled state, etc.
 *
 * @returns {void}
 */
export declare function resetAnalytics(): void;
/**
 * Creates the analytics handlers.
 *
 * @param {Store} store - The redux store in which the specified {@code action} is being dispatched.
 * @returns {Promise} Resolves with the handlers that have been successfully loaded.
 */
export declare function createHandlers({ getState }: IStore): Promise<any[]>;
/**
 * Inits JitsiMeetJS.analytics by setting permanent properties and setting the handlers from the loaded scripts.
 * NOTE: Has to be used after JitsiMeetJS.init. Otherwise analytics will be null.
 *
 * @param {Store} store - The redux store in which the specified {@code action} is being dispatched.
 * @param {Array<Object>} handlers - The analytics handlers.
 * @returns {boolean} - True if the analytics were successfully initialized and false otherwise.
 */
export declare function initAnalytics(store: IStore, handlers: Array<Object>): boolean;
