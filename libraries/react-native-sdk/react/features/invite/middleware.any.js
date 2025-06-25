"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/app/actionTypes");
const actionTypes_2 = require("../base/conference/actionTypes");
const actionTypes_3 = require("../base/participants/actionTypes");
const actions_1 = require("../base/participants/actions");
const constants_1 = require("../base/participants/constants");
const functions_1 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_2 = require("../base/sounds/actions");
const constants_2 = require("../presence-status/constants");
const actionTypes_4 = require("./actionTypes");
const actions_3 = require("./actions");
const constants_3 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
const sounds_1 = require("./sounds");
/**
 * Maps the presence status with the ID of the sound that will be played when
 * the status is received.
 */
const statusToRingtone = {
    [constants_2.CALLING]: constants_3.OUTGOING_CALL_START_SOUND_ID,
    [constants_2.CONNECTED_USER]: constants_1.PARTICIPANT_JOINED_SOUND_ID,
    [constants_2.EXPIRED]: constants_3.OUTGOING_CALL_EXPIRED_SOUND_ID,
    [constants_2.INVITED]: constants_3.OUTGOING_CALL_START_SOUND_ID,
    [constants_2.REJECTED]: constants_3.OUTGOING_CALL_REJECTED_SOUND_ID,
    [constants_2.RINGING]: constants_3.OUTGOING_CALL_RINGING_SOUND_ID
};
/**
 * The middleware of the feature invite common to mobile/react-native and
 * Web/React.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    let oldParticipantPresence;
    const { dispatch, getState } = store;
    const state = getState();
    if (action.type === actionTypes_3.PARTICIPANT_UPDATED
        || action.type === actionTypes_3.PARTICIPANT_LEFT) {
        oldParticipantPresence
            = (0, functions_1.getParticipantPresenceStatus)(state, action.participant.id);
    }
    if (action.type === actionTypes_4.SET_CALLEE_INFO_VISIBLE) {
        if (action.calleeInfoVisible) {
            dispatch((0, actions_1.pinParticipant)((0, functions_1.getLocalParticipant)(state)?.id));
        }
        else {
            // unpin participant
            dispatch((0, actions_1.pinParticipant)());
        }
    }
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            for (const [soundId, sound] of sounds_1.sounds.entries()) {
                dispatch((0, actions_2.registerSound)(soundId, sound.file, sound.options));
            }
            break;
        case actionTypes_1.APP_WILL_UNMOUNT:
            for (const soundId of sounds_1.sounds.keys()) {
                dispatch((0, actions_2.unregisterSound)(soundId));
            }
            break;
        case actionTypes_2.CONFERENCE_JOINED:
            _onConferenceJoined(store);
            break;
        case actionTypes_3.PARTICIPANT_JOINED:
        case actionTypes_3.PARTICIPANT_LEFT:
        case actionTypes_3.PARTICIPANT_UPDATED: {
            _maybeHideCalleeInfo(action, store);
            const newParticipantPresence = (0, functions_1.getParticipantPresenceStatus)(state, action.participant.id);
            if (oldParticipantPresence === newParticipantPresence) {
                break;
            }
            const oldSoundId = oldParticipantPresence
                && statusToRingtone[oldParticipantPresence];
            const newSoundId = newParticipantPresence
                && statusToRingtone[newParticipantPresence];
            if (oldSoundId === newSoundId) {
                break;
            }
            if (oldSoundId) {
                dispatch((0, actions_2.stopSound)(oldSoundId));
            }
            if (newSoundId) {
                dispatch((0, actions_2.playSound)(newSoundId));
            }
            break;
        }
        case actionTypes_4.UPDATE_DIAL_IN_NUMBERS_FAILED:
            logger_1.default.error('Error encountered while fetching dial-in numbers:', action.error);
            break;
    }
    return result;
});
/**
 * Hides the callee info layot if there are more than 1 real
 * (not poltergeist, shared video, etc.) participants in the call.
 *
 * @param {Object} action - The redux action.
 * @param {IStore} store - The redux store.
 * @returns {void}
 */
function _maybeHideCalleeInfo(action, store) {
    const state = store.getState();
    if (!state['features/invite'].calleeInfoVisible) {
        return;
    }
    const participants = (0, functions_1.getRemoteParticipants)(state);
    const participantCount = (0, functions_1.getParticipantCount)(state);
    let numberOfPoltergeists = 0;
    participants.forEach(p => {
        if (p.botType === 'poltergeist') {
            numberOfPoltergeists++;
        }
    });
    const numberOfRealParticipants = participantCount - numberOfPoltergeists;
    if ((numberOfPoltergeists > 1 || numberOfRealParticipants > 1)
        || (action.type === actionTypes_3.PARTICIPANT_LEFT && participantCount === 1)) {
        store.dispatch((0, actions_3.setCalleeInfoVisible)(false));
    }
}
/**
 * Executes the pending invitation requests if any.
 *
 * @param {IStore} store - The redux store.
 * @returns {void}
 */
function _onConferenceJoined(store) {
    const { dispatch, getState } = store;
    const pendingInviteRequests = getState()['features/invite'].pendingInviteRequests || [];
    pendingInviteRequests.forEach(({ invitees, callback }) => {
        dispatch((0, actions_3.invite)(invitees))
            .then(failedInvitees => {
            callback(failedInvitees);
        });
    });
    dispatch((0, actions_3.removePendingInviteRequests)());
}
