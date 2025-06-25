"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerE2eeAudioFiles = exports.unregisterE2eeAudioFiles = exports.displayVerification = exports.isMaxModeThresholdReached = exports.isMaxModeReached = exports.doesEveryoneSupportE2EE = void 0;
const i18next_1 = __importDefault(require("i18next"));
const functions_1 = require("../base/media/functions");
const functions_2 = require("../base/participants/functions");
const functions_3 = require("../base/redux/functions");
const actions_1 = require("../base/sounds/actions");
const constants_1 = require("./constants");
const sounds_1 = require("./sounds");
/**
 * Gets the value of a specific React {@code Component} prop of the currently
 * mounted {@link App}.
 *
 * @param {IStateful} stateful - The redux store or {@code getState}
 * function.
 * @param {string} propName - The name of the React {@code Component} prop of
 * the currently mounted {@code App} to get.
 * @returns {*} The value of the specified React {@code Component} prop of the
 * currently mounted {@code App}.
 */
function doesEveryoneSupportE2EE(stateful) {
    const state = (0, functions_3.toState)(stateful);
    const { numberOfParticipantsNotSupportingE2EE } = state['features/base/participants'];
    const { e2eeSupported } = state['features/base/conference'];
    const participantCount = (0, functions_2.getParticipantCountWithFake)(state);
    if (participantCount === 1) {
        // This will happen if we are alone.
        return e2eeSupported;
    }
    return numberOfParticipantsNotSupportingE2EE === 0;
}
exports.doesEveryoneSupportE2EE = doesEveryoneSupportE2EE;
/**
 * Returns true is the number of participants is larger than {@code MAX_MODE_LIMIT}.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {boolean}
 */
function isMaxModeReached(stateful) {
    const participantCount = (0, functions_2.getParticipantCount)((0, functions_3.toState)(stateful));
    return participantCount >= constants_1.MAX_MODE_LIMIT;
}
exports.isMaxModeReached = isMaxModeReached;
/**
 * Returns true is the number of participants is larger than {@code MAX_MODE_LIMIT + MAX_MODE_THREHOLD}.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {boolean}
 */
function isMaxModeThresholdReached(stateful) {
    const participantCount = (0, functions_2.getParticipantCount)((0, functions_3.toState)(stateful));
    return participantCount >= constants_1.MAX_MODE_LIMIT + constants_1.MAX_MODE_THRESHOLD;
}
exports.isMaxModeThresholdReached = isMaxModeThresholdReached;
/**
 * Returns whether e2ee is enabled by the backend.
 *
 * @param {Object} state - The redux state.
 * @param {string} pId - The participant id.
 * @returns {boolean}
 */
function displayVerification(state, pId) {
    const { conference } = state['features/base/conference'];
    const participant = (0, functions_2.getParticipantById)(state, pId);
    return Boolean(conference?.isE2EEEnabled()
        && participant?.e2eeVerificationAvailable
        && participant?.e2eeVerified === undefined);
}
exports.displayVerification = displayVerification;
/**
 * Unregisters the audio files based on locale.
 *
 * @param {Dispatch<any>} dispatch - The redux dispatch function.
 * @returns {void}
 */
function unregisterE2eeAudioFiles(dispatch) {
    dispatch((0, actions_1.unregisterSound)(constants_1.E2EE_OFF_SOUND_ID));
    dispatch((0, actions_1.unregisterSound)(constants_1.E2EE_ON_SOUND_ID));
}
exports.unregisterE2eeAudioFiles = unregisterE2eeAudioFiles;
/**
 * Registers the audio files based on locale.
 *
 * @param {Dispatch<any>} dispatch - The redux dispatch function.
 * @param {boolean|undefined} shouldUnregister - Whether the sounds should be unregistered.
 * @returns {void}
 */
function registerE2eeAudioFiles(dispatch, shouldUnregister) {
    const language = i18next_1.default.language;
    shouldUnregister && unregisterE2eeAudioFiles(dispatch);
    dispatch((0, actions_1.registerSound)(constants_1.E2EE_OFF_SOUND_ID, (0, functions_1.getSoundFileSrc)(sounds_1.E2EE_OFF_SOUND_FILE, language)));
    dispatch((0, actions_1.registerSound)(constants_1.E2EE_ON_SOUND_ID, (0, functions_1.getSoundFileSrc)(sounds_1.E2EE_ON_SOUND_FILE, language)));
}
exports.registerE2eeAudioFiles = registerE2eeAudioFiles;
