"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePendingInviteRequests = exports.addPendingInviteRequest = exports.setCalleeInfoVisible = exports.updateDialInNumbers = exports.invite = exports.hideAddPeopleDialog = exports.beginAddPeople = void 0;
const functions_1 = require("../base/connection/functions");
const functions_2 = require("../base/participants/functions");
const actions_1 = require("../videosipgw/actions");
const _utils_1 = require("./_utils");
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
const functions_3 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Creates a (redux) action to signal that a click/tap has been performed on
 * {@link InviteButton} and that the execution flow for adding/inviting people
 * to the current conference/meeting is to begin.
 *
 * @returns {{
 *     type: BEGIN_ADD_PEOPLE
 * }}
 */
function beginAddPeople() {
    return {
        type: actionTypes_1.BEGIN_ADD_PEOPLE
    };
}
exports.beginAddPeople = beginAddPeople;
/**
 * Creates a (redux) action to signal that the {@code AddPeopleDialog}
 * should close.
 *
 * @returns {{
 *     type: HIDE_ADD_PEOPLE_DIALOG
 * }}
 */
function hideAddPeopleDialog() {
    return {
        type: actionTypes_1.HIDE_ADD_PEOPLE_DIALOG
    };
}
exports.hideAddPeopleDialog = hideAddPeopleDialog;
/**
 * Invites (i.e. Sends invites to) an array of invitees (which may be a
 * combination of users, rooms, phone numbers, and video rooms.
 *
 * @param  {Array<Object>} invitees - The recipients to send invites to.
 * @param  {Array<Object>} showCalleeInfo - Indicates whether the
 * {@code CalleeInfo} should be displayed or not.
 * @returns {Promise<Array<Object>>} A {@code Promise} resolving with an array
 * of invitees who were not invited (i.e. Invites were not sent to them).
 */
function invite(invitees, showCalleeInfo = false) {
    return (dispatch, getState) => {
        const state = getState();
        const participantsCount = (0, functions_2.getParticipantCount)(state);
        const { calleeInfoVisible } = state['features/invite'];
        if (showCalleeInfo
            && !calleeInfoVisible
            && invitees.length === 1
            && invitees[0].type === constants_1.INVITE_TYPES.USER
            && participantsCount === 1) {
            dispatch(setCalleeInfoVisible(true, invitees[0]));
        }
        const { conference, password } = state['features/base/conference'];
        if (typeof conference === 'undefined') {
            // Invite will fail before CONFERENCE_JOIN. The request will be
            // cached in order to be executed on CONFERENCE_JOIN.
            return new Promise(resolve => {
                dispatch(addPendingInviteRequest({
                    invitees,
                    callback: (failedInvitees) => resolve(failedInvitees)
                }));
            });
        }
        let allInvitePromises = [];
        let invitesLeftToSend = [...invitees];
        const { callFlowsEnabled, inviteServiceUrl, inviteServiceCallFlowsUrl } = state['features/base/config'];
        const inviteUrl = (0, functions_1.getInviteURL)(state);
        const { sipInviteUrl } = state['features/base/config'];
        const { locationURL } = state['features/base/connection'];
        const { jwt = '' } = state['features/base/jwt'];
        const { name: displayName } = (0, functions_2.getLocalParticipant)(state) ?? {};
        // First create all promises for dialing out.
        const phoneNumbers = invitesLeftToSend.filter(({ type }) => type === constants_1.INVITE_TYPES.PHONE);
        // For each number, dial out. On success, remove the number from
        // {@link invitesLeftToSend}.
        const phoneInvitePromises = phoneNumbers.map(item => {
            const numberToInvite = item.number;
            return conference.dial(numberToInvite)
                .then(() => {
                invitesLeftToSend
                    = invitesLeftToSend.filter(invitee => invitee !== item);
            })
                .catch((error) => logger_1.default.error('Error inviting phone number:', error));
        });
        allInvitePromises = allInvitePromises.concat(phoneInvitePromises);
        const usersAndRooms = invitesLeftToSend.filter(({ type }) => [constants_1.INVITE_TYPES.USER, constants_1.INVITE_TYPES.ROOM].includes(type));
        if (usersAndRooms.length) {
            // Send a request to invite all the rooms and users. On success,
            // filter all rooms and users from {@link invitesLeftToSend}.
            const peopleInvitePromise = (0, functions_3.invitePeopleAndChatRooms)((callFlowsEnabled
                ? inviteServiceCallFlowsUrl : inviteServiceUrl) ?? '', inviteUrl, jwt, usersAndRooms)
                .then(() => {
                invitesLeftToSend
                    = invitesLeftToSend.filter(({ type }) => ![constants_1.INVITE_TYPES.USER, constants_1.INVITE_TYPES.ROOM].includes(type));
            })
                .catch(error => {
                dispatch(setCalleeInfoVisible(false));
                logger_1.default.error('Error inviting people:', error);
            });
            allInvitePromises.push(peopleInvitePromise);
        }
        // Sipgw calls are fire and forget. Invite them to the conference, then
        // immediately remove them from invitesLeftToSend.
        const vrooms = invitesLeftToSend.filter(({ type }) => type === constants_1.INVITE_TYPES.VIDEO_ROOM);
        conference
            && vrooms.length > 0
            && dispatch((0, actions_1.inviteVideoRooms)(conference, vrooms));
        invitesLeftToSend
            = invitesLeftToSend.filter(({ type }) => type !== constants_1.INVITE_TYPES.VIDEO_ROOM);
        const sipEndpoints = invitesLeftToSend.filter(({ type }) => type === constants_1.INVITE_TYPES.SIP);
        conference && (0, functions_3.inviteSipEndpoints)(sipEndpoints, 
        // @ts-ignore
        locationURL, sipInviteUrl, jwt, conference.options.name, password, displayName);
        invitesLeftToSend
            = invitesLeftToSend.filter(({ type }) => type !== constants_1.INVITE_TYPES.SIP);
        return (Promise.all(allInvitePromises)
            .then(() => invitesLeftToSend));
    };
}
exports.invite = invite;
/**
 * Sends AJAX requests for dial-in numbers and conference ID.
 *
 * @returns {Function}
 */
function updateDialInNumbers() {
    return (dispatch, getState) => {
        const state = getState();
        const { dialInConfCodeUrl, dialInNumbersUrl, hosts } = state['features/base/config'];
        const { numbersFetched } = state['features/invite'];
        const mucURL = hosts?.muc;
        if (numbersFetched || !dialInConfCodeUrl || !dialInNumbersUrl || !mucURL) {
            // URLs for fetching dial in numbers not defined
            return;
        }
        const { locationURL = {} } = state['features/base/connection'];
        const { room = '' } = state['features/base/conference'];
        Promise.all([
            (0, _utils_1.getDialInNumbers)(dialInNumbersUrl, room, mucURL),
            (0, _utils_1.getDialInConferenceID)(dialInConfCodeUrl, room, mucURL, locationURL)
        ])
            .then(([dialInNumbers, { conference, id, message, sipUri }]) => {
            if (!conference || !id) {
                return Promise.reject(message);
            }
            dispatch({
                type: actionTypes_1.UPDATE_DIAL_IN_NUMBERS_SUCCESS,
                conferenceID: id,
                dialInNumbers,
                sipUri
            });
        })
            .catch(error => {
            dispatch({
                type: actionTypes_1.UPDATE_DIAL_IN_NUMBERS_FAILED,
                error
            });
        });
    };
}
exports.updateDialInNumbers = updateDialInNumbers;
/**
 * Sets the visibility of {@code CalleeInfo}.
 *
 * @param {boolean|undefined} [calleeInfoVisible] - If {@code CalleeInfo} is
 * to be displayed/visible, then {@code true}; otherwise, {@code false} or
 * {@code undefined}.
 * @param {Object|undefined} [initialCalleeInfo] - Callee information.
 * @returns {{
 *     type: SET_CALLEE_INFO_VISIBLE,
 *     calleeInfoVisible: (boolean|undefined),
 *     initialCalleeInfo
 * }}
 */
function setCalleeInfoVisible(calleeInfoVisible, initialCalleeInfo) {
    return {
        type: actionTypes_1.SET_CALLEE_INFO_VISIBLE,
        calleeInfoVisible,
        initialCalleeInfo
    };
}
exports.setCalleeInfoVisible = setCalleeInfoVisible;
/**
 * Adds pending invite request.
 *
 * @param {Object} request - The request.
 * @returns {{
 *     type: ADD_PENDING_INVITE_REQUEST,
 *     request: Object
 * }}
 */
function addPendingInviteRequest(request) {
    return {
        type: actionTypes_1.ADD_PENDING_INVITE_REQUEST,
        request
    };
}
exports.addPendingInviteRequest = addPendingInviteRequest;
/**
 * Removes all pending invite requests.
 *
 * @returns {{
 *     type: REMOVE_PENDING_INVITE_REQUEST
 * }}
 */
function removePendingInviteRequests() {
    return {
        type: actionTypes_1.REMOVE_PENDING_INVITE_REQUESTS
    };
}
exports.removePendingInviteRequests = removePendingInviteRequests;
