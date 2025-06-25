"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAutoAssignParticipantsVisible = exports.isAddBreakoutRoomButtonVisible = exports.getBreakoutRoomsConfig = exports.isInBreakoutRoom = exports.getCurrentRoomId = exports.getRoomByJid = exports.getRoomsInfo = exports.getMainRoom = exports.getBreakoutRooms = void 0;
const lodash_1 = __importDefault(require("lodash"));
const functions_1 = require("../base/conference/functions");
const functions_2 = require("../base/participants/functions");
const functions_3 = require("../base/redux/functions");
const constants_1 = require("./constants");
/**
 * Returns the rooms object for breakout rooms.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {Object} Object of rooms.
 */
const getBreakoutRooms = (stateful) => (0, functions_3.toState)(stateful)[constants_1.FEATURE_KEY].rooms;
exports.getBreakoutRooms = getBreakoutRooms;
/**
 * Returns the main room.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {IRoom|undefined} The main room object, or undefined.
 */
const getMainRoom = (stateful) => {
    const rooms = (0, exports.getBreakoutRooms)(stateful);
    return lodash_1.default.find(rooms, room => Boolean(room.isMainRoom));
};
exports.getMainRoom = getMainRoom;
/**
 * Returns the rooms info.
 *
 * @param {IStateful} stateful - The redux store, the redux.

* @returns {IRoomsInfo} The rooms info.
 */
const getRoomsInfo = (stateful) => {
    const breakoutRooms = (0, exports.getBreakoutRooms)(stateful);
    const conference = (0, functions_1.getCurrentConference)(stateful);
    const initialRoomsInfo = {
        rooms: []
    };
    // only main roomn
    if (!breakoutRooms || Object.keys(breakoutRooms).length === 0) {
        // filter out hidden participants
        const conferenceParticipants = conference?.getParticipants()
            .filter((participant) => !participant.isHidden());
        const localParticipant = (0, functions_2.getLocalParticipant)(stateful);
        let localParticipantInfo;
        if (localParticipant) {
            localParticipantInfo = {
                role: localParticipant.role,
                displayName: localParticipant.name,
                avatarUrl: localParticipant.loadableAvatarUrl,
                id: localParticipant.id
            };
        }
        return {
            ...initialRoomsInfo,
            rooms: [{
                    isMainRoom: true,
                    id: conference?.room?.roomjid,
                    jid: conference?.room?.myroomjid,
                    participants: conferenceParticipants?.length > 0
                        ? [
                            localParticipantInfo,
                            ...conferenceParticipants.map((participantItem) => {
                                const storeParticipant = (0, functions_2.getParticipantById)(stateful, participantItem.getId());
                                return {
                                    jid: participantItem.getJid(),
                                    role: participantItem.getRole(),
                                    displayName: participantItem.getDisplayName(),
                                    avatarUrl: storeParticipant?.loadableAvatarUrl,
                                    id: participantItem.getId()
                                };
                            })
                        ]
                        : [localParticipantInfo]
                }]
        };
    }
    return {
        ...initialRoomsInfo,
        rooms: Object.keys(breakoutRooms).map(breakoutRoomKey => {
            const breakoutRoomItem = breakoutRooms[breakoutRoomKey];
            return {
                isMainRoom: Boolean(breakoutRoomItem.isMainRoom),
                id: breakoutRoomItem.id,
                jid: breakoutRoomItem.jid,
                participants: breakoutRoomItem.participants && Object.keys(breakoutRoomItem.participants).length
                    ? Object.keys(breakoutRoomItem.participants).map(participantLongId => {
                        const participantItem = breakoutRoomItem.participants[participantLongId];
                        const ids = participantLongId.split('/');
                        const storeParticipant = (0, functions_2.getParticipantById)(stateful, ids.length > 1 ? ids[1] : participantItem.jid);
                        return {
                            jid: participantItem?.jid,
                            role: participantItem?.role,
                            displayName: participantItem?.displayName,
                            avatarUrl: storeParticipant?.loadableAvatarUrl,
                            id: storeParticipant ? storeParticipant.id
                                : participantLongId
                        };
                    }) : []
            };
        })
    };
};
exports.getRoomsInfo = getRoomsInfo;
/**
 * Returns the room by Jid.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @param {string} roomJid - The jid of the room.
 * @returns {IRoom|undefined} The main room object, or undefined.
 */
const getRoomByJid = (stateful, roomJid) => {
    const rooms = (0, exports.getBreakoutRooms)(stateful);
    return lodash_1.default.find(rooms, (room) => room.jid === roomJid);
};
exports.getRoomByJid = getRoomByJid;
/**
 * Returns the id of the current room.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {string} Room id or undefined.
 */
const getCurrentRoomId = (stateful) => {
    const conference = (0, functions_1.getCurrentConference)(stateful);
    return conference?.getName();
};
exports.getCurrentRoomId = getCurrentRoomId;
/**
 * Determines whether the local participant is in a breakout room.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {boolean}
 */
const isInBreakoutRoom = (stateful) => {
    const conference = (0, functions_1.getCurrentConference)(stateful);
    return conference?.getBreakoutRooms()?.isBreakoutRoom();
};
exports.isInBreakoutRoom = isInBreakoutRoom;
/**
 * Returns the breakout rooms config.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {Object}
 */
const getBreakoutRoomsConfig = (stateful) => {
    const state = (0, functions_3.toState)(stateful);
    const { breakoutRooms = {} } = state['features/base/config'];
    return breakoutRooms;
};
exports.getBreakoutRoomsConfig = getBreakoutRoomsConfig;
/**
 * Returns whether the add breakout room button is visible.
 *
 * @param {IStateful} stateful - Global state.
 * @returns {boolean}
 */
const isAddBreakoutRoomButtonVisible = (stateful) => {
    const state = (0, functions_3.toState)(stateful);
    const isLocalModerator = (0, functions_2.isLocalParticipantModerator)(state);
    const { conference } = state['features/base/conference'];
    const isBreakoutRoomsSupported = conference?.getBreakoutRooms()?.isSupported();
    const { hideAddRoomButton } = (0, exports.getBreakoutRoomsConfig)(state);
    return isLocalModerator && isBreakoutRoomsSupported && !hideAddRoomButton;
};
exports.isAddBreakoutRoomButtonVisible = isAddBreakoutRoomButtonVisible;
/**
 * Returns whether the auto assign participants to breakout rooms button is visible.
 *
 * @param {IStateful} stateful - Global state.
 * @returns {boolean}
 */
const isAutoAssignParticipantsVisible = (stateful) => {
    const state = (0, functions_3.toState)(stateful);
    const rooms = (0, exports.getBreakoutRooms)(state);
    const inBreakoutRoom = (0, exports.isInBreakoutRoom)(state);
    const isLocalModerator = (0, functions_2.isLocalParticipantModerator)(state);
    const participantsCount = (0, functions_2.getParticipantCount)(state);
    const { hideAutoAssignButton } = (0, exports.getBreakoutRoomsConfig)(state);
    return !inBreakoutRoom
        && isLocalModerator
        && participantsCount > 2
        && Object.keys(rooms).length > 1
        && !hideAutoAssignButton;
};
exports.isAutoAssignParticipantsVisible = isAutoAssignParticipantsVisible;
