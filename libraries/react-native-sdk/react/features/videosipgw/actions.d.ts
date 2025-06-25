/**
 * Invites room participants to the conference through the SIP Jibri service.
 *
 * @param {JitsiMeetConference} conference - The conference to which the rooms
 * will be invited to.
 * @param {Immutable.List} rooms - The list of the "videosipgw" type items to
 * invite.
 * @returns {void}
 */
export declare function inviteVideoRooms(conference: Object, rooms: Object): {
    type: string;
    conference: Object;
    rooms: Object;
};
