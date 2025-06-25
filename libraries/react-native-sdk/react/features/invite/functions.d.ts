import { IReduxState } from '../app/types';
import { IStateful } from '../base/app/types';
import { IInvitee } from './types';
export declare const sharingFeatures: {
    email: string;
    url: string;
    dialIn: string;
    embed: string;
};
/**
 * Sends an ajax request to check if the phone number can be called.
 *
 * @param {string} dialNumber - The dial number to check for validity.
 * @param {string} dialOutAuthUrl - The endpoint to use for checking validity.
 * @param {string} region - The region we are connected to.
 * @returns {Promise} - The promise created by the request.
 */
export declare function checkDialNumber(dialNumber: string, dialOutAuthUrl: string, region: string): Promise<{
    allow?: boolean;
    country?: string;
    phone?: string;
}>;
/**
 * Sends an ajax request to check if the outbound call is permitted.
 *
 * @param {string} dialOutRegionUrl - The config endpoint.
 * @param {string} jwt - The jwt token.
 * @param {string} appId - The customer id.
 * @param {string} phoneNumber - The destination phone number.
 * @returns {Promise} - The promise created by the request.
 */
export declare function checkOutboundDestination(dialOutRegionUrl: string, jwt: string, appId: string, phoneNumber: string): Promise<any>;
/**
 * Removes all non-numeric characters from a string.
 *
 * @param {string} text - The string from which to remove all characters except
 * numbers.
 * @returns {string} A string with only numbers.
 */
export declare function getDigitsOnly(text?: string): string;
/**
 * Type of the options to use when sending a search query.
 */
export type GetInviteResultsOptions = {
    /**
     * Whether or not to search for people.
     */
    addPeopleEnabled: boolean;
    /**
     * The customer id.
     */
    appId: string;
    /**
     * The endpoint to use for checking phone number validity.
     */
    dialOutAuthUrl: string;
    /**
     * Whether or not to check phone numbers.
     */
    dialOutEnabled: boolean;
    /**
     * The endpoint to use for checking dial permission to an outbound destination.
     */
    dialOutRegionUrl: string;
    /**
     * The jwt token to pass to the search service.
     */
    jwt: string;
    /**
     * Array with the query types that will be executed -
     * "conferenceRooms" | "user" | "room".
     */
    peopleSearchQueryTypes: Array<string>;
    /**
     * The url to query for people.
     */
    peopleSearchUrl: string;
    /**
     * The region we are connected to.
     */
    region: string;
    /**
     * Whether or not to check sip invites.
     */
    sipInviteEnabled: boolean;
};
/**
 * Combines directory search with phone number validation to produce a single
 * set of invite search results.
 *
 * @param {string} query - Text to search.
 * @param {GetInviteResultsOptions} options - Options to use when searching.
 * @returns {Promise<*>}
 */
export declare function getInviteResultsForQuery(query: string, options: GetInviteResultsOptions): Promise<any>;
/**
 * Creates a custom no new lines message for iOS default mail describing how to dial in to the conference.
 *
 * @returns {string}
 */
export declare function getInviteTextiOS({ state, phoneNumber, t }: {
    phoneNumber?: string | null;
    state: IReduxState;
    t?: Function;
}): any;
/**
 * Creates a message describing how to dial in to the conference.
 *
 * @returns {string}
 */
export declare function getInviteText({ state, phoneNumber, t }: {
    phoneNumber?: string | null;
    state: IReduxState;
    t?: Function;
}): any;
/**
 * Helper for determining how many of each type of user is being invited. Used
 * for logging and sending analytics related to invites.
 *
 * @param {Array} inviteItems - An array with the invite items, as created in
 * {@link _parseQueryResults}.
 * @returns {Object} An object with keys as user types and values as the number
 * of invites for that type.
 */
export declare function getInviteTypeCounts(inviteItems?: IInvitee[]): any;
/**
 * Sends a post request to an invite service.
 *
 * @param {string} inviteServiceUrl - The invite service that generates the
 * invitation.
 * @param {string} inviteUrl - The url to the conference.
 * @param {string} jwt - The jwt token to pass to the search service.
 * @param {Immutable.List} inviteItems - The list of the "user" or "room" type
 * items to invite.
 * @returns {Promise} - The promise created by the request.
 */
export declare function invitePeopleAndChatRooms(inviteServiceUrl: string, inviteUrl: string, jwt: string, inviteItems: Array<Object>): Promise<any>;
/**
 * Determines if adding people is currently enabled.
 *
 * @param {IReduxState} state - Current state.
 * @returns {boolean} Indication of whether adding people is currently enabled.
 */
export declare function isAddPeopleEnabled(state: IReduxState): boolean;
/**
 * Determines if dial out is currently enabled or not.
 *
 * @param {IReduxState} state - Current state.
 * @returns {boolean} Indication of whether dial out is currently enabled.
 */
export declare function isDialOutEnabled(state: IReduxState): boolean;
/**
 * Determines if inviting sip endpoints is enabled or not.
 *
 * @param {IReduxState} state - Current state.
 * @returns {boolean} Indication of whether sip invite is currently enabled.
 */
export declare function isSipInviteEnabled(state: IReduxState): boolean;
/**
 * Sends an ajax request to a directory service.
 *
 * @param {string} serviceUrl - The service to query.
 * @param {string} jwt - The jwt token to pass to the search service.
 * @param {string} text - Text to search.
 * @param {Array<string>} queryTypes - Array with the query types that will be
 * executed - "conferenceRooms" | "user" | "room".
 * @returns {Promise} - The promise created by the request.
 */
export declare function searchDirectory(// eslint-disable-line max-params
serviceUrl: string, jwt: string, text: string, queryTypes?: Array<string>): Promise<Array<{
    type: string;
}>>;
/**
 * Returns descriptive text that can be used to invite participants to a meeting
 * (share via mobile or use it for calendar event description).
 *
 * @param {IReduxState} state - The current state.
 * @param {string} inviteUrl - The conference/location URL.
 * @param {boolean} useHtml - Whether to return html text.
 * @param {boolean} skipDialIn - Whether to skip dial-in options or not.
 * @returns {Promise<string>} A {@code Promise} resolving with a
 * descriptive text that can be used to invite participants to a meeting.
 */
export declare function getShareInfoText(state: IReduxState, inviteUrl: string, useHtml?: boolean, skipDialIn?: boolean): Promise<string>;
/**
 * Generates the URL for the static dial in info page.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @param {string?} roomName - The conference name. Optional name, if missing will be extracted from state.
 * @returns {string}
 */
export declare function getDialInfoPageURL(state: IReduxState, roomName?: string): string;
/**
 * Generates the URL for the static dial in info page.
 *
 * @param {string} uri - The conference URI string.
 * @returns {string}
 */
export declare function getDialInfoPageURLForURIString(uri?: string): string | undefined;
/**
 * Returns whether or not dial-in related UI should be displayed.
 *
 * @param {Object} dialIn - Dial in information.
 * @returns {boolean}
 */
export declare function shouldDisplayDialIn(dialIn: any): boolean;
/**
 * Returns if multiple dial-in numbers are available.
 *
 * @param {Array<string>|Object} dialInNumbers - The array or object of
 * numbers to check.
 * @private
 * @returns {boolean}
 */
export declare function hasMultipleNumbers(dialInNumbers?: {
    numbers: Object;
} | string[]): boolean;
/**
 * Sets the internal state of which dial-in number to display.
 *
 * @param {Array<string>|Object} dialInNumbers - The array or object of
 * numbers to choose a number from.
 * @private
 * @returns {string|null}
 */
export declare function _getDefaultPhoneNumber(dialInNumbers?: {
    numbers: any;
} | Array<{
    default: string;
    formattedNumber: string;
}>): string | null;
/**
 * Decodes URI only if doesn't contain a space(' ').
 *
 * @param {string} url - The string to decode.
 * @returns {string} - It the string contains space, encoded value is '%20' returns
 * same string, otherwise decoded one.
 * @private
 */
export declare function _decodeRoomURI(url: string): string;
/**
 * Returns the stored conference id.
 *
 * @param {IStateful} stateful - The Object or Function that can be
 * resolved to a Redux state object with the toState function.
 * @returns {string}
 */
export declare function getConferenceId(stateful: IStateful): string | number | undefined;
/**
 * Returns the default dial in number from the store.
 *
 * @param {IStateful} stateful - The Object or Function that can be
 * resolved to a Redux state object with the toState function.
 * @returns {string | null}
 */
export declare function getDefaultDialInNumber(stateful: IStateful): string | null;
/**
 * Executes the dial out request.
 *
 * @param {string} url - The url for dialing out.
 * @param {Object} body - The body of the request.
 * @param {string} reqId - The unique request id.
 * @returns {Object}
 */
export declare function executeDialOutRequest(url: string, body: Object, reqId: string): Promise<any>;
/**
 * Executes the dial out status request.
 *
 * @param {string} url - The url for dialing out.
 * @param {string} reqId - The unique request id used on the dial out request.
 * @returns {Object}
 */
export declare function executeDialOutStatusRequest(url: string, reqId: string): Promise<any>;
/**
 * Returns true if a specific sharing feature is enabled in interface configuration.
 *
 * @param {string} sharingFeature - The sharing feature to check.
 * @returns {boolean}
 */
export declare function isSharingEnabled(sharingFeature: string): any;
/**
 * Sends a post request to an invite service.
 *
 * @param {Array} inviteItems - The list of the "sip" type items to invite.
 * @param {URL} locationURL - The URL of the location.
 * @param {string} sipInviteUrl - The invite service that generates the invitation.
 * @param {string} jwt - The jwt token.
 * @param {string} roomName - The name to the conference.
 * @param {string} roomPassword - The password of the conference.
 * @param {string} displayName - The user display name.
 * @returns {Promise} - The promise created by the request.
 */
export declare function inviteSipEndpoints(// eslint-disable-line max-params
inviteItems: Array<{
    address: string;
}>, locationURL: URL, sipInviteUrl: string, jwt: string, roomName: string, roomPassword: String, displayName: string): Promise<any>;
