"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const actionTypes_1 = require("../base/app/actionTypes");
const actionTypes_2 = require("../base/conference/actionTypes");
const functions_2 = require("../base/conference/functions");
const lib_jitsi_meet_1 = __importStar(require("../base/lib-jitsi-meet"));
const constants_1 = require("../base/media/constants");
const actionTypes_3 = require("../base/participants/actionTypes");
const actions_1 = require("../base/participants/actions");
const constants_2 = require("../base/participants/constants");
const functions_3 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actions_2 = require("../base/sounds/actions");
const actionTypes_4 = require("../base/tracks/actionTypes");
const actions_3 = require("../notifications/actions");
const constants_3 = require("../notifications/constants");
const functions_4 = require("../transcribing/functions");
const actionTypes_5 = require("./actionTypes");
const actions_4 = require("./actions");
const LocalRecordingManager_1 = __importDefault(require("./components/Recording/LocalRecordingManager"));
const constants_4 = require("./constants");
const functions_5 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * StateListenerRegistry provides a reliable way to detect the leaving of a
 * conference, where we need to clean up the recording sessions.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => (0, functions_2.getCurrentConference)(state), 
/* listener */ (conference, { dispatch }) => {
    if (!conference) {
        dispatch((0, actions_4.clearRecordingSessions)());
    }
});
/**
 * The redux middleware to handle the recorder updates in a React way.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(({ dispatch, getState }) => next => async (action) => {
    let oldSessionData;
    if (action.type === actionTypes_5.RECORDING_SESSION_UPDATED) {
        oldSessionData
            = (0, functions_5.getSessionById)(getState(), action.sessionData.id);
    }
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            (0, functions_5.registerRecordingAudioFiles)(dispatch);
            break;
        case actionTypes_1.APP_WILL_UNMOUNT:
            (0, functions_5.unregisterRecordingAudioFiles)(dispatch);
            break;
        case actionTypes_2.CONFERENCE_JOIN_IN_PROGRESS: {
            const { conference } = action;
            conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.RECORDER_STATE_CHANGED, (recorderSession) => {
                if (recorderSession) {
                    recorderSession.getID() && dispatch((0, actions_4.updateRecordingSessionData)(recorderSession));
                    recorderSession.getError() && _showRecordingErrorNotification(recorderSession, dispatch);
                }
                return;
            });
            break;
        }
        case actionTypes_5.START_LOCAL_RECORDING: {
            const { localRecording } = getState()['features/base/config'];
            const { onlySelf } = action;
            try {
                await LocalRecordingManager_1.default.startLocalRecording({ dispatch,
                    getState }, action.onlySelf);
                const props = {
                    descriptionKey: 'recording.on',
                    titleKey: 'dialog.recording'
                };
                if (localRecording?.notifyAllParticipants && !onlySelf) {
                    dispatch((0, actions_2.playSound)(constants_4.RECORDING_ON_SOUND_ID));
                }
                dispatch((0, actions_3.showNotification)(props, constants_3.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
                dispatch((0, actions_3.showNotification)({
                    titleKey: 'recording.localRecordingStartWarningTitle',
                    descriptionKey: 'recording.localRecordingStartWarning'
                }, constants_3.NOTIFICATION_TIMEOUT_TYPE.STICKY));
                dispatch((0, actions_1.updateLocalRecordingStatus)(true, onlySelf));
                (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRecordingEvent)('started', `local${onlySelf ? '.self' : ''}`));
                if (typeof APP !== 'undefined') {
                    APP.API.notifyRecordingStatusChanged(true, 'local');
                }
            }
            catch (err) {
                logger_1.default.error('Capture failed', err);
                let descriptionKey = 'recording.error';
                if (err.message === 'WrongSurfaceSelected') {
                    descriptionKey = 'recording.surfaceError';
                }
                else if (err.message === 'NoLocalStreams') {
                    descriptionKey = 'recording.noStreams';
                }
                else if (err.message === 'NoMicTrack') {
                    descriptionKey = 'recording.noMicPermission';
                }
                const props = {
                    descriptionKey,
                    titleKey: 'recording.failedToStart'
                };
                if (typeof APP !== 'undefined') {
                    APP.API.notifyRecordingStatusChanged(false, 'local', err.message);
                }
                dispatch((0, actions_3.showErrorNotification)(props, constants_3.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
            }
            break;
        }
        case actionTypes_5.STOP_LOCAL_RECORDING: {
            const { localRecording } = getState()['features/base/config'];
            if (LocalRecordingManager_1.default.isRecordingLocally()) {
                LocalRecordingManager_1.default.stopLocalRecording();
                dispatch((0, actions_1.updateLocalRecordingStatus)(false));
                if (localRecording?.notifyAllParticipants && !LocalRecordingManager_1.default.selfRecording) {
                    dispatch((0, actions_2.playSound)(constants_4.RECORDING_OFF_SOUND_ID));
                }
                if (typeof APP !== 'undefined') {
                    APP.API.notifyRecordingStatusChanged(false, 'local');
                }
            }
            break;
        }
        case actionTypes_5.RECORDING_SESSION_UPDATED: {
            const state = getState();
            // When in recorder mode no notifications are shown
            // or extra sounds are also not desired
            // but we want to indicate those in case of sip gateway
            const { iAmRecorder, iAmSipGateway, recordingLimit } = state['features/base/config'];
            if (iAmRecorder && !iAmSipGateway) {
                break;
            }
            const updatedSessionData = (0, functions_5.getSessionById)(state, action.sessionData.id);
            const { initiator, mode = '', terminator } = updatedSessionData ?? {};
            const { PENDING, OFF, ON } = lib_jitsi_meet_1.JitsiRecordingConstants.status;
            if (updatedSessionData?.status === PENDING && oldSessionData?.status !== PENDING) {
                dispatch((0, actions_4.showPendingRecordingNotification)(mode));
                dispatch((0, actions_3.hideNotification)(constants_4.START_RECORDING_NOTIFICATION_ID));
            }
            else {
                dispatch((0, actions_4.hidePendingRecordingNotification)(mode));
                if (updatedSessionData?.status === ON) {
                    // We receive 2 updates of the session status ON. The first one is from jibri when it joins.
                    // The second one is from jicofo which will deliever the initiator value. Since the start
                    // recording notification uses the initiator value we skip the jibri update and show the
                    // notification on the update from jicofo.
                    // FIXE: simplify checks when the backend start sending only one status ON update containing the
                    // initiator.
                    if (initiator && !oldSessionData?.initiator) {
                        if (typeof recordingLimit === 'object') {
                            dispatch((0, actions_4.showRecordingLimitNotification)(mode));
                        }
                        else {
                            dispatch((0, actions_4.showStartedRecordingNotification)(mode, initiator, action.sessionData.id));
                        }
                    }
                    if (oldSessionData?.status !== ON) {
                        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRecordingEvent)('start', mode));
                        let soundID;
                        if (mode === lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE && !(0, functions_4.isRecorderTranscriptionsRunning)(state)) {
                            soundID = constants_4.RECORDING_ON_SOUND_ID;
                        }
                        else if (mode === lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM) {
                            soundID = constants_4.LIVE_STREAMING_ON_SOUND_ID;
                        }
                        if (soundID) {
                            dispatch((0, actions_2.playSound)(soundID));
                        }
                        if (typeof APP !== 'undefined') {
                            APP.API.notifyRecordingStatusChanged(true, mode);
                        }
                    }
                }
                else if (updatedSessionData?.status === OFF && oldSessionData?.status !== OFF) {
                    if (terminator) {
                        dispatch((0, actions_4.showStoppedRecordingNotification)(mode, (0, functions_3.getParticipantDisplayName)(state, (0, functions_5.getResourceId)(terminator))));
                    }
                    let duration = 0, soundOff, soundOn;
                    if (oldSessionData?.timestamp) {
                        duration
                            = (Date.now() / 1000) - oldSessionData.timestamp;
                    }
                    (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRecordingEvent)('stop', mode, duration));
                    if (mode === lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE && !(0, functions_4.isRecorderTranscriptionsRunning)(state)) {
                        soundOff = constants_4.RECORDING_OFF_SOUND_ID;
                        soundOn = constants_4.RECORDING_ON_SOUND_ID;
                    }
                    else if (mode === lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM) {
                        soundOff = constants_4.LIVE_STREAMING_OFF_SOUND_ID;
                        soundOn = constants_4.LIVE_STREAMING_ON_SOUND_ID;
                    }
                    if (soundOff && soundOn) {
                        dispatch((0, actions_2.stopSound)(soundOn));
                        dispatch((0, actions_2.playSound)(soundOff));
                    }
                    if (typeof APP !== 'undefined') {
                        APP.API.notifyRecordingStatusChanged(false, mode);
                    }
                }
            }
            break;
        }
        case actionTypes_4.TRACK_ADDED: {
            const { track } = action;
            if (LocalRecordingManager_1.default.isRecordingLocally() && track.mediaType === constants_1.MEDIA_TYPE.AUDIO) {
                const audioTrack = track.jitsiTrack.track;
                LocalRecordingManager_1.default.addAudioTrackToLocalRecording(audioTrack);
            }
            break;
        }
        case actionTypes_3.PARTICIPANT_UPDATED: {
            const { id, role } = action.participant;
            const state = getState();
            const localParticipant = (0, functions_3.getLocalParticipant)(state);
            if (localParticipant?.id !== id) {
                return next(action);
            }
            if (role === constants_2.PARTICIPANT_ROLE.MODERATOR) {
                dispatch((0, actions_4.showStartRecordingNotification)());
            }
            return next(action);
        }
    }
    return result;
});
/**
 * Shows a notification about an error in the recording session. A
 * default notification will display if no error is specified in the passed
 * in recording session.
 *
 * @private
 * @param {Object} recorderSession - The recorder session model from the
 * lib.
 * @param {Dispatch} dispatch - The Redux Dispatch function.
 * @returns {void}
 */
function _showRecordingErrorNotification(recorderSession, dispatch) {
    const mode = recorderSession.getMode();
    const error = recorderSession.getError();
    const isStreamMode = mode === lib_jitsi_meet_1.default.constants.recording.mode.STREAM;
    switch (error) {
        case lib_jitsi_meet_1.default.constants.recording.error.SERVICE_UNAVAILABLE:
            dispatch((0, actions_4.showRecordingError)({
                descriptionKey: 'recording.unavailable',
                descriptionArguments: {
                    serviceName: isStreamMode
                        ? '$t(liveStreaming.serviceName)'
                        : '$t(recording.serviceName)'
                },
                titleKey: isStreamMode
                    ? 'liveStreaming.unavailableTitle'
                    : 'recording.unavailableTitle'
            }));
            break;
        case lib_jitsi_meet_1.default.constants.recording.error.RESOURCE_CONSTRAINT:
            dispatch((0, actions_4.showRecordingError)({
                descriptionKey: isStreamMode
                    ? 'liveStreaming.busy'
                    : 'recording.busy',
                titleKey: isStreamMode
                    ? 'liveStreaming.busyTitle'
                    : 'recording.busyTitle'
            }));
            break;
        case lib_jitsi_meet_1.default.constants.recording.error.UNEXPECTED_REQUEST:
            dispatch((0, actions_4.showRecordingWarning)({
                descriptionKey: isStreamMode
                    ? 'liveStreaming.sessionAlreadyActive'
                    : 'recording.sessionAlreadyActive',
                titleKey: isStreamMode ? 'liveStreaming.inProgress' : 'recording.inProgress'
            }));
            break;
        default:
            dispatch((0, actions_4.showRecordingError)({
                descriptionKey: isStreamMode
                    ? 'liveStreaming.error'
                    : 'recording.error',
                titleKey: isStreamMode
                    ? 'liveStreaming.failedToStart'
                    : 'recording.failedToStart'
            }));
            break;
    }
    if (typeof APP !== 'undefined') {
        APP.API.notifyRecordingStatusChanged(false, mode, error);
    }
}
