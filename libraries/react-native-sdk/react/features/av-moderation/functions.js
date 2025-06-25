"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldShowModeratedNotification = exports.getParticipantsAskingToAudioUnmute = exports.isParticipantPending = exports.isParticipantApproved = exports.isLocalParticipantApproved = exports.isLocalParticipantApprovedFromState = exports.isSupported = exports.isEnabled = exports.isEnabledFromState = void 0;
const constants_1 = require("../base/media/constants");
const functions_1 = require("../base/participants/functions");
const functions_2 = require("../breakout-rooms/functions");
const constants_2 = require("./constants");
/**
 * Returns this feature's root state.
 *
 * @param {IReduxState} state - Global state.
 * @returns {Object} Feature state.
 */
const getState = (state) => state['features/av-moderation'];
/**
 * We use to construct once the empty array so we can keep the same instance between calls
 * of getParticipantsAskingToAudioUnmute.
 *
 * @type {any[]}
 */
const EMPTY_ARRAY = [];
/**
 * Returns whether moderation is enabled per media type.
 *
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
const isEnabledFromState = (mediaType, state) => (mediaType === constants_1.MEDIA_TYPE.AUDIO
    ? getState(state)?.audioModerationEnabled
    : getState(state)?.videoModerationEnabled) === true;
exports.isEnabledFromState = isEnabledFromState;
/**
 * Returns whether moderation is enabled per media type.
 *
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @returns {boolean}
 */
const isEnabled = (mediaType) => (state) => (0, exports.isEnabledFromState)(mediaType, state);
exports.isEnabled = isEnabled;
/**
 * Returns whether moderation is supported by the backend.
 *
 * @returns {boolean}
 */
const isSupported = () => (state) => {
    const { conference } = state['features/base/conference'];
    return Boolean(!(0, functions_2.isInBreakoutRoom)(state) && conference?.isAVModerationSupported());
};
exports.isSupported = isSupported;
/**
 * Returns whether local participant is approved to unmute a media type.
 *
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
const isLocalParticipantApprovedFromState = (mediaType, state) => {
    const approved = (mediaType === constants_1.MEDIA_TYPE.AUDIO
        ? getState(state).audioUnmuteApproved
        : getState(state).videoUnmuteApproved) === true;
    return approved || (0, functions_1.isLocalParticipantModerator)(state);
};
exports.isLocalParticipantApprovedFromState = isLocalParticipantApprovedFromState;
/**
 * Returns whether local participant is approved to unmute a media type.
 *
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @returns {boolean}
 */
const isLocalParticipantApproved = (mediaType) => (state) => (0, exports.isLocalParticipantApprovedFromState)(mediaType, state);
exports.isLocalParticipantApproved = isLocalParticipantApproved;
/**
 * Returns a selector creator which determines if the participant is approved or not for a media type.
 *
 * @param {string} id - The participant id.
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @returns {boolean}
 */
const isParticipantApproved = (id, mediaType) => (state) => {
    const storeKey = constants_2.MEDIA_TYPE_TO_WHITELIST_STORE_KEY[mediaType];
    const avModerationState = getState(state);
    const stateForMediaType = avModerationState[storeKey];
    return Boolean(stateForMediaType && stateForMediaType[id]);
};
exports.isParticipantApproved = isParticipantApproved;
/**
 * Returns a selector creator which determines if the participant is pending or not for a media type.
 *
 * @param {IParticipant} participant - The participant.
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @returns {boolean}
 */
const isParticipantPending = (participant, mediaType) => (state) => {
    const storeKey = constants_2.MEDIA_TYPE_TO_PENDING_STORE_KEY[mediaType];
    const arr = getState(state)[storeKey];
    return Boolean(arr.find(pending => pending.id === participant.id));
};
exports.isParticipantPending = isParticipantPending;
/**
 * Selector which returns a list with all the participants asking to audio unmute.
 * This is visible only for the moderator.
 *
 * @param {Object} state - The global state.
 * @returns {Array<Object>}
 */
const getParticipantsAskingToAudioUnmute = (state) => {
    if ((0, functions_1.isLocalParticipantModerator)(state)) {
        return getState(state).pendingAudio;
    }
    return EMPTY_ARRAY;
};
exports.getParticipantsAskingToAudioUnmute = getParticipantsAskingToAudioUnmute;
/**
 * Returns true if a special notification can be displayed when a participant
 * tries to unmute.
 *
 * @param {MediaType} mediaType - 'audio' or 'video' media type.
 * @param {Object} state - The global state.
 * @returns {boolean}
 */
const shouldShowModeratedNotification = (mediaType, state) => (0, exports.isEnabledFromState)(mediaType, state)
    && !(0, exports.isLocalParticipantApprovedFromState)(mediaType, state);
exports.shouldShowModeratedNotification = shouldShowModeratedNotification;
