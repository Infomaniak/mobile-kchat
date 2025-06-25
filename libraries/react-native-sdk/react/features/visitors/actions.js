"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVisitorsCount = exports.setVisitorsSupported = exports.setVisitorDemoteActor = exports.setIAmVisitor = exports.promotionRequestReceived = exports.clearPromotionRequest = exports.demoteRequest = exports.denyRequest = exports.approveRequest = exports.admitMultiple = void 0;
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const functions_2 = require("../base/conference/functions");
const actions_1 = require("../base/connection/actions");
const functions_3 = require("../base/participants/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * Action used to admit multiple participants in the conference.
 *
 * @param {Array<Object>} requests - A list of visitors requests.
 * @returns {Function}
 */
function admitMultiple(requests) {
    return (dispatch, getState) => {
        const conference = (0, functions_2.getCurrentConference)(getState);
        conference?.sendMessage({
            type: 'visitors',
            action: 'promotion-response',
            approved: true,
            ids: requests.map(r => r.from)
        });
    };
}
exports.admitMultiple = admitMultiple;
/**
 * Approves the request of a visitor to join the main meeting.
 *
 * @param {IPromotionRequest} request - The request from the visitor.
 * @returns {Function}
 */
function approveRequest(request) {
    return (dispatch, getState) => {
        const conference = (0, functions_2.getCurrentConference)(getState);
        conference?.sendMessage({
            type: 'visitors',
            action: 'promotion-response',
            approved: true,
            id: request.from
        });
        dispatch(clearPromotionRequest(request));
    };
}
exports.approveRequest = approveRequest;
/**
 * Denies the request of a visitor to join the main meeting.
 *
 * @param {IPromotionRequest} request - The request from the visitor.
 * @returns {Function}
 */
function denyRequest(request) {
    return (dispatch, getState) => {
        const conference = (0, functions_2.getCurrentConference)(getState);
        conference?.sendMessage({
            type: 'visitors',
            action: 'promotion-response',
            approved: false,
            id: request.from
        });
        dispatch(clearPromotionRequest(request));
    };
}
exports.denyRequest = denyRequest;
/**
 * Sends a demote request to a main participant to join the meeting as a visitor.
 *
 * @param {string} id - The ID for the participant.
 * @returns {Function}
 */
function demoteRequest(id) {
    return (dispatch, getState) => {
        const conference = (0, functions_2.getCurrentConference)(getState);
        const localParticipant = (0, functions_3.getLocalParticipant)(getState());
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRemoteVideoMenuButtonEvent)('demote.button', { 'participant_id': id }));
        if (id === localParticipant?.id) {
            dispatch((0, actions_1.disconnect)(true))
                .then(() => dispatch((0, actions_1.setPreferVisitor)(true)))
                .then(() => dispatch((0, actions_1.connect)()));
        }
        else {
            conference?.sendMessage({
                type: 'visitors',
                action: 'demote-request',
                id,
                actor: localParticipant?.id
            });
        }
    };
}
exports.demoteRequest = demoteRequest;
/**
 * Removes a promotion request from the state.
 *
 * @param {IPromotionRequest} request - The request.
 * @returns {{
 *     type: CLEAR_VISITOR_PROMOTION_REQUEST,
 *     request: IPromotionRequest
 * }}
 */
function clearPromotionRequest(request) {
    return {
        type: actionTypes_1.CLEAR_VISITOR_PROMOTION_REQUEST,
        request
    };
}
exports.clearPromotionRequest = clearPromotionRequest;
/**
 * Visitor has sent us a promotion request.
 *
 * @param {IPromotionRequest} request - The request.
 * @returns {{
 *     type: VISITOR_PROMOTION_REQUEST,
 * }}
 */
function promotionRequestReceived(request) {
    return {
        type: actionTypes_1.VISITOR_PROMOTION_REQUEST,
        request
    };
}
exports.promotionRequestReceived = promotionRequestReceived;
/**
 * Sets Visitors mode on or off.
 *
 * @param {boolean} enabled - The new visitors mode state.
 * @returns {{
 *     type: I_AM_VISITOR_MODE,
 * }}
 */
function setIAmVisitor(enabled) {
    return {
        type: actionTypes_1.I_AM_VISITOR_MODE,
        enabled
    };
}
exports.setIAmVisitor = setIAmVisitor;
/**
 * Sets visitor demote actor.
 *
 * @param {string|undefined} displayName - The display name of the participant.
 * @returns {{
 *     type: SET_VISITOR_DEMOTE_ACTOR,
 * }}
 */
function setVisitorDemoteActor(displayName) {
    return {
        type: actionTypes_1.SET_VISITOR_DEMOTE_ACTOR,
        displayName
    };
}
exports.setVisitorDemoteActor = setVisitorDemoteActor;
/**
 * Visitors count has been updated.
 *
 * @param {boolean} value - The new value whether visitors are supported.
 * @returns {{
 *     type: SET_VISITORS_SUPPORTED,
 * }}
 */
function setVisitorsSupported(value) {
    return {
        type: actionTypes_1.SET_VISITORS_SUPPORTED,
        value
    };
}
exports.setVisitorsSupported = setVisitorsSupported;
/**
 * Visitors count has been updated.
 *
 * @param {number} count - The new visitors count.
 * @returns {{
 *     type: UPDATE_VISITORS_COUNT,
 * }}
 */
function updateVisitorsCount(count) {
    return {
        type: actionTypes_1.UPDATE_VISITORS_COUNT,
        count
    };
}
exports.updateVisitorsCount = updateVisitorsCount;
