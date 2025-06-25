import { IReduxState } from '../app/types';
import { IJitsiConference } from '../base/conference/reducer';
/**
 * Returns the vpaas tenant.
 *
 * @param {IReduxState} state - The global state.
 * @returns {string}
 */
export declare function getVpaasTenant(state: IReduxState): string;
/**
 * Returns true if the current meeting is a vpaas one.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
export declare function isVpaasMeeting(state: IReduxState): boolean;
/**
 * Sends a request for retrieving the conference creator's customer id.
 *
 * @param {IJitsiConference} conference - The conference state.
 * @param {IReduxState} state - The state of the app.
 * @returns {Object} - Object containing customerId field.
 */
export declare function sendGetCustomerIdRequest(conference: IJitsiConference, state: IReduxState): Promise<any>;
/**
 * Sends a request for retrieving jaas customer details.
 *
 * @param {Object} reqData - The request info.
 * @param {string} reqData.appId - The client appId.
 * @param {string} reqData.baseUrl - The base url for the request.
 * @returns {void}
 */
export declare function sendGetDetailsRequest({ appId, baseUrl }: {
    appId: string;
    baseUrl: string;
}): Promise<any>;
/**
 * Returns the billing id for vpaas meetings.
 *
 * @param {IReduxState} state - The state of the app.
 * @param {string} feature - Feature to be looked up for disable state.
 * @returns {boolean}
 */
export declare function isFeatureDisabled(state: IReduxState, feature: string): any;
/**
 * Sends a request for retrieving jaas JWT.
 *
 * @param {Object} reqData - The request info.
 * @param {string} reqData.appId - The client appId.
 * @param {string} reqData.baseUrl - The base url for the request.
 * @returns {void}
 */
export declare function sendGetJWTRequest({ appId, baseUrl }: {
    appId: string;
    baseUrl: string;
}): Promise<any>;
/**
 * Gets a jaas JWT.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {string} The JWT.
 */
export declare function getJaasJWT(state: IReduxState): Promise<any>;
