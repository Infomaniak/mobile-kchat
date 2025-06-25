"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteVideoRooms = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Invites room participants to the conference through the SIP Jibri service.
 *
 * @param {JitsiMeetConference} conference - The conference to which the rooms
 * will be invited to.
 * @param {Immutable.List} rooms - The list of the "videosipgw" type items to
 * invite.
 * @returns {void}
 */
function inviteVideoRooms(conference, rooms) {
    return {
        type: actionTypes_1.SIP_GW_INVITE_ROOMS,
        conference,
        rooms
    };
}
exports.inviteVideoRooms = inviteVideoRooms;
