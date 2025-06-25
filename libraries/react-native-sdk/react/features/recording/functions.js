"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRecordingAudioFiles = exports.unregisterRecordingAudioFiles = exports.isRemoteParticipantRecordingLocally = exports.sendMeetingHighlight = exports.getResourceId = exports.getRecordButtonProps = exports.isRecordingSharingEnabled = exports.shouldAutoTranscribeOnRecord = exports.canStopRecording = exports.isRecordingRunning = exports.isCloudRecordingRunning = exports.supportsLocalRecording = exports.getSessionStatusToShow = exports.isHighlightMeetingMomentDisabled = exports.isSavingRecordingOnDropbox = exports.getRecordingLink = exports.getSessionById = exports.getRecordingDurationEstimation = exports.getActiveSession = void 0;
const i18next_1 = __importDefault(require("i18next"));
const utils_1 = require("../base/environment/utils");
const functions_1 = require("../base/jwt/functions");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const functions_2 = require("../base/media/functions");
const functions_3 = require("../base/participants/functions");
const actions_1 = require("../base/sounds/actions");
const functions_4 = require("../breakout-rooms/functions");
const functions_5 = require("../dropbox/functions");
const functions_any_1 = require("../dynamic-branding/functions.any");
const functions_6 = require("../transcribing/functions");
const LocalRecordingManager_1 = __importDefault(require("./components/Recording/LocalRecordingManager"));
const constants_1 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
const sounds_1 = require("./sounds");
/**
 * Searches in the passed in redux state for an active recording session of the
 * passed in mode.
 *
 * @param {Object} state - The redux state to search in.
 * @param {string} mode - Find an active recording session of the given mode.
 * @returns {Object|undefined}
 */
function getActiveSession(state, mode) {
    const { sessionDatas } = state['features/recording'];
    const { status: statusConstants } = lib_jitsi_meet_1.JitsiRecordingConstants;
    return sessionDatas.find(sessionData => sessionData.mode === mode
        && (sessionData.status === statusConstants.ON
            || sessionData.status === statusConstants.PENDING));
}
exports.getActiveSession = getActiveSession;
/**
 * Returns an estimated recording duration based on the size of the video file
 * in MB. The estimate is calculated under the assumption that 1 min of recorded
 * video needs 10MB of storage on average.
 *
 * @param {number} size - The size in MB of the recorded video.
 * @returns {number} - The estimated duration in minutes.
 */
function getRecordingDurationEstimation(size) {
    return Math.floor((size || 0) / 10);
}
exports.getRecordingDurationEstimation = getRecordingDurationEstimation;
/**
 * Searches in the passed in redux state for a recording session that matches
 * the passed in recording session ID.
 *
 * @param {Object} state - The redux state to search in.
 * @param {string} id - The ID of the recording session to find.
 * @returns {Object|undefined}
 */
function getSessionById(state, id) {
    return state['features/recording'].sessionDatas.find(sessionData => sessionData.id === id);
}
exports.getSessionById = getSessionById;
/**
 * Fetches the recording link from the server.
 *
 * @param {string} url - The base url.
 * @param {string} recordingSessionId - The ID of the recording session to find.
 * @param {string} region - The meeting region.
 * @param {string} tenant - The meeting tenant.
 * @returns {Promise<any>}
 */
async function getRecordingLink(url, recordingSessionId, region, tenant) {
    const fullUrl = `${url}?recordingSessionId=${recordingSessionId}&region=${region}&tenant=${tenant}`;
    const res = await fetch(fullUrl, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const json = await res.json();
    return res.ok ? json : Promise.reject(json);
}
exports.getRecordingLink = getRecordingLink;
/**
 * Selector used for determining if recording is saved on dropbox.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {string}
 */
function isSavingRecordingOnDropbox(state) {
    return (0, functions_5.isEnabled)(state)
        && state['features/recording'].selectedRecordingService === constants_1.RECORDING_TYPES.DROPBOX;
}
exports.isSavingRecordingOnDropbox = isSavingRecordingOnDropbox;
/**
 * Selector used for determining disable state for the meeting highlight button.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {string}
 */
function isHighlightMeetingMomentDisabled(state) {
    return state['features/recording'].disableHighlightMeetingMoment;
}
exports.isHighlightMeetingMomentDisabled = isHighlightMeetingMomentDisabled;
/**
 * Returns the recording session status that is to be shown in a label. E.g. If
 * there is a session with the status OFF and one with PENDING, then the PENDING
 * one will be shown, because that is likely more important for the user to see.
 *
 * @param {Object} state - The redux state to search in.
 * @param {string} mode - The recording mode to get status for.
 * @returns {string|undefined}
 */
function getSessionStatusToShow(state, mode) {
    const recordingSessions = state['features/recording'].sessionDatas;
    let status;
    if (Array.isArray(recordingSessions)) {
        for (const session of recordingSessions) {
            if (session.mode === mode
                && (!status
                    || (constants_1.RECORDING_STATUS_PRIORITIES.indexOf(session.status)
                        > constants_1.RECORDING_STATUS_PRIORITIES.indexOf(status)))) {
                status = session.status;
            }
        }
    }
    if (!status && mode === lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE
        && (LocalRecordingManager_1.default.isRecordingLocally() || isRemoteParticipantRecordingLocally(state))) {
        status = lib_jitsi_meet_1.JitsiRecordingConstants.status.ON;
    }
    return status;
}
exports.getSessionStatusToShow = getSessionStatusToShow;
/**
 * Check if local recording is supported.
 *
 * @returns {boolean} - Whether local recording is supported or not.
 */
function supportsLocalRecording() {
    return lib_jitsi_meet_1.browser.isChromiumBased() && !lib_jitsi_meet_1.browser.isElectron() && !(0, utils_1.isMobileBrowser)()
        && navigator.product !== 'ReactNative';
}
exports.supportsLocalRecording = supportsLocalRecording;
/**
 * Returns true if there is a cloud recording running.
 *
 * @param {IReduxState} state - The redux state to search in.
 * @returns {boolean}
 */
function isCloudRecordingRunning(state) {
    return Boolean(getActiveSession(state, lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE));
}
exports.isCloudRecordingRunning = isCloudRecordingRunning;
/**
 * Returns true if there is a recording session running.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {boolean}
 */
function isRecordingRunning(state) {
    return (isCloudRecordingRunning(state)
        || LocalRecordingManager_1.default.isRecordingLocally());
}
exports.isRecordingRunning = isRecordingRunning;
/**
 * Returns true if the participant can stop recording.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {boolean}
 */
function canStopRecording(state) {
    if (LocalRecordingManager_1.default.isRecordingLocally()) {
        return true;
    }
    if (isCloudRecordingRunning(state) || (0, functions_6.isRecorderTranscriptionsRunning)(state)) {
        return (0, functions_3.isLocalParticipantModerator)(state) && (0, functions_1.isJwtFeatureEnabled)(state, 'recording', true);
    }
    return false;
}
exports.canStopRecording = canStopRecording;
/**
 * Returns whether the transcription should start automatically when recording starts.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {boolean}
 */
function shouldAutoTranscribeOnRecord(state) {
    const { transcription } = state['features/base/config'];
    return (transcription?.autoTranscribeOnRecord ?? true) && (0, functions_6.canAddTranscriber)(state);
}
exports.shouldAutoTranscribeOnRecord = shouldAutoTranscribeOnRecord;
/**
 * Returns whether the recording should be shared.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {boolean}
 */
function isRecordingSharingEnabled(state) {
    const { recordingService } = state['features/base/config'];
    return recordingService?.sharingEnabled ?? false;
}
exports.isRecordingSharingEnabled = isRecordingSharingEnabled;
/**
 * Returns the recording button props.
 *
 * @param {Object} state - The redux state to search in.
 *
 * @returns {{
 *    disabled: boolean,
 *    tooltip: string,
 *    visible: boolean
 * }}
 */
function getRecordButtonProps(state) {
    let visible;
    // a button can be disabled/enabled if enableFeaturesBasedOnToken
    // is on or if the livestreaming is running.
    let disabled = false;
    let tooltip = '';
    // If the containing component provides the visible prop, that is one
    // above all, but if not, the button should be autonomus and decide on
    // its own to be visible or not.
    const isModerator = (0, functions_3.isLocalParticipantModerator)(state);
    const { recordingService, localRecording } = state['features/base/config'];
    const localRecordingEnabled = !localRecording?.disable && supportsLocalRecording();
    const dropboxEnabled = (0, functions_5.isEnabled)(state);
    const recordingEnabled = recordingService?.enabled || dropboxEnabled;
    if (localRecordingEnabled) {
        visible = true;
    }
    else if (isModerator) {
        visible = recordingEnabled ? (0, functions_1.isJwtFeatureEnabled)(state, 'recording', true) : false;
    }
    // disable the button if the livestreaming is running.
    if (visible && getActiveSession(state, lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM)) {
        disabled = true;
        tooltip = 'dialog.recordingDisabledBecauseOfActiveLiveStreamingTooltip';
    }
    // disable the button if we are in a breakout room.
    if ((0, functions_4.isInBreakoutRoom)(state)) {
        disabled = true;
        visible = false;
    }
    return {
        disabled,
        tooltip,
        visible
    };
}
exports.getRecordButtonProps = getRecordButtonProps;
/**
 * Returns the resource id.
 *
 * @param {Object | string} recorder - A participant or it's resource.
 * @returns {string|undefined}
 */
function getResourceId(recorder) {
    if (recorder) {
        return typeof recorder === 'string'
            ? recorder
            : recorder.getId();
    }
}
exports.getResourceId = getResourceId;
/**
 * Sends a meeting highlight to backend.
 *
 * @param  {Object} state - Redux state.
 * @returns {boolean} - True if sent, false otherwise.
 */
async function sendMeetingHighlight(state) {
    const { webhookProxyUrl: url } = state['features/base/config'];
    const { conference } = state['features/base/conference'];
    const { jwt } = state['features/base/jwt'];
    const { connection } = state['features/base/connection'];
    const jid = connection?.getJid();
    const localParticipant = (0, functions_3.getLocalParticipant)(state);
    const headers = {
        ...jwt ? { 'Authorization': `Bearer ${jwt}` } : {},
        'Content-Type': 'application/json'
    };
    const reqBody = {
        meetingFqn: (0, functions_any_1.extractFqnFromPath)(state),
        sessionId: conference?.getMeetingUniqueId(),
        submitted: Date.now(),
        participantId: localParticipant?.jwtId,
        participantName: localParticipant?.name,
        participantJid: jid
    };
    if (url) {
        try {
            const res = await fetch(`${url}/v2/highlights`, {
                method: 'POST',
                headers,
                body: JSON.stringify(reqBody)
            });
            if (res.ok) {
                return true;
            }
            logger_1.default.error('Status error:', res.status);
        }
        catch (err) {
            logger_1.default.error('Could not send request', err);
        }
    }
    return false;
}
exports.sendMeetingHighlight = sendMeetingHighlight;
/**
 * Whether a remote participant is recording locally or not.
 *
 * @param {Object} state - Redux state.
 * @returns {boolean}
 */
function isRemoteParticipantRecordingLocally(state) {
    const participants = (0, functions_3.getRemoteParticipants)(state);
    // eslint-disable-next-line prefer-const
    for (let value of participants.values()) {
        if (value.localRecording) {
            return true;
        }
    }
    return false;
}
exports.isRemoteParticipantRecordingLocally = isRemoteParticipantRecordingLocally;
/**
 * Unregisters the audio files based on locale.
 *
 * @param {Dispatch<any>} dispatch - The redux dispatch function.
 * @returns {void}
 */
function unregisterRecordingAudioFiles(dispatch) {
    dispatch((0, actions_1.unregisterSound)(sounds_1.LIVE_STREAMING_OFF_SOUND_FILE));
    dispatch((0, actions_1.unregisterSound)(sounds_1.LIVE_STREAMING_ON_SOUND_FILE));
    dispatch((0, actions_1.unregisterSound)(sounds_1.RECORDING_OFF_SOUND_FILE));
    dispatch((0, actions_1.unregisterSound)(sounds_1.RECORDING_ON_SOUND_FILE));
}
exports.unregisterRecordingAudioFiles = unregisterRecordingAudioFiles;
/**
 * Registers the audio files based on locale.
 *
 * @param {Dispatch<any>} dispatch - The redux dispatch function.
 * @param {boolean|undefined} shouldUnregister - Whether the sounds should be unregistered.
 * @returns {void}
 */
function registerRecordingAudioFiles(dispatch, shouldUnregister) {
    const language = i18next_1.default.language;
    if (shouldUnregister) {
        unregisterRecordingAudioFiles(dispatch);
    }
    dispatch((0, actions_1.registerSound)(constants_1.LIVE_STREAMING_OFF_SOUND_ID, (0, functions_2.getSoundFileSrc)(sounds_1.LIVE_STREAMING_OFF_SOUND_FILE, language)));
    dispatch((0, actions_1.registerSound)(constants_1.LIVE_STREAMING_ON_SOUND_ID, (0, functions_2.getSoundFileSrc)(sounds_1.LIVE_STREAMING_ON_SOUND_FILE, language)));
    dispatch((0, actions_1.registerSound)(constants_1.RECORDING_OFF_SOUND_ID, (0, functions_2.getSoundFileSrc)(sounds_1.RECORDING_OFF_SOUND_FILE, language)));
    dispatch((0, actions_1.registerSound)(constants_1.RECORDING_ON_SOUND_ID, (0, functions_2.getSoundFileSrc)(sounds_1.RECORDING_ON_SOUND_FILE, language)));
}
exports.registerRecordingAudioFiles = registerRecordingAudioFiles;
