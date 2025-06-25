"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPrejoinPageVisibility = exports.setPrejoinDeviceErrors = exports.setJoinByPhoneDialogVisiblity = exports.setSkipPrejoinOnReload = exports.setDialOutNumber = exports.setDialOutCountry = exports.setDeviceStatusWarning = exports.setDeviceStatusOk = exports.replaceVideoTrackById = exports.replaceAudioTrackById = exports.openDialInPage = exports.joinConferenceWithoutAudio = exports.setJoiningInProgress = exports.joinConference = exports.initPrejoin = exports.dialOut = void 0;
const uuid_1 = require("uuid");
const actions_1 = require("../base/config/actions");
const functions_1 = require("../base/config/functions");
const actions_2 = require("../base/connection/actions");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const functions_2 = require("../base/lib-jitsi-meet/functions");
const constants_1 = require("../base/media/constants");
const functions_3 = require("../base/media/functions");
const actions_3 = require("../base/settings/actions");
const actions_4 = require("../base/tracks/actions");
const functions_4 = require("../base/tracks/functions");
const openURLInBrowser_1 = require("../base/util/openURLInBrowser");
const functions_5 = require("../invite/functions");
const actions_5 = require("../notifications/actions");
const constants_2 = require("../notifications/constants");
const actionTypes_1 = require("./actionTypes");
const functions_6 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
const dialOutStatusToKeyMap = {
    INITIATED: 'presenceStatus.calling',
    RINGING: 'presenceStatus.ringing'
};
const DIAL_OUT_STATUS = {
    INITIATED: 'INITIATED',
    RINGING: 'RINGING',
    CONNECTED: 'CONNECTED',
    DISCONNECTED: 'DISCONNECTED',
    FAILED: 'FAILED'
};
/**
 * The time interval used between requests while polling for dial out status.
 */
const STATUS_REQ_FREQUENCY = 2000;
/**
 * The maximum number of retries while polling for dial out status.
 */
const STATUS_REQ_CAP = 45;
/**
 * Polls for status change after dial out.
 * Changes dialog message based on response, closes the dialog if there is an error,
 * joins the meeting when CONNECTED.
 *
 * @param {string} reqId - The request id used to correlate the dial out request with this one.
 * @param {Function} onSuccess - Success handler.
 * @param {Function} onFail - Fail handler.
 * @param {number} count - The number of retried calls. When it hits STATUS_REQ_CAP it should no longer make requests.
 * @returns {Function}
 */
function pollForStatus(reqId, onSuccess, onFail, count = 0) {
    return async function (dispatch, getState) {
        const state = getState();
        try {
            if (!(0, functions_6.isJoinByPhoneDialogVisible)(state)) {
                return;
            }
            const res = await (0, functions_5.executeDialOutStatusRequest)((0, functions_1.getDialOutStatusUrl)(state) ?? '', reqId);
            switch (res) {
                case DIAL_OUT_STATUS.INITIATED:
                case DIAL_OUT_STATUS.RINGING: {
                    dispatch(setDialOutStatus(dialOutStatusToKeyMap[res]));
                    if (count < STATUS_REQ_CAP) {
                        return setTimeout(() => {
                            dispatch(pollForStatus(reqId, onSuccess, onFail, count + 1));
                        }, STATUS_REQ_FREQUENCY);
                    }
                    return onFail();
                }
                case DIAL_OUT_STATUS.CONNECTED: {
                    return onSuccess();
                }
                case DIAL_OUT_STATUS.DISCONNECTED: {
                    dispatch((0, actions_5.showErrorNotification)({
                        titleKey: 'prejoin.errorDialOutDisconnected'
                    }, constants_2.NOTIFICATION_TIMEOUT_TYPE.LONG));
                    return onFail();
                }
                case DIAL_OUT_STATUS.FAILED: {
                    dispatch((0, actions_5.showErrorNotification)({
                        titleKey: 'prejoin.errorDialOutFailed'
                    }, constants_2.NOTIFICATION_TIMEOUT_TYPE.LONG));
                    return onFail();
                }
            }
        }
        catch (err) {
            dispatch((0, actions_5.showErrorNotification)({
                titleKey: 'prejoin.errorDialOutStatus'
            }, constants_2.NOTIFICATION_TIMEOUT_TYPE.LONG));
            logger_1.default.error('Error getting dial out status', err);
            onFail();
        }
    };
}
/**
 * Action used for joining the meeting with phone audio.
 * A dial out connection is tried and a polling mechanism is used for getting the status.
 * If the connection succeeds the `onSuccess` callback is executed.
 * If the phone connection fails or the number is invalid the `onFail` callback is executed.
 *
 * @param {Function} onSuccess - Success handler.
 * @param {Function} onFail - Fail handler.
 * @returns {Function}
 */
function dialOut(onSuccess, onFail) {
    return async function (dispatch, getState) {
        const state = getState();
        const reqId = (0, uuid_1.v4)();
        const url = (0, functions_1.getDialOutUrl)(state) ?? '';
        const conferenceUrl = (0, functions_6.getDialOutConferenceUrl)(state);
        const phoneNumber = (0, functions_6.getFullDialOutNumber)(state);
        const countryCode = (0, functions_6.getDialOutCountry)(state).code.toUpperCase();
        const body = {
            conferenceUrl,
            countryCode,
            name: phoneNumber,
            phoneNumber
        };
        try {
            await (0, functions_5.executeDialOutRequest)(url, body, reqId);
            dispatch(pollForStatus(reqId, onSuccess, onFail));
        }
        catch (err) {
            const notification = {
                titleKey: 'prejoin.errorDialOut',
                titleArguments: undefined
            };
            if (err.status) {
                if (err.messageKey === 'validation.failed') {
                    notification.titleKey = 'prejoin.errorValidation';
                }
                else {
                    notification.titleKey = 'prejoin.errorStatusCode';
                    notification.titleArguments = { status: err.status };
                }
            }
            dispatch((0, actions_5.showErrorNotification)(notification, constants_2.NOTIFICATION_TIMEOUT_TYPE.LONG));
            logger_1.default.error('Error dialing out', err);
            onFail();
        }
    };
}
exports.dialOut = dialOut;
/**
 * Adds all the newly created tracks to store on init.
 *
 * @param {Object[]} tracks - The newly created tracks.
 * @param {Object} errors - The errors from creating the tracks.
 *
 * @returns {Function}
 */
function initPrejoin(tracks, errors) {
    return async function (dispatch) {
        dispatch(setPrejoinDeviceErrors(errors));
        dispatch(prejoinInitialized());
        tracks.forEach(track => dispatch((0, actions_4.trackAdded)(track)));
    };
}
exports.initPrejoin = initPrejoin;
/**
 * Action used to start the conference.
 *
 * @param {Object} options - The config options that override the default ones (if any).
 * @param {boolean} ignoreJoiningInProgress - If true we won't check the joiningInProgress flag.
 * @param {string?} jid - The XMPP user's ID (e.g. {@code user@server.com}).
 * @param {string?} password - The XMPP user's password.
 * @returns {Function}
 */
function joinConference(options, ignoreJoiningInProgress = false, jid, password) {
    return async function (dispatch, getState) {
        if (!ignoreJoiningInProgress) {
            const state = getState();
            const { joiningInProgress } = state['features/prejoin'];
            if (joiningInProgress) {
                return;
            }
            dispatch(setJoiningInProgress(true));
        }
        options && dispatch((0, actions_1.updateConfig)(options));
        dispatch((0, actions_2.connect)(jid, password)).then(async () => {
            // TODO keep this here till we move tracks and conference management from
            // conference.js to react.
            const state = getState();
            let localTracks = (0, functions_4.getLocalTracks)(state['features/base/tracks']);
            // Do not signal audio/video tracks if the user joins muted.
            for (const track of localTracks) {
                // Always add the audio track on Safari because of a known issue where audio playout doesn't happen
                // if the user joins audio and video muted.
                if (track.muted && !(lib_jitsi_meet_1.browser.isWebKitBased() && track.jitsiTrack
                    && track.jitsiTrack.getType() === constants_1.MEDIA_TYPE.AUDIO)) {
                    try {
                        await dispatch((0, actions_4.replaceLocalTrack)(track.jitsiTrack, null));
                    }
                    catch (error) {
                        logger_1.default.error(`Failed to replace local track (${track.jitsiTrack}) with null: ${error}`);
                    }
                }
            }
            // Re-fetch the local tracks after muted tracks have been removed above.
            // This is needed, because the tracks are effectively disposed by the replaceLocalTrack and should not be
            // used anymore.
            localTracks = (0, functions_4.getLocalTracks)(getState()['features/base/tracks']);
            const jitsiTracks = localTracks.map((t) => t.jitsiTrack);
            APP.conference.startConference(jitsiTracks).catch(logger_1.default.error);
        })
            .catch(() => {
            // There is nothing to do here. This is handled and dispatched in base/connection/actions.
        });
    };
}
exports.joinConference = joinConference;
/**
 * Action used to set the flag for joining operation in progress.
 *
 * @param {boolean} value - The config options that override the default ones (if any).
 * @returns {Function}
 */
function setJoiningInProgress(value) {
    return {
        type: actionTypes_1.PREJOIN_JOINING_IN_PROGRESS,
        value
    };
}
exports.setJoiningInProgress = setJoiningInProgress;
/**
 * Joins the conference without audio.
 *
 * @returns {Function}
 */
function joinConferenceWithoutAudio() {
    return async function (dispatch, getState) {
        const state = getState();
        const { joiningInProgress } = state['features/prejoin'];
        if (joiningInProgress) {
            return;
        }
        dispatch(setJoiningInProgress(true));
        const tracks = state['features/base/tracks'];
        const audioTrack = (0, functions_4.getLocalAudioTrack)(tracks)?.jitsiTrack;
        if (audioTrack) {
            try {
                await dispatch((0, actions_4.replaceLocalTrack)(audioTrack, null));
            }
            catch (error) {
                logger_1.default.error(`Failed to replace local audio with null: ${error}`);
            }
        }
        dispatch(joinConference({
            startSilent: true
        }, true));
    };
}
exports.joinConferenceWithoutAudio = joinConferenceWithoutAudio;
/**
 * Opens an external page with all the dial in numbers.
 *
 * @returns {Function}
 */
function openDialInPage() {
    return function (dispatch, getState) {
        const dialInPage = (0, functions_5.getDialInfoPageURL)(getState());
        (0, openURLInBrowser_1.openURLInBrowser)(dialInPage, true);
    };
}
exports.openDialInPage = openDialInPage;
/**
 * Action used to signal that the prejoin page has been initialized.
 *
 * @returns {Object}
 */
function prejoinInitialized() {
    return {
        type: actionTypes_1.PREJOIN_INITIALIZED
    };
}
/**
 * Creates a new audio track based on a device id and replaces the current one.
 *
 * @param {string} deviceId - The deviceId of the microphone.
 * @returns {Function}
 */
function replaceAudioTrackById(deviceId) {
    return async (dispatch, getState) => {
        try {
            const tracks = getState()['features/base/tracks'];
            const newTrack = await (0, functions_2.createLocalTrack)('audio', deviceId);
            const oldTrack = (0, functions_4.getLocalAudioTrack)(tracks)?.jitsiTrack;
            const micDeviceId = newTrack.getDeviceId();
            logger_1.default.info(`Switching audio input device to ${micDeviceId}`);
            dispatch((0, actions_4.replaceLocalTrack)(oldTrack, newTrack)).then(() => {
                dispatch((0, actions_3.updateSettings)({
                    micDeviceId
                }));
            });
        }
        catch (err) {
            dispatch(setDeviceStatusWarning('prejoin.audioTrackError'));
            logger_1.default.log('Error replacing audio track', err);
        }
    };
}
exports.replaceAudioTrackById = replaceAudioTrackById;
/**
 * Creates a new video track based on a device id and replaces the current one.
 *
 * @param {string} deviceId - The deviceId of the camera.
 * @returns {Function}
 */
function replaceVideoTrackById(deviceId) {
    return async (dispatch, getState) => {
        try {
            const tracks = getState()['features/base/tracks'];
            const wasVideoMuted = (0, functions_3.isVideoMutedByUser)(getState());
            const [newTrack] = await (0, functions_4.createLocalTracksF)({ cameraDeviceId: deviceId,
                devices: ['video'] }, { dispatch,
                getState });
            const oldTrack = (0, functions_4.getLocalVideoTrack)(tracks)?.jitsiTrack;
            const cameraDeviceId = newTrack.getDeviceId();
            logger_1.default.info(`Switching camera to ${cameraDeviceId}`);
            dispatch((0, actions_4.replaceLocalTrack)(oldTrack, newTrack)).then(() => {
                dispatch((0, actions_3.updateSettings)({
                    cameraDeviceId
                }));
            });
            wasVideoMuted && newTrack.mute();
        }
        catch (err) {
            dispatch(setDeviceStatusWarning('prejoin.videoTrackError'));
            logger_1.default.log('Error replacing video track', err);
        }
    };
}
exports.replaceVideoTrackById = replaceVideoTrackById;
/**
 * Sets the device status as OK with the corresponding text.
 *
 * @param {string} deviceStatusText - The text to be set.
 * @returns {Object}
 */
function setDeviceStatusOk(deviceStatusText) {
    return {
        type: actionTypes_1.SET_DEVICE_STATUS,
        value: {
            deviceStatusText,
            deviceStatusType: 'ok'
        }
    };
}
exports.setDeviceStatusOk = setDeviceStatusOk;
/**
 * Sets the device status as 'warning' with the corresponding text.
 *
 * @param {string} deviceStatusText - The text to be set.
 * @returns {Object}
 */
function setDeviceStatusWarning(deviceStatusText) {
    return {
        type: actionTypes_1.SET_DEVICE_STATUS,
        value: {
            deviceStatusText,
            deviceStatusType: 'warning'
        }
    };
}
exports.setDeviceStatusWarning = setDeviceStatusWarning;
/**
 * Action used to set the dial out status.
 *
 * @param {string} value - The status.
 * @returns {Object}
 */
function setDialOutStatus(value) {
    return {
        type: actionTypes_1.SET_DIALOUT_STATUS,
        value
    };
}
/**
 * Action used to set the dial out country.
 *
 * @param {{ name: string, dialCode: string, code: string }} value - The country.
 * @returns {Object}
 */
function setDialOutCountry(value) {
    return {
        type: actionTypes_1.SET_DIALOUT_COUNTRY,
        value
    };
}
exports.setDialOutCountry = setDialOutCountry;
/**
 * Action used to set the dial out number.
 *
 * @param {string} value - The dial out number.
 * @returns {Object}
 */
function setDialOutNumber(value) {
    return {
        type: actionTypes_1.SET_DIALOUT_NUMBER,
        value
    };
}
exports.setDialOutNumber = setDialOutNumber;
/**
 * Sets the visibility of the prejoin page when a client reload
 * is triggered as a result of call migration initiated by Jicofo.
 *
 * @param {boolean} value - The visibility value.
 * @returns {Object}
 */
function setSkipPrejoinOnReload(value) {
    return {
        type: actionTypes_1.SET_SKIP_PREJOIN_RELOAD,
        value
    };
}
exports.setSkipPrejoinOnReload = setSkipPrejoinOnReload;
/**
 * Action used to set the visiblitiy of the 'JoinByPhoneDialog'.
 *
 * @param {boolean} value - The value.
 * @returns {Object}
 */
function setJoinByPhoneDialogVisiblity(value) {
    return {
        type: actionTypes_1.SET_JOIN_BY_PHONE_DIALOG_VISIBLITY,
        value
    };
}
exports.setJoinByPhoneDialogVisiblity = setJoinByPhoneDialogVisiblity;
/**
 * Action used to set the initial errors after creating the tracks.
 *
 * @param {Object} value - The track errors.
 * @returns {Object}
 */
function setPrejoinDeviceErrors(value) {
    return {
        type: actionTypes_1.SET_PREJOIN_DEVICE_ERRORS,
        value
    };
}
exports.setPrejoinDeviceErrors = setPrejoinDeviceErrors;
/**
 * Action used to set the visibility of the prejoin page.
 *
 * @param {boolean} value - The value.
 * @returns {Object}
 */
function setPrejoinPageVisibility(value) {
    return {
        type: actionTypes_1.SET_PREJOIN_PAGE_VISIBILITY,
        value
    };
}
exports.setPrejoinPageVisibility = setPrejoinPageVisibility;
