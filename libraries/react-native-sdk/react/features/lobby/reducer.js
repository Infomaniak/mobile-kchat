"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/conference/actionTypes");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_2 = require("./actionTypes");
const DEFAULT_STATE = {
    isDisplayNameRequiredError: false,
    knocking: false,
    knockingParticipants: [],
    lobbyEnabled: false,
    lobbyVisible: false,
    passwordJoinFailed: false
};
/**
 * Reduces redux actions which affect the display of notifications.
 *
 * @param {Object} state - The current redux state.
 * @param {Object} action - The redux action to reduce.
 * @returns {Object} The next redux state which is the result of reducing the
 * specified {@code action}.
 */
ReducerRegistry_1.default.register('features/lobby', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.CONFERENCE_FAILED: {
            if (action.error.name === lib_jitsi_meet_1.JitsiConferenceErrors.DISPLAY_NAME_REQUIRED) {
                return {
                    ...state,
                    isDisplayNameRequiredError: true
                };
            }
            return {
                ...state,
                knocking: false
            };
        }
        case actionTypes_1.CONFERENCE_JOINED:
        case actionTypes_1.CONFERENCE_LEFT:
            return {
                ...state,
                knocking: false,
                passwordJoinFailed: false
            };
        case actionTypes_2.KNOCKING_PARTICIPANT_ARRIVED_OR_UPDATED:
            return _knockingParticipantArrivedOrUpdated(action.participant, state);
        case actionTypes_2.KNOCKING_PARTICIPANT_LEFT:
            return {
                ...state,
                knockingParticipants: state.knockingParticipants.filter(p => p.id !== action.id)
            };
        case actionTypes_2.SET_KNOCKING_STATE:
            return {
                ...state,
                knocking: action.knocking,
                passwordJoinFailed: false
            };
        case actionTypes_2.SET_LOBBY_MODE_ENABLED:
            return {
                ...state,
                lobbyEnabled: action.enabled
            };
        case actionTypes_2.SET_LOBBY_VISIBILITY:
            return {
                ...state,
                lobbyVisible: action.visible
            };
        case actionTypes_1.SET_PASSWORD:
            return {
                ...state,
                passwordJoinFailed: false
            };
        case actionTypes_2.SET_PASSWORD_JOIN_FAILED:
            return {
                ...state,
                passwordJoinFailed: action.failed
            };
        case actionTypes_2.SET_LOBBY_PARTICIPANT_CHAT_STATE:
            return {
                ...state,
                knockingParticipants: state.knockingParticipants.map(participant => {
                    if (participant.id === action.participant.id) {
                        return {
                            ...participant,
                            chattingWithModerator: action.moderator.id
                        };
                    }
                    return participant;
                })
            };
        case actionTypes_2.REMOVE_LOBBY_CHAT_WITH_MODERATOR:
            return {
                ...state,
                knockingParticipants: state.knockingParticipants.map(participant => {
                    if (participant.chattingWithModerator === action.moderatorId) {
                        return {
                            ...participant,
                            chattingWithModerator: undefined
                        };
                    }
                    return participant;
                })
            };
    }
    return state;
});
/**
 * Stores or updates a knocking participant.
 *
 * @param {Object} participant - The arrived or updated knocking participant.
 * @param {Object} state - The current Redux state of the feature.
 * @returns {Object}
 */
function _knockingParticipantArrivedOrUpdated(participant, state) {
    let existingParticipant = state.knockingParticipants.find(p => p.id === participant.id);
    existingParticipant = {
        ...existingParticipant,
        ...participant
    };
    return {
        ...state,
        knockingParticipants: [
            ...state.knockingParticipants.filter(p => p.id !== participant.id),
            existingParticipant
        ]
    };
}
