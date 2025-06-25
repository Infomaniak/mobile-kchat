"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isParticipantsPaneEnabled = exports.isBreakoutRoomRenameAllowed = exports.isCurrentRoomRenamable = exports.isMuteAllVisible = exports.isMoreActionsVisible = exports.participantMatchesSearch = exports.getSortedParticipantIds = exports.shouldRenderInviteButton = exports.getQuickActionButtonType = exports.getParticipantsPaneOpen = exports.getParticipantsPaneConfig = exports.getParticipantVideoMediaState = exports.getParticipantAudioMediaState = exports.isForceMuted = void 0;
const functions_1 = require("../av-moderation/functions");
const functions_2 = require("../base/conference/functions");
const constants_1 = require("../base/flags/constants");
const functions_3 = require("../base/flags/functions");
const constants_2 = require("../base/media/constants");
const functions_4 = require("../base/participants/functions");
const functions_5 = require("../base/redux/functions");
const strings_1 = require("../base/util/strings");
const constants_3 = require("../breakout-rooms/constants");
const functions_6 = require("../breakout-rooms/functions");
const constants_4 = require("./constants");
/**
 * Checks if a participant is force muted.
 *
 * @param {IParticipant|undefined} participant - The participant.
 * @param {MediaType} mediaType - The media type.
 * @param {IReduxState} state - The redux state.
 * @returns {MediaState}
 */
function isForceMuted(participant, mediaType, state) {
    if ((0, functions_1.isEnabledFromState)(mediaType, state)) {
        if (participant?.local) {
            return !(0, functions_1.isLocalParticipantApprovedFromState)(mediaType, state);
        }
        // moderators cannot be force muted
        if ((0, functions_4.isParticipantModerator)(participant)) {
            return false;
        }
        return !(0, functions_1.isParticipantApproved)(participant?.id ?? '', mediaType)(state);
    }
    return false;
}
exports.isForceMuted = isForceMuted;
/**
 * Determines the audio media state (the mic icon) for a participant.
 *
 * @param {IParticipant} participant - The participant.
 * @param {boolean} muted - The mute state of the participant.
 * @param {IReduxState} state - The redux state.
 * @returns {MediaState}
 */
function getParticipantAudioMediaState(participant, muted, state) {
    const dominantSpeaker = (0, functions_4.getDominantSpeakerParticipant)(state);
    if (muted) {
        if (isForceMuted(participant, constants_2.MEDIA_TYPE.AUDIO, state)) {
            return constants_4.MEDIA_STATE.FORCE_MUTED;
        }
        return constants_4.MEDIA_STATE.MUTED;
    }
    if (participant === dominantSpeaker) {
        return constants_4.MEDIA_STATE.DOMINANT_SPEAKER;
    }
    return constants_4.MEDIA_STATE.UNMUTED;
}
exports.getParticipantAudioMediaState = getParticipantAudioMediaState;
/**
 * Determines the video media state (the mic icon) for a participant.
 *
 * @param {IParticipant} participant - The participant.
 * @param {boolean} muted - The mute state of the participant.
 * @param {IReduxState} state - The redux state.
 * @returns {MediaState}
 */
function getParticipantVideoMediaState(participant, muted, state) {
    if (muted) {
        if (isForceMuted(participant, constants_2.MEDIA_TYPE.VIDEO, state)) {
            return constants_4.MEDIA_STATE.FORCE_MUTED;
        }
        return constants_4.MEDIA_STATE.MUTED;
    }
    return constants_4.MEDIA_STATE.UNMUTED;
}
exports.getParticipantVideoMediaState = getParticipantVideoMediaState;
/**
 * Returns this feature's root state.
 *
 * @param {IReduxState} state - Global state.
 * @returns {Object} Feature state.
 */
const getState = (state) => state[constants_4.REDUCER_KEY];
/**
 * Returns the participants pane config.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {Object}
 */
const getParticipantsPaneConfig = (stateful) => {
    const state = (0, functions_5.toState)(stateful);
    const { participantsPane = {} } = state['features/base/config'];
    return participantsPane;
};
exports.getParticipantsPaneConfig = getParticipantsPaneConfig;
/**
 * Is the participants pane open.
 *
 * @param {IReduxState} state - Global state.
 * @returns {boolean} Is the participants pane open.
 */
const getParticipantsPaneOpen = (state) => Boolean(getState(state)?.isOpen);
exports.getParticipantsPaneOpen = getParticipantsPaneOpen;
/**
 * Returns the type of quick action button to be displayed for a participant.
 * The button is displayed when hovering a participant from the participant list.
 *
 * @param {IParticipant} participant - The participant.
 * @param {boolean} isAudioMuted - If audio is muted for the participant.
 * @param {boolean} isVideoMuted - If audio is muted for the participant.
 * @param {IReduxState} state - The redux state.
 * @returns {string} - The type of the quick action button.
 */
function getQuickActionButtonType(participant, isAudioMuted, isVideoMuted, state) {
    // handled only by moderators
    const isVideoForceMuted = isForceMuted(participant, constants_2.MEDIA_TYPE.VIDEO, state);
    if ((0, functions_4.isLocalParticipantModerator)(state)) {
        if (!isAudioMuted) {
            return constants_4.QUICK_ACTION_BUTTON.MUTE;
        }
        if (!isVideoMuted) {
            return constants_4.QUICK_ACTION_BUTTON.STOP_VIDEO;
        }
        if (isVideoForceMuted) {
            return constants_4.QUICK_ACTION_BUTTON.ALLOW_VIDEO;
        }
        if ((0, functions_1.isSupported)()(state)) {
            return constants_4.QUICK_ACTION_BUTTON.ASK_TO_UNMUTE;
        }
    }
    return constants_4.QUICK_ACTION_BUTTON.NONE;
}
exports.getQuickActionButtonType = getQuickActionButtonType;
/**
 * Returns true if the invite button should be rendered.
 *
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
const shouldRenderInviteButton = (state) => {
    const { disableInviteFunctions } = (0, functions_5.toState)(state)['features/base/config'];
    const flagEnabled = (0, functions_3.getFeatureFlag)(state, constants_1.INVITE_ENABLED, true);
    const inBreakoutRoom = (0, functions_6.isInBreakoutRoom)(state);
    return flagEnabled && !disableInviteFunctions && !inBreakoutRoom;
};
exports.shouldRenderInviteButton = shouldRenderInviteButton;
/**
 * Selector for retrieving ids of participants in the order that they are displayed in the filmstrip (with the
 * exception of participants with raised hand). The participants are reordered as follows.
 * 1. Dominant speaker.
 * 2. Local participant.
 * 3. Participants with raised hand.
 * 4. Participants with screenshare sorted alphabetically by their display name.
 * 5. Shared video participants.
 * 6. Recent speakers sorted alphabetically by their display name.
 * 7. Rest of the participants sorted alphabetically by their display name.
 *
 * @param {IStateful} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state features/base/participants.
 * @returns {Array<string>}
 */
function getSortedParticipantIds(stateful) {
    const id = (0, functions_4.getLocalParticipant)(stateful)?.id;
    const remoteParticipants = (0, functions_4.getRemoteParticipantsSorted)(stateful);
    const reorderedParticipants = new Set(remoteParticipants);
    const raisedHandParticipants = (0, functions_4.getRaiseHandsQueue)(stateful).map(({ id: particId }) => particId);
    const remoteRaisedHandParticipants = new Set(raisedHandParticipants || []);
    const dominantSpeaker = (0, functions_4.getDominantSpeakerParticipant)(stateful);
    for (const participant of remoteRaisedHandParticipants.keys()) {
        // Avoid duplicates.
        if (reorderedParticipants.has(participant)) {
            reorderedParticipants.delete(participant);
        }
    }
    const dominant = [];
    const dominantId = dominantSpeaker?.id;
    const local = remoteRaisedHandParticipants.has(id ?? '') ? [] : [id];
    // In case dominat speaker has raised hand, keep the order in the raised hand queue.
    // In case they don't have raised hand, goes first in the participants list.
    if (dominantId && dominantId !== id && !remoteRaisedHandParticipants.has(dominantId)) {
        reorderedParticipants.delete(dominantId);
        dominant.push(dominantId);
    }
    // Move self and participants with raised hand to the top of the list.
    return [
        ...dominant,
        ...local,
        ...Array.from(remoteRaisedHandParticipants.keys()),
        ...Array.from(reorderedParticipants.keys())
    ];
}
exports.getSortedParticipantIds = getSortedParticipantIds;
/**
 * Checks if a participant matches the search string.
 *
 * @param {Object} participant - The participant to be checked.
 * @param {string} searchString - The participants search string.
 * @returns {boolean}
 */
function participantMatchesSearch(participant, searchString) {
    if (searchString === '') {
        return true;
    }
    const participantName = (0, strings_1.normalizeAccents)(participant?.name || participant?.displayName || '')
        .toLowerCase();
    const lowerCaseSearchString = searchString.trim().toLowerCase();
    return participantName.includes(lowerCaseSearchString);
}
exports.participantMatchesSearch = participantMatchesSearch;
/**
 * Returns whether the more actions button is visible.
 *
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
const isMoreActionsVisible = (state) => {
    const isLocalModerator = (0, functions_4.isLocalParticipantModerator)(state);
    const inBreakoutRoom = (0, functions_6.isInBreakoutRoom)(state);
    const { hideMoreActionsButton } = (0, exports.getParticipantsPaneConfig)(state);
    return inBreakoutRoom ? false : !hideMoreActionsButton && isLocalModerator;
};
exports.isMoreActionsVisible = isMoreActionsVisible;
/**
 * Returns whether the mute all button is visible.
 *
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
const isMuteAllVisible = (state) => {
    const isLocalModerator = (0, functions_4.isLocalParticipantModerator)(state);
    const inBreakoutRoom = (0, functions_6.isInBreakoutRoom)(state);
    const { hideMuteAllButton } = (0, exports.getParticipantsPaneConfig)(state);
    return inBreakoutRoom ? false : !hideMuteAllButton && isLocalModerator;
};
exports.isMuteAllVisible = isMuteAllVisible;
/**
 * Returns true if renaming the currently joined breakout room is allowed and false otherwise.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - True if reanming the currently joined breakout room is allowed and false otherwise.
 */
function isCurrentRoomRenamable(state) {
    return (0, functions_6.isInBreakoutRoom)(state) && isBreakoutRoomRenameAllowed(state);
}
exports.isCurrentRoomRenamable = isCurrentRoomRenamable;
/**
 * Returns true if renaming a breakout room is allowed and false otherwise.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - True if renaming a breakout room is allowed and false otherwise.
 */
function isBreakoutRoomRenameAllowed(state) {
    const isLocalModerator = (0, functions_4.isLocalParticipantModerator)(state);
    const conference = (0, functions_2.getCurrentConference)(state);
    const isRenameBreakoutRoomsSupported = conference?.getBreakoutRooms()?.isFeatureSupported(constants_3.BREAKOUT_ROOMS_RENAME_FEATURE) ?? false;
    return isLocalModerator && isRenameBreakoutRoomsSupported;
}
exports.isBreakoutRoomRenameAllowed = isBreakoutRoomRenameAllowed;
/**
 * Returns true if participants is enabled and false otherwise.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {boolean}
 */
const isParticipantsPaneEnabled = (stateful) => {
    const state = (0, functions_5.toState)(stateful);
    const { enabled = true } = (0, exports.getParticipantsPaneConfig)(state);
    return Boolean((0, functions_3.getFeatureFlag)(state, constants_1.PARTICIPANTS_ENABLED, true) && enabled);
};
exports.isParticipantsPaneEnabled = isParticipantsPaneEnabled;
