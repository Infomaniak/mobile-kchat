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
exports.showStartRecordingNotificationWithCallback = exports.stopLocalVideoRecording = exports.startLocalVideoRecording = exports.setSelectedRecordingService = exports.updateRecordingSessionData = exports.showStartedRecordingNotification = exports.showStoppedRecordingNotification = exports.showRecordingWarning = exports.showRecordingError = exports.highlightMeetingMoment = exports.showPendingRecordingNotification = exports.setLiveStreamKey = exports.hidePendingRecordingNotification = exports.setHighlightMomentButtonState = exports.setStartRecordingNotificationShown = exports.clearRecordingSessions = void 0;
const functions_1 = require("../base/config/functions");
const functions_2 = require("../base/jwt/functions");
const lib_jitsi_meet_1 = __importStar(require("../base/lib-jitsi-meet"));
const functions_3 = require("../base/participants/functions");
const constants_any_1 = require("../base/ui/constants.any");
const copyText_1 = require("../base/util/copyText");
const functions_4 = require("../jaas/functions");
const actions_1 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const actions_any_1 = require("../subtitles/actions.any");
const functions_5 = require("../transcribing/functions");
const actionTypes_1 = require("./actionTypes");
const constants_2 = require("./constants");
const functions_6 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Clears the data of every recording sessions.
 *
 * @returns {{
 *     type: CLEAR_RECORDING_SESSIONS
 * }}
 */
function clearRecordingSessions() {
    return {
        type: actionTypes_1.CLEAR_RECORDING_SESSIONS
    };
}
exports.clearRecordingSessions = clearRecordingSessions;
/**
 * Marks the start recording notification as shown.
 *
 * @returns {{
 *      type: SET_START_RECORDING_NOTIFICATION_SHOWN
 * }}
 */
function setStartRecordingNotificationShown() {
    return {
        type: actionTypes_1.SET_START_RECORDING_NOTIFICATION_SHOWN
    };
}
exports.setStartRecordingNotificationShown = setStartRecordingNotificationShown;
/**
 * Sets the meeting highlight button disable state.
 *
 * @param {boolean} disabled - The disabled state value.
 * @returns {{
 *     type: CLEAR_RECORDING_SESSIONS
 * }}
 */
function setHighlightMomentButtonState(disabled) {
    return {
        type: actionTypes_1.SET_MEETING_HIGHLIGHT_BUTTON_STATE,
        disabled
    };
}
exports.setHighlightMomentButtonState = setHighlightMomentButtonState;
/**
 * Signals that the pending recording notification should be removed from the
 * screen.
 *
 * @param {string} streamType - The type of the stream ({@code 'file'} or
 * {@code 'stream'}).
 * @returns {Function}
 */
function hidePendingRecordingNotification(streamType) {
    return (dispatch, getState) => {
        const { pendingNotificationUids } = getState()['features/recording'];
        const pendingNotificationUid = pendingNotificationUids[streamType];
        if (pendingNotificationUid) {
            dispatch((0, actions_1.hideNotification)(pendingNotificationUid));
            dispatch(_setPendingRecordingNotificationUid(undefined, streamType));
        }
    };
}
exports.hidePendingRecordingNotification = hidePendingRecordingNotification;
/**
 * Sets the stream key last used by the user for later reuse.
 *
 * @param {string} streamKey - The stream key to set.
 * @returns {{
 *     type: SET_STREAM_KEY,
 *     streamKey: string
 * }}
 */
function setLiveStreamKey(streamKey) {
    return {
        type: actionTypes_1.SET_STREAM_KEY,
        streamKey
    };
}
exports.setLiveStreamKey = setLiveStreamKey;
/**
 * Signals that the pending recording notification should be shown on the
 * screen.
 *
 * @param {string} streamType - The type of the stream ({@code file} or
 * {@code stream}).
 * @returns {Function}
 */
function showPendingRecordingNotification(streamType) {
    return async (dispatch) => {
        const isLiveStreaming = streamType === lib_jitsi_meet_1.default.constants.recording.mode.STREAM;
        const dialogProps = isLiveStreaming ? {
            descriptionKey: 'liveStreaming.pending',
            titleKey: 'dialog.liveStreaming'
        } : {
            descriptionKey: 'recording.pending',
            titleKey: 'dialog.recording'
        };
        const notification = await dispatch((0, actions_1.showNotification)({
            ...dialogProps
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        if (notification) {
            dispatch(_setPendingRecordingNotificationUid(notification.uid, streamType));
        }
    };
}
exports.showPendingRecordingNotification = showPendingRecordingNotification;
/**
 * Highlights a meeting moment.
 *
 * {@code stream}).
 *
 * @returns {Function}
 */
function highlightMeetingMoment() {
    return async (dispatch, getState) => {
        dispatch(setHighlightMomentButtonState(true));
        const success = await (0, functions_6.sendMeetingHighlight)(getState());
        if (success) {
            dispatch((0, actions_1.showNotification)({
                descriptionKey: 'recording.highlightMomentSucessDescription',
                titleKey: 'recording.highlightMomentSuccess'
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.SHORT));
        }
        dispatch(setHighlightMomentButtonState(false));
    };
}
exports.highlightMeetingMoment = highlightMeetingMoment;
/**
 * Signals that the recording error notification should be shown.
 *
 * @param {Object} props - The Props needed to render the notification.
 * @returns {showErrorNotification}
 */
function showRecordingError(props) {
    return (0, actions_1.showErrorNotification)(props, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG);
}
exports.showRecordingError = showRecordingError;
/**
 * Signals that the recording warning notification should be shown.
 *
 * @param {Object} props - The Props needed to render the notification.
 * @returns {showWarningNotification}
 */
function showRecordingWarning(props) {
    return (0, actions_1.showWarningNotification)(props);
}
exports.showRecordingWarning = showRecordingWarning;
/**
 * Signals that the stopped recording notification should be shown on the
 * screen for a given period.
 *
 * @param {string} streamType - The type of the stream ({@code file} or
 * {@code stream}).
 * @param {string?} participantName - The participant name stopping the recording.
 * @returns {showNotification}
 */
function showStoppedRecordingNotification(streamType, participantName) {
    const isLiveStreaming = streamType === lib_jitsi_meet_1.default.constants.recording.mode.STREAM;
    const descriptionArguments = { name: participantName };
    const dialogProps = isLiveStreaming ? {
        descriptionKey: participantName ? 'liveStreaming.offBy' : 'liveStreaming.off',
        descriptionArguments,
        titleKey: 'dialog.liveStreaming'
    } : {
        descriptionKey: participantName ? 'recording.offBy' : 'recording.off',
        descriptionArguments,
        titleKey: 'dialog.recording'
    };
    return (0, actions_1.showNotification)(dialogProps, constants_1.NOTIFICATION_TIMEOUT_TYPE.SHORT);
}
exports.showStoppedRecordingNotification = showStoppedRecordingNotification;
/**
 * Signals that a started recording notification should be shown on the
 * screen for a given period.
 *
 * @param {string} mode - The type of the recording: Stream of File.
 * @param {string | Object } initiator - The participant who started recording.
 * @param {string} sessionId - The recording session id.
 * @returns {Function}
 */
function showStartedRecordingNotification(mode, initiator, sessionId) {
    return async (dispatch, getState) => {
        const state = getState();
        const initiatorId = (0, functions_6.getResourceId)(initiator);
        const participantName = (0, functions_3.getParticipantDisplayName)(state, initiatorId);
        const notifyProps = {
            dialogProps: {
                descriptionKey: participantName ? 'liveStreaming.onBy' : 'liveStreaming.on',
                descriptionArguments: { name: participantName },
                titleKey: 'dialog.liveStreaming'
            },
            type: constants_1.NOTIFICATION_TIMEOUT_TYPE.SHORT
        };
        if (mode !== lib_jitsi_meet_1.default.constants.recording.mode.STREAM) {
            const recordingSharingUrl = (0, functions_1.getRecordingSharingUrl)(state);
            const iAmRecordingInitiator = (0, functions_3.getLocalParticipant)(state)?.id === initiatorId;
            notifyProps.dialogProps = {
                customActionHandler: undefined,
                customActionNameKey: undefined,
                descriptionKey: participantName ? 'recording.onBy' : 'recording.on',
                descriptionArguments: { name: participantName },
                titleKey: 'dialog.recording'
            };
            // fetch the recording link from the server for recording initiators in jaas meetings
            if (recordingSharingUrl
                && (0, functions_4.isVpaasMeeting)(state)
                && iAmRecordingInitiator
                && !(0, functions_6.isSavingRecordingOnDropbox)(state)) {
                const region = (0, functions_1.getMeetingRegion)(state);
                const tenant = (0, functions_4.getVpaasTenant)(state);
                try {
                    const response = await (0, functions_6.getRecordingLink)(recordingSharingUrl, sessionId, region, tenant);
                    const { url: link, urlExpirationTimeMillis: ttl } = response;
                    if (typeof APP === 'object') {
                        APP.API.notifyRecordingLinkAvailable(link, ttl);
                    }
                    // add the option to copy recording link
                    notifyProps.dialogProps = {
                        ...notifyProps.dialogProps,
                        customActionNameKey: ['recording.copyLink'],
                        customActionHandler: [() => (0, copyText_1.copyText)(link)],
                        titleKey: 'recording.on',
                        descriptionKey: 'recording.linkGenerated'
                    };
                    notifyProps.type = constants_1.NOTIFICATION_TIMEOUT_TYPE.STICKY;
                }
                catch (err) {
                    dispatch((0, actions_1.showErrorNotification)({
                        titleKey: 'recording.errorFetchingLink'
                    }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
                    return logger_1.default.error('Could not fetch recording link', err);
                }
            }
        }
        dispatch((0, actions_1.showNotification)(notifyProps.dialogProps, notifyProps.type));
    };
}
exports.showStartedRecordingNotification = showStartedRecordingNotification;
/**
 * Updates the known state for a given recording session.
 *
 * @param {Object} session - The new state to merge with the existing state in
 * redux.
 * @returns {{
 *     type: RECORDING_SESSION_UPDATED,
 *     sessionData: Object
 * }}
 */
function updateRecordingSessionData(session) {
    const status = session.getStatus();
    const timestamp = status === lib_jitsi_meet_1.JitsiRecordingConstants.status.ON
        ? Date.now() / 1000
        : undefined;
    return {
        type: actionTypes_1.RECORDING_SESSION_UPDATED,
        sessionData: {
            error: session.getError(),
            id: session.getID(),
            initiator: session.getInitiator(),
            liveStreamViewURL: session.getLiveStreamViewURL(),
            mode: session.getMode(),
            status,
            terminator: session.getTerminator(),
            timestamp
        }
    };
}
exports.updateRecordingSessionData = updateRecordingSessionData;
/**
 * Sets the selected recording service.
 *
 * @param {string} selectedRecordingService - The new selected recording service.
 * @returns {Object}
 */
function setSelectedRecordingService(selectedRecordingService) {
    return {
        type: actionTypes_1.SET_SELECTED_RECORDING_SERVICE,
        selectedRecordingService
    };
}
exports.setSelectedRecordingService = setSelectedRecordingService;
/**
 * Sets UID of the the pending streaming notification to use it when hinding
 * the notification is necessary, or unsets it when undefined (or no param) is
 * passed.
 *
 * @param {?number} uid - The UID of the notification.
 * @param {string} streamType - The type of the stream ({@code file} or
 * {@code stream}).
 * @returns {{
 *     type: SET_PENDING_RECORDING_NOTIFICATION_UID,
 *     streamType: string,
 *     uid: number
 * }}
 */
function _setPendingRecordingNotificationUid(uid, streamType) {
    return {
        type: actionTypes_1.SET_PENDING_RECORDING_NOTIFICATION_UID,
        streamType,
        uid
    };
}
/**
 * Starts local recording.
 *
 * @param {boolean} onlySelf - Whether to only record the local streams.
 * @returns {Object}
 */
function startLocalVideoRecording(onlySelf) {
    return {
        type: actionTypes_1.START_LOCAL_RECORDING,
        onlySelf
    };
}
exports.startLocalVideoRecording = startLocalVideoRecording;
/**
 * Stops local recording.
 *
 * @returns {Object}
 */
function stopLocalVideoRecording() {
    return {
        type: actionTypes_1.STOP_LOCAL_RECORDING
    };
}
exports.stopLocalVideoRecording = stopLocalVideoRecording;
/**
 * Displays the notification suggesting to start the recording.
 *
 * @param {Function} openRecordingDialog - The callback to open the recording dialog.
 * @returns {void}
 */
function showStartRecordingNotificationWithCallback(openRecordingDialog) {
    return (dispatch, getState) => {
        let state = getState();
        const { recordings } = state['features/base/config'];
        const { suggestRecording } = recordings || {};
        const recordButtonProps = (0, functions_6.getRecordButtonProps)(state);
        const isAlreadyRecording = (0, functions_6.isRecordingRunning)(state) || (0, functions_5.isRecorderTranscriptionsRunning)(state);
        const wasNotificationShown = state['features/recording'].wasStartRecordingSuggested;
        if (!suggestRecording
            || isAlreadyRecording
            || !recordButtonProps.visible
            || recordButtonProps.disabled
            || wasNotificationShown) {
            return;
        }
        dispatch(setStartRecordingNotificationShown());
        dispatch((0, actions_1.showNotification)({
            titleKey: 'notify.suggestRecordingTitle',
            descriptionKey: 'notify.suggestRecordingDescription',
            uid: constants_2.START_RECORDING_NOTIFICATION_ID,
            customActionType: [constants_any_1.BUTTON_TYPES.PRIMARY],
            customActionNameKey: ['notify.suggestRecordingAction'],
            customActionHandler: [() => {
                    state = getState();
                    const isModerator = (0, functions_3.isLocalParticipantModerator)(state);
                    const { recordingService } = state['features/base/config'];
                    const canBypassDialog = isModerator
                        && recordingService?.enabled
                        && (0, functions_2.isJwtFeatureEnabled)(state, 'recording', true);
                    if (canBypassDialog) {
                        const options = {
                            'file_recording_metadata': {
                                share: (0, functions_6.isRecordingSharingEnabled)(state)
                            }
                        };
                        const { conference } = state['features/base/conference'];
                        const autoTranscribeOnRecord = (0, functions_6.shouldAutoTranscribeOnRecord)(state);
                        conference?.startRecording({
                            mode: lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE,
                            appData: JSON.stringify(options)
                        });
                        if (autoTranscribeOnRecord) {
                            dispatch((0, actions_any_1.setRequestingSubtitles)(true, false, null));
                        }
                    }
                    else {
                        openRecordingDialog();
                    }
                    dispatch((0, actions_1.hideNotification)(constants_2.START_RECORDING_NOTIFICATION_ID));
                }],
            appearance: constants_1.NOTIFICATION_TYPE.NORMAL
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
    };
}
exports.showStartRecordingNotificationWithCallback = showStartRecordingNotificationWithCallback;
