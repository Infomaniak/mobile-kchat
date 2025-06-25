"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const functions_1 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actions_any_1 = require("../chat/actions.any");
const constants_1 = require("../chat/constants");
const actionTypes_1 = require("./actionTypes");
const actions_1 = require("./actions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Registers a change handler for state['features/base/conference'].conference to
 * set the event listeners needed for the breakout rooms feature to operate.
 */
StateListenerRegistry_1.default.register(state => state['features/base/conference'].conference, (conference, { dispatch }, previousConference) => {
    if (conference && !previousConference) {
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.BREAKOUT_ROOMS_MOVE_TO_ROOM, (roomId) => {
            logger_1.default.debug(`Moving to room: ${roomId}`);
            dispatch((0, actions_1.moveToRoom)(roomId));
        });
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.BREAKOUT_ROOMS_UPDATED, ({ rooms, roomCounter }) => {
            logger_1.default.debug('Room list updated');
            if (typeof APP !== 'undefined') {
                APP.API.notifyBreakoutRoomsUpdated(rooms);
            }
            dispatch({
                type: actionTypes_1.UPDATE_BREAKOUT_ROOMS,
                rooms,
                roomCounter
            });
        });
    }
});
MiddlewareRegistry_1.default.register(({ dispatch, getState }) => next => action => {
    const { type } = action;
    switch (type) {
        case actionTypes_1.UPDATE_BREAKOUT_ROOMS: {
            // edit name if it was overwritten
            if (!action.updatedNames) {
                const { overwrittenNameList } = getState()['features/base/participants'];
                if (Object.keys(overwrittenNameList).length > 0) {
                    const newRooms = {};
                    Object.entries(action.rooms).forEach(([key, r]) => {
                        let participants = r?.participants || {};
                        let jid;
                        for (const id of Object.keys(overwrittenNameList)) {
                            jid = Object.keys(participants).find(p => p.slice(p.indexOf('/') + 1) === id);
                            if (jid) {
                                participants = {
                                    ...participants,
                                    [jid]: {
                                        ...participants[jid],
                                        displayName: overwrittenNameList[id]
                                    }
                                };
                            }
                        }
                        newRooms[key] = {
                            ...r,
                            participants
                        };
                    });
                    action.rooms = newRooms;
                }
            }
            // edit the chat history to match names for participants in breakout rooms
            const { messages } = getState()['features/chat'];
            messages?.forEach(m => {
                if (m.messageType === constants_1.MESSAGE_TYPE_REMOTE && !(0, functions_1.getParticipantById)(getState(), m.id)) {
                    const rooms = action.rooms;
                    for (const room of Object.values(rooms)) {
                        const participants = room.participants || {};
                        const matchedJid = Object.keys(participants).find(jid => jid.endsWith(m.id));
                        if (matchedJid) {
                            m.displayName = participants[matchedJid].displayName;
                            dispatch((0, actions_any_1.editMessage)(m));
                        }
                    }
                }
            });
            break;
        }
    }
    return next(action);
});
