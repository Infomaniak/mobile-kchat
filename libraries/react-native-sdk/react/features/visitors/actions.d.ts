import { IStore } from '../app/types';
import { IPromotionRequest } from './types';
/**
 * Action used to admit multiple participants in the conference.
 *
 * @param {Array<Object>} requests - A list of visitors requests.
 * @returns {Function}
 */
export declare function admitMultiple(requests: Array<IPromotionRequest>): Function;
/**
 * Approves the request of a visitor to join the main meeting.
 *
 * @param {IPromotionRequest} request - The request from the visitor.
 * @returns {Function}
 */
export declare function approveRequest(request: IPromotionRequest): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Denies the request of a visitor to join the main meeting.
 *
 * @param {IPromotionRequest} request - The request from the visitor.
 * @returns {Function}
 */
export declare function denyRequest(request: IPromotionRequest): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sends a demote request to a main participant to join the meeting as a visitor.
 *
 * @param {string} id - The ID for the participant.
 * @returns {Function}
 */
export declare function demoteRequest(id: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Removes a promotion request from the state.
 *
 * @param {IPromotionRequest} request - The request.
 * @returns {{
 *     type: CLEAR_VISITOR_PROMOTION_REQUEST,
 *     request: IPromotionRequest
 * }}
 */
export declare function clearPromotionRequest(request: IPromotionRequest): {
    type: string;
    request: IPromotionRequest;
};
/**
 * Visitor has sent us a promotion request.
 *
 * @param {IPromotionRequest} request - The request.
 * @returns {{
 *     type: VISITOR_PROMOTION_REQUEST,
 * }}
 */
export declare function promotionRequestReceived(request: IPromotionRequest): {
    type: string;
    request: IPromotionRequest;
};
/**
 * Sets Visitors mode on or off.
 *
 * @param {boolean} enabled - The new visitors mode state.
 * @returns {{
 *     type: I_AM_VISITOR_MODE,
 * }}
 */
export declare function setIAmVisitor(enabled: boolean): {
    type: string;
    enabled: boolean;
};
/**
 * Sets visitor demote actor.
 *
 * @param {string|undefined} displayName - The display name of the participant.
 * @returns {{
 *     type: SET_VISITOR_DEMOTE_ACTOR,
 * }}
 */
export declare function setVisitorDemoteActor(displayName: string | undefined): {
    type: string;
    displayName: string | undefined;
};
/**
 * Visitors count has been updated.
 *
 * @param {boolean} value - The new value whether visitors are supported.
 * @returns {{
 *     type: SET_VISITORS_SUPPORTED,
 * }}
 */
export declare function setVisitorsSupported(value: boolean): {
    type: string;
    value: boolean;
};
/**
 * Visitors count has been updated.
 *
 * @param {number} count - The new visitors count.
 * @returns {{
 *     type: UPDATE_VISITORS_COUNT,
 * }}
 */
export declare function updateVisitorsCount(count: number): {
    type: string;
    count: number;
};
