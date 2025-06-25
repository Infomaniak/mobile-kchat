"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveToRoom = exports.sendParticipantToRoom = exports.autoAssignToBreakoutRooms = exports.removeBreakoutRoom = exports.renameBreakoutRoom = exports.closeBreakoutRoom = exports.createBreakoutRoom = void 0;
const i18next_1 = __importDefault(require("i18next"));
const lodash_1 = __importDefault(require("lodash"));
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const actions_1 = require("../base/conference/actions");
const constants_1 = require("../base/conference/constants");
const functions_2 = require("../base/conference/functions");
const actions_2 = require("../base/media/actions");
const constants_2 = require("../base/media/constants");
const functions_3 = require("../base/participants/functions");
const actions_3 = require("../base/tracks/actions");
const functions_4 = require("../base/tracks/functions");
const actions_4 = require("../notifications/actions");
const constants_3 = require("../notifications/constants");
const actionTypes_1 = require("./actionTypes");
const constants_4 = require("./constants");
const functions_5 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Action to create a breakout room.
 *
 * @param {string} name - Name / subject for the breakout room.
 * @returns {Function}
 */
function createBreakoutRoom(name) {
    return (dispatch, getState) => {
        const state = getState();
        let { roomCounter } = state[constants_4.FEATURE_KEY];
        const subject = name || i18next_1.default.t('breakoutRooms.defaultName', { index: ++roomCounter });
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createBreakoutRoomsEvent)('create'));
        dispatch({
            type: actionTypes_1._UPDATE_ROOM_COUNTER,
            roomCounter
        });
        (0, functions_2.getCurrentConference)(state)?.getBreakoutRooms()
            ?.createBreakoutRoom(subject);
    };
}
exports.createBreakoutRoom = createBreakoutRoom;
/**
 * Action to close a room and send participants to the main room.
 *
 * @param {string} roomId - The id of the room to close.
 * @returns {Function}
 */
function closeBreakoutRoom(roomId) {
    return (dispatch, getState) => {
        const rooms = (0, functions_5.getBreakoutRooms)(getState);
        const room = rooms[roomId];
        const mainRoom = (0, functions_5.getMainRoom)(getState);
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createBreakoutRoomsEvent)('close'));
        if (room && mainRoom) {
            Object.values(room.participants).forEach(p => {
                dispatch(sendParticipantToRoom(p.jid, mainRoom.id));
            });
        }
    };
}
exports.closeBreakoutRoom = closeBreakoutRoom;
/**
 * Action to rename a breakout room.
 *
 * @param {string} breakoutRoomJid - The jid of the breakout room to rename.
 * @param {string} name - New name / subject for the breakout room.
 * @returns {Function}
 */
function renameBreakoutRoom(breakoutRoomJid, name = '') {
    return (_dispatch, getState) => {
        const trimmedName = name.trim();
        if (trimmedName.length !== 0) {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createBreakoutRoomsEvent)('rename'));
            (0, functions_2.getCurrentConference)(getState)?.getBreakoutRooms()
                ?.renameBreakoutRoom(breakoutRoomJid, trimmedName);
        }
    };
}
exports.renameBreakoutRoom = renameBreakoutRoom;
/**
 * Action to remove a breakout room.
 *
 * @param {string} breakoutRoomJid - The jid of the breakout room to remove.
 * @returns {Function}
 */
function removeBreakoutRoom(breakoutRoomJid) {
    return (dispatch, getState) => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createBreakoutRoomsEvent)('remove'));
        const room = (0, functions_5.getRoomByJid)(getState, breakoutRoomJid);
        if (!room) {
            logger_1.default.error('The room to remove was not found.');
            return;
        }
        if (Object.keys(room.participants).length > 0) {
            dispatch(closeBreakoutRoom(room.id));
        }
        (0, functions_2.getCurrentConference)(getState)?.getBreakoutRooms()
            ?.removeBreakoutRoom(breakoutRoomJid);
    };
}
exports.removeBreakoutRoom = removeBreakoutRoom;
/**
 * Action to auto-assign the participants to breakout rooms.
 *
 * @returns {Function}
 */
function autoAssignToBreakoutRooms() {
    return (dispatch, getState) => {
        const rooms = (0, functions_5.getBreakoutRooms)(getState);
        const breakoutRooms = lodash_1.default.filter(rooms, room => !room.isMainRoom);
        if (breakoutRooms) {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createBreakoutRoomsEvent)('auto.assign'));
            const participantIds = Array.from((0, functions_3.getRemoteParticipants)(getState).keys());
            const length = Math.ceil(participantIds.length / breakoutRooms.length);
            lodash_1.default.chunk(lodash_1.default.shuffle(participantIds), length).forEach((group, index) => group.forEach(participantId => {
                dispatch(sendParticipantToRoom(participantId, breakoutRooms[index].id));
            }));
        }
    };
}
exports.autoAssignToBreakoutRooms = autoAssignToBreakoutRooms;
/**
 * Action to send a participant to a room.
 *
 * @param {string} participantId - The participant id.
 * @param {string} roomId - The room id.
 * @returns {Function}
 */
function sendParticipantToRoom(participantId, roomId) {
    return (dispatch, getState) => {
        const rooms = (0, functions_5.getBreakoutRooms)(getState);
        const room = rooms[roomId];
        if (!room) {
            logger_1.default.warn(`Invalid room: ${roomId}`);
            return;
        }
        // Get the full JID of the participant. We could be getting the endpoint ID or
        // a participant JID. We want to find the connection JID.
        const participantJid = _findParticipantJid(getState, participantId);
        if (!participantJid) {
            logger_1.default.warn(`Could not find participant ${participantId}`);
            return;
        }
        (0, functions_2.getCurrentConference)(getState)?.getBreakoutRooms()
            ?.sendParticipantToRoom(participantJid, room.jid);
    };
}
exports.sendParticipantToRoom = sendParticipantToRoom;
/**
 * Action to move to a room.
 *
 * @param {string} roomId - The room id to move to. If omitted move to the main room.
 * @returns {Function}
 */
function moveToRoom(roomId) {
    return async (dispatch, getState) => {
        const mainRoomId = (0, functions_5.getMainRoom)(getState)?.id;
        let _roomId = roomId || mainRoomId;
        // Check if we got a full JID.
        if (_roomId && _roomId?.indexOf('@') !== -1) {
            const [id, ...domainParts] = _roomId.split('@');
            // On mobile we first store the room and the connection is created
            // later, so let's attach the domain to the room String object as
            // a little hack.
            // eslint-disable-next-line no-new-wrappers
            _roomId = new String(id);
            // @ts-ignore
            _roomId.domain = domainParts.join('@');
        }
        const roomIdStr = _roomId?.toString();
        const goToMainRoom = roomIdStr === mainRoomId;
        const rooms = (0, functions_5.getBreakoutRooms)(getState);
        const targetRoom = rooms[roomIdStr ?? ''];
        if (!targetRoom) {
            logger_1.default.warn(`Unknown room: ${targetRoom}`);
            return;
        }
        dispatch({
            type: actionTypes_1._RESET_BREAKOUT_ROOMS
        });
        if (navigator.product === 'ReactNative') {
            const conference = (0, functions_2.getCurrentConference)(getState);
            const { audio, video } = getState()['features/base/media'];
            dispatch((0, actions_1.conferenceWillLeave)(conference));
            try {
                await conference?.leave(constants_1.CONFERENCE_LEAVE_REASONS.SWITCH_ROOM);
            }
            catch (error) {
                logger_1.default.warn('JitsiConference.leave() rejected with:', error);
                dispatch((0, actions_1.conferenceLeft)(conference));
            }
            dispatch((0, actions_4.clearNotifications)());
            dispatch((0, actions_1.createConference)(_roomId));
            dispatch((0, actions_2.setAudioMuted)(audio.muted));
            dispatch((0, actions_2.setVideoMuted)(Boolean(video.muted)));
            dispatch((0, actions_3.createDesiredLocalTracks)());
        }
        else {
            const localTracks = (0, functions_4.getLocalTracks)(getState()['features/base/tracks']);
            const isAudioMuted = (0, functions_4.isLocalTrackMuted)(localTracks, constants_2.MEDIA_TYPE.AUDIO);
            const isVideoMuted = (0, functions_4.isLocalTrackMuted)(localTracks, constants_2.MEDIA_TYPE.VIDEO);
            try {
                // all places we fire notifyConferenceLeft we pass the room name from APP.conference
                await APP.conference.leaveRoom(false /* doDisconnect */, constants_1.CONFERENCE_LEAVE_REASONS.SWITCH_ROOM).then(() => APP.API.notifyConferenceLeft(APP.conference.roomName));
            }
            catch (error) {
                logger_1.default.warn('APP.conference.leaveRoom() rejected with:', error);
                // TODO: revisit why we don't dispatch CONFERENCE_LEFT here.
            }
            APP.conference.joinRoom(_roomId, {
                startWithAudioMuted: isAudioMuted,
                startWithVideoMuted: isVideoMuted
            });
        }
        if (goToMainRoom) {
            dispatch((0, actions_4.showNotification)({
                titleKey: 'breakoutRooms.notifications.joinedTitle',
                descriptionKey: 'breakoutRooms.notifications.joinedMainRoom',
                concatText: true,
                maxLines: 2
            }, constants_3.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        }
        else {
            dispatch((0, actions_4.showNotification)({
                titleKey: 'breakoutRooms.notifications.joinedTitle',
                descriptionKey: 'breakoutRooms.notifications.joined',
                descriptionArguments: { name: targetRoom.name },
                concatText: true,
                maxLines: 2
            }, constants_3.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        }
    };
}
exports.moveToRoom = moveToRoom;
/**
 * Finds a participant's connection JID given its ID.
 *
 * @param {Function} getState - The redux store state getter.
 * @param {string} participantId - ID of the given participant.
 * @returns {string|undefined} - The participant connection JID if found.
 */
function _findParticipantJid(getState, participantId) {
    const conference = (0, functions_2.getCurrentConference)(getState);
    if (!conference) {
        return;
    }
    // Get the full JID of the participant. We could be getting the endpoint ID or
    // a participant JID. We want to find the connection JID.
    let _participantId = participantId;
    let participantJid;
    if (!participantId.includes('@')) {
        const p = conference.getParticipantById(participantId);
        _participantId = p?.getJid(); // This will be the room JID.
    }
    if (_participantId) {
        const rooms = (0, functions_5.getBreakoutRooms)(getState);
        for (const room of Object.values(rooms)) {
            const participants = room.participants || {};
            const p = participants[_participantId]
                || Object.values(participants).find(item => item.jid === _participantId);
            if (p) {
                participantJid = p.jid;
                break;
            }
        }
    }
    return participantJid;
}
