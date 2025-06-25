"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.participantToParticipantInfo = exports._sendReadyToClose = exports.sendEvent = void 0;
const debounce_1 = __importDefault(require("lodash/debounce"));
const react_native_1 = require("react-native");
const actions_1 = require("./actions");
/**
 * Sends a specific event to the native counterpart of the External API. Native
 * apps may listen to such events via the mechanisms provided by the (native)
 * mobile Jitsi Meet SDK.
 *
 * @param {Object} store - The redux store.
 * @param {string} name - The name of the event to send.
 * @param {Object} data - The details/specifics of the event to send determined
 * by/associated with the specified {@code name}.
 * @returns {void}
 */
function sendEvent(store, name, data) {
    react_native_1.NativeModules.ExternalAPI.sendEvent(name, data);
}
exports.sendEvent = sendEvent;
/**
 * Debounced sending of `readyToClose`.
 */
exports._sendReadyToClose = (0, debounce_1.default)(dispatch => {
    dispatch((0, actions_1.readyToClose)());
}, 2500, { leading: true });
/**
 * Returns a participant info object based on the passed participant object from redux.
 *
 * @param {Participant} participant - The participant object from the redux store.
 * @returns {Object} - The participant info object.
 */
function participantToParticipantInfo(participant) {
    return {
        isLocal: participant.local,
        email: participant.email,
        name: participant.name,
        participantId: participant.id,
        displayName: participant.displayName,
        avatarUrl: participant.avatarURL,
        role: participant.role
    };
}
exports.participantToParticipantInfo = participantToParticipantInfo;
