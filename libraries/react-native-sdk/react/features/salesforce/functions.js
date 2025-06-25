"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeLinkMeetingRequest = exports.getSessionRecordDetails = exports.searchSessionRecords = exports.getRecentSessionRecords = exports.isSalesforceEnabled = void 0;
const httpUtils_1 = require("../base/util/httpUtils");
const functions_1 = require("../breakout-rooms/functions");
/**
 * Determines whether Salesforce is enabled for the current conference.
 *
 * @param {IReduxState} state - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {boolean}
 */
const isSalesforceEnabled = (state) => {
    const { salesforceUrl } = state['features/base/config'];
    const isBreakoutRoom = (0, functions_1.isInBreakoutRoom)(state);
    return Boolean(salesforceUrl) && !isBreakoutRoom;
};
exports.isSalesforceEnabled = isSalesforceEnabled;
/**
 * Fetches the Salesforce records that were most recently interacted with.
 *
 * @param {string} url - The endpoint for the session records.
 * @param {string} jwt - The JWT needed for authentication.
 * @returns {Promise<any>}
 */
async function getRecentSessionRecords(url, jwt) {
    return (0, httpUtils_1.doGetJSON)(`${url}/records/recents`, true, {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
}
exports.getRecentSessionRecords = getRecentSessionRecords;
/**
 * Fetches the Salesforce records that match the search criteria.
 *
 * @param {string} url - The endpoint for the session records.
 * @param {string} jwt - The JWT needed for authentication.
 * @param {string} text - The search term for the session record to find.
 * @returns {Promise<any>}
 */
async function searchSessionRecords(url, jwt, text) {
    return (0, httpUtils_1.doGetJSON)(`${url}/records?text=${text}`, true, {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
}
exports.searchSessionRecords = searchSessionRecords;
/**
* Fetches the Salesforce record details from the server.
*
* @param {string} url - The endpoint for the record details.
* @param {string} jwt - The JWT needed for authentication.
* @param {Object} item - The item for which details are being retrieved.
* @returns {Promise<any>}
*/
async function getSessionRecordDetails(url, jwt, item) {
    const fullUrl = `${url}/records/${item?.id}?type=${item?.type}`;
    return (0, httpUtils_1.doGetJSON)(fullUrl, true, {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
}
exports.getSessionRecordDetails = getSessionRecordDetails;
/**
* Executes the meeting linking.
*
* @param {string} url - The endpoint for meeting linking.
* @param {string} jwt - The JWT needed for authentication.
* @param {string} sessionId - The ID of the meeting session.
* @param {Object} body - The body of the request.
* @returns {Object}
*/
async function executeLinkMeetingRequest(url, jwt, sessionId, body) {
    const fullUrl = `${url}/sessions/${sessionId}/records/${body.id}`;
    const res = await fetch(fullUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(body)
    });
    const json = await res.json();
    return res.ok ? json : Promise.reject(json);
}
exports.executeLinkMeetingRequest = executeLinkMeetingRequest;
