"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/app/actionTypes");
const actionTypes_2 = require("../base/conference/actionTypes");
const functions_1 = require("../base/conference/functions");
const actions_1 = require("../base/dialog/actions");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const actionTypes_3 = require("../base/participants/actionTypes");
const actions_2 = require("../base/participants/actions");
const functions_2 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actions_3 = require("../base/sounds/actions");
const actionTypes_4 = require("./actionTypes");
const actions_4 = require("./actions");
const ParticipantVerificationDialog_1 = __importDefault(require("./components/ParticipantVerificationDialog"));
const constants_1 = require("./constants");
const functions_3 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Middleware that captures actions related to E2EE.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(({ dispatch, getState }) => next => action => {
    const conference = (0, functions_1.getCurrentConference)(getState);
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            (0, functions_3.registerE2eeAudioFiles)(dispatch);
            break;
        case actionTypes_1.APP_WILL_UNMOUNT:
            (0, functions_3.unregisterE2eeAudioFiles)(dispatch);
            break;
        case actionTypes_2.CONFERENCE_JOINED:
            _updateMaxMode(dispatch, getState);
            break;
        case actionTypes_3.PARTICIPANT_JOINED: {
            const result = next(action);
            if (!(0, functions_2.isScreenShareParticipant)(action.participant) && !action.participant.local) {
                _updateMaxMode(dispatch, getState);
            }
            return result;
        }
        case actionTypes_3.PARTICIPANT_LEFT: {
            const participant = (0, functions_2.getParticipantById)(getState(), action.participant?.id);
            const result = next(action);
            if (!(0, functions_2.isScreenShareParticipant)(participant)) {
                _updateMaxMode(dispatch, getState);
            }
            return result;
        }
        case actionTypes_4.TOGGLE_E2EE: {
            if (conference?.isE2EESupported() && conference.isE2EEEnabled() !== action.enabled) {
                logger_1.default.debug(`E2EE will be ${action.enabled ? 'enabled' : 'disabled'}`);
                conference.toggleE2EE(action.enabled);
                // Broadcast that we enabled / disabled E2EE.
                const participant = (0, functions_2.getLocalParticipant)(getState);
                dispatch((0, actions_2.participantUpdated)({
                    e2eeEnabled: action.enabled,
                    id: participant?.id ?? '',
                    local: true
                }));
                const soundID = action.enabled ? constants_1.E2EE_ON_SOUND_ID : constants_1.E2EE_OFF_SOUND_ID;
                dispatch((0, actions_3.playSound)(soundID));
            }
            break;
        }
        case actionTypes_4.SET_MEDIA_ENCRYPTION_KEY: {
            if (conference?.isE2EESupported()) {
                const { exportedKey, index } = action.keyInfo;
                if (exportedKey) {
                    window.crypto.subtle.importKey('raw', new Uint8Array(exportedKey), 'AES-GCM', false, ['encrypt', 'decrypt'])
                        .then(encryptionKey => {
                        conference.setMediaEncryptionKey({
                            encryptionKey,
                            index
                        });
                    })
                        .catch(error => logger_1.default.error('SET_MEDIA_ENCRYPTION_KEY error', error));
                }
                else {
                    conference.setMediaEncryptionKey({
                        encryptionKey: false,
                        index
                    });
                }
            }
            break;
        }
        case actionTypes_4.PARTICIPANT_VERIFIED: {
            const { isVerified, pId } = action;
            conference?.markParticipantVerified(pId, isVerified);
            break;
        }
        case actionTypes_4.START_VERIFICATION: {
            conference?.startVerification(action.pId);
            break;
        }
    }
    return next(action);
});
/**
 * Set up state change listener to perform maintenance tasks when the conference
 * is left or failed.
 */
StateListenerRegistry_1.default.register(state => (0, functions_1.getCurrentConference)(state), (conference, { dispatch }, previousConference) => {
    if (previousConference) {
        dispatch((0, actions_4.toggleE2EE)(false));
    }
    if (conference) {
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.E2EE_VERIFICATION_AVAILABLE, (pId) => {
            dispatch((0, actions_2.participantUpdated)({
                e2eeVerificationAvailable: true,
                id: pId
            }));
        });
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.E2EE_VERIFICATION_READY, (pId, sas) => {
            dispatch((0, actions_1.openDialog)(ParticipantVerificationDialog_1.default, { pId,
                sas }));
        });
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.E2EE_VERIFICATION_COMPLETED, (pId, success, message) => {
            if (message) {
                logger_1.default.warn('E2EE_VERIFICATION_COMPLETED warning', message);
            }
            dispatch((0, actions_2.participantUpdated)({
                e2eeVerified: success,
                id: pId
            }));
        });
    }
});
/**
 * Sets the maxMode based on the number of participants in the conference.
 *
 * @param { Dispatch<any>} dispatch - The redux dispatch function.
 * @param {Function|Object} getState - The {@code getState} function.
 * @private
 * @returns {void}
 */
function _updateMaxMode(dispatch, getState) {
    const state = getState();
    const { e2ee = {} } = state['features/base/config'];
    if (e2ee.externallyManagedKey) {
        return;
    }
    const { maxMode, enabled } = state['features/e2ee'];
    const isMaxModeThresholdReachedValue = (0, functions_3.isMaxModeThresholdReached)(state);
    let newMaxMode;
    if (isMaxModeThresholdReachedValue) {
        newMaxMode = constants_1.MAX_MODE.THRESHOLD_EXCEEDED;
    }
    else if ((0, functions_3.isMaxModeReached)(state)) {
        newMaxMode = constants_1.MAX_MODE.ENABLED;
    }
    else {
        newMaxMode = constants_1.MAX_MODE.DISABLED;
    }
    if (maxMode !== newMaxMode) {
        dispatch((0, actions_4.setE2EEMaxMode)(newMaxMode));
    }
    if (isMaxModeThresholdReachedValue && !enabled) {
        dispatch((0, actions_4.toggleE2EE)(false));
    }
}
