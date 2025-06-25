import { IReduxState } from '../app/types';
/**
 * Determines whether Salesforce is enabled for the current conference.
 *
 * @param {IReduxState} state - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {boolean}
 */
export declare const isSalesforceEnabled: (state: IReduxState) => boolean;
/**
 * Fetches the Salesforce records that were most recently interacted with.
 *
 * @param {string} url - The endpoint for the session records.
 * @param {string} jwt - The JWT needed for authentication.
 * @returns {Promise<any>}
 */
export declare function getRecentSessionRecords(url: string, jwt: string): Promise<any>;
/**
 * Fetches the Salesforce records that match the search criteria.
 *
 * @param {string} url - The endpoint for the session records.
 * @param {string} jwt - The JWT needed for authentication.
 * @param {string} text - The search term for the session record to find.
 * @returns {Promise<any>}
 */
export declare function searchSessionRecords(url: string, jwt: string, text: string): Promise<any>;
/**
* Fetches the Salesforce record details from the server.
*
* @param {string} url - The endpoint for the record details.
* @param {string} jwt - The JWT needed for authentication.
* @param {Object} item - The item for which details are being retrieved.
* @returns {Promise<any>}
*/
export declare function getSessionRecordDetails(url: string, jwt: string, item: {
    id: string;
    type: string;
} | null): Promise<any>;
/**
* Executes the meeting linking.
*
* @param {string} url - The endpoint for meeting linking.
* @param {string} jwt - The JWT needed for authentication.
* @param {string} sessionId - The ID of the meeting session.
* @param {Object} body - The body of the request.
* @returns {Object}
*/
export declare function executeLinkMeetingRequest(url: string, jwt: string, sessionId: String, body: {
    id?: string;
    notes: string;
    type?: string;
}): Promise<any>;
