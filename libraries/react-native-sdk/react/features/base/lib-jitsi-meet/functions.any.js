"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFatalJitsiConnectionError = exports.isFatalJitsiConferenceError = exports.isAnalyticsEnabled = exports.createLocalTrack = void 0;
const functions_1 = require("../redux/functions");
const _1 = __importDefault(require("./_"));
const JitsiConferenceErrors = _1.default.errors.conference;
const JitsiConnectionErrors = _1.default.errors.connection;
/**
 * Creates a {@link JitsiLocalTrack} model from the given device id.
 *
 * @param {string} type - The media type of track being created. Expected values
 * are "video" or "audio".
 * @param {string} deviceId - The id of the target media source.
 * @param {number} [timeout] - A timeout for the JitsiMeetJS.createLocalTracks function call.
 * @param {Object} additionalOptions - Extra options to be passed to lib-jitsi-meet's {@code createLocalTracks}.
 *
 * @returns {Promise<JitsiLocalTrack>}
 */
function createLocalTrack(type, deviceId, timeout, additionalOptions) {
    return (_1.default.createLocalTracks({
        cameraDeviceId: deviceId,
        devices: [type],
        // eslint-disable-next-line camelcase
        firefox_fake_device: window.config?.firefox_fake_device,
        micDeviceId: deviceId,
        timeout,
        ...additionalOptions
    })
        .then(([jitsiLocalTrack]) => jitsiLocalTrack));
}
exports.createLocalTrack = createLocalTrack;
/**
 * Determines whether analytics is enabled in a specific redux {@code store}.
 *
 * @param {IStateful} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {boolean} If analytics is enabled, {@code true}; {@code false},
 * otherwise.
 */
function isAnalyticsEnabled(stateful) {
    const { disableThirdPartyRequests, analytics = {} } = (0, functions_1.toState)(stateful)['features/base/config'];
    return !(disableThirdPartyRequests || analytics.disabled);
}
exports.isAnalyticsEnabled = isAnalyticsEnabled;
/**
 * Determines whether a specific {@link JitsiConferenceErrors} instance
 * indicates a fatal {@link JitsiConference} error.
 *
 * FIXME Figure out the category of errors defined by the function and describe
 * that category. I've currently named the category fatal because it appears to
 * be used in the cases of unrecoverable errors that necessitate a reload.
 *
 * @param {Error|string} error - The {@code JitsiConferenceErrors} instance to
 * categorize/classify or an {@link Error}-like object.
 * @returns {boolean} If the specified {@code JitsiConferenceErrors} instance
 * indicates a fatal {@code JitsiConference} error, {@code true}; otherwise,
 * {@code false}.
 */
function isFatalJitsiConferenceError(error) {
    if (typeof error !== 'string') {
        error = error.name; // eslint-disable-line no-param-reassign
    }
    return (error === JitsiConferenceErrors.FOCUS_DISCONNECTED
        || error === JitsiConferenceErrors.FOCUS_LEFT
        || error === JitsiConferenceErrors.ICE_FAILED
        || error === JitsiConferenceErrors.OFFER_ANSWER_FAILED
        || error === JitsiConferenceErrors.VIDEOBRIDGE_NOT_AVAILABLE);
}
exports.isFatalJitsiConferenceError = isFatalJitsiConferenceError;
/**
 * Determines whether a specific {@link JitsiConnectionErrors} instance
 * indicates a fatal {@link JitsiConnection} error.
 *
 * FIXME Figure out the category of errors defined by the function and describe
 * that category. I've currently named the category fatal because it appears to
 * be used in the cases of unrecoverable errors that necessitate a reload.
 *
 * @param {Error|string} error - The {@code JitsiConnectionErrors} instance to
 * categorize/classify or an {@link Error}-like object.
 * @returns {boolean} If the specified {@code JitsiConnectionErrors} instance
 * indicates a fatal {@code JitsiConnection} error, {@code true}; otherwise,
 * {@code false}.
 */
function isFatalJitsiConnectionError(error) {
    if (typeof error !== 'string') {
        error = error.name; // eslint-disable-line no-param-reassign
    }
    return (error === JitsiConnectionErrors.CONNECTION_DROPPED_ERROR
        || error === JitsiConnectionErrors.OTHER_ERROR
        || error === JitsiConnectionErrors.SERVER_ERROR);
}
exports.isFatalJitsiConnectionError = isFatalJitsiConnectionError;
