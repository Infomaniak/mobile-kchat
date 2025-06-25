import { IStateful } from '../app/types';
/**
 * Figures out what's the current conference URL which is supposed to indicate what conference is currently active.
 * When not currently in any conference and not trying to join any then 'undefined' is returned.
 *
 * @param {Object|Function} stateful - Either the whole Redux state object or the Redux store's {@code getState} method.
 * @returns {string|undefined}
 * @private
 */
export declare function getCurrentConferenceUrl(stateful: IStateful): string | undefined;
/**
 * Retrieves a simplified version of the conference/location URL stripped of URL params (i.e. Query/search and hash)
 * which should be used for sending invites.
 * NOTE that the method will throw an error if called too early. That is before the conference is joined or before
 * the process of joining one has started. This limitation does not apply to the case when called with the URL object
 * instance. Use {@link isInviteURLReady} to check if it's safe to call the method already.
 *
 * @param {Function|Object} stateOrGetState - The redux state or redux's {@code getState} function or the URL object
 * to be stripped.
 * @returns {string}
 */
export declare function getInviteURL(stateOrGetState: IStateful): string;
/**
 * Checks whether or not is safe to call the {@link getInviteURL} method already.
 *
 * @param {Function|Object} stateOrGetState - The redux state or redux's {@code getState} function.
 * @returns {boolean}
 */
export declare function isInviteURLReady(stateOrGetState: IStateful): boolean;
/**
 * Converts a specific id to jid if it's not jid yet.
 *
 * @param {string} id - User id or jid.
 * @param {Object} configHosts - The {@code hosts} part of the {@code config}
 * object.
 * @returns {string} A string in the form of a JID (i.e.
 * {@code user@server.com}).
 */
export declare function toJid(id: string, { authdomain, domain }: {
    anonymousdomain?: string;
    authdomain?: string;
    domain?: string;
    focus?: string;
    muc?: string;
    visitorFocus?: string;
}): string;
