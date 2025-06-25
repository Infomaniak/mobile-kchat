"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLocalRecordingStatus = exports.overwriteParticipantsNames = exports.overwriteParticipantName = exports.localParticipantAudioLevelChanged = exports.raiseHandUpdateQueue = exports.raiseHandClear = exports.raiseHand = exports.setLoadableAvatarUrl = exports.pinParticipant = exports.participantKicked = exports.createVirtualScreenshareParticipant = exports.participantMutedUs = exports.participantUpdated = exports.screenshareParticipantDisplayNameChanged = exports.participantRoleChanged = exports.participantPresenceChanged = exports.participantLeft = exports.hiddenParticipantLeft = exports.hiddenParticipantJoined = exports.updateRemoteParticipantFeatures = exports.participantSourcesUpdated = exports.participantJoined = exports.muteRemoteParticipant = exports.localParticipantRoleChanged = exports.localParticipantLeft = exports.localParticipantJoined = exports.localParticipantIdChanged = exports.kickParticipant = exports.grantModerator = exports.dominantSpeakerChanged = void 0;
const actions_1 = require("../../notifications/actions");
const constants_1 = require("../../notifications/constants");
const functions_1 = require("../redux/functions");
const actionTypes_1 = require("./actionTypes");
const constants_2 = require("./constants");
const functions_2 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
const types_1 = require("./types");
/**
 * Create an action for when dominant speaker changes.
 *
 * @param {string} dominantSpeaker - Participant ID of the dominant speaker.
 * @param {Array<string>} previousSpeakers - Participant IDs of the previous speakers.
 * @param {boolean} silence - Whether the dominant speaker is silent or not.
 * @param {JitsiConference} conference - The {@code JitsiConference} associated
 * with the participant identified by the specified {@code id}. Only the local
 * participant is allowed to not specify an associated {@code JitsiConference}
 * instance.
 * @returns {{
 *     type: DOMINANT_SPEAKER_CHANGED,
 *     participant: {
 *         conference: JitsiConference,
 *         id: string,
 *         previousSpeakers: Array<string>,
 *         silence: boolean
 *     }
 * }}
 */
function dominantSpeakerChanged(dominantSpeaker, previousSpeakers, silence, conference) {
    return {
        type: actionTypes_1.DOMINANT_SPEAKER_CHANGED,
        participant: {
            conference,
            id: dominantSpeaker,
            previousSpeakers,
            silence
        }
    };
}
exports.dominantSpeakerChanged = dominantSpeakerChanged;
/**
 * Create an action for granting moderator to a participant.
 *
 * @param {string} id - Participant's ID.
 * @returns {{
 *     type: GRANT_MODERATOR,
 *     id: string
 * }}
 */
function grantModerator(id) {
    return {
        type: actionTypes_1.GRANT_MODERATOR,
        id
    };
}
exports.grantModerator = grantModerator;
/**
 * Create an action for removing a participant from the conference.
 *
 * @param {string} id - Participant's ID.
 * @returns {{
 *     type: KICK_PARTICIPANT,
 *     id: string
 * }}
 */
function kickParticipant(id) {
    return {
        type: actionTypes_1.KICK_PARTICIPANT,
        id
    };
}
exports.kickParticipant = kickParticipant;
/**
 * Action to signal that the ID of local participant has changed. It happens
 * when the local participant joins a new conference or leaves an existing
 * conference.
 *
 * @param {string} id - New ID for local participant.
 * @returns {Function}
 */
function localParticipantIdChanged(id) {
    return (dispatch, getState) => {
        const participant = (0, functions_2.getLocalParticipant)(getState);
        if (participant) {
            return dispatch({
                type: actionTypes_1.PARTICIPANT_ID_CHANGED,
                // XXX A participant is identified by an id-conference pair.
                // Only the local participant is with an undefined conference.
                conference: undefined,
                newValue: id,
                oldValue: participant.id
            });
        }
    };
}
exports.localParticipantIdChanged = localParticipantIdChanged;
/**
 * Action to signal that a local participant has joined.
 *
 * @param {IParticipant} participant={} - Information about participant.
 * @returns {{
 *     type: PARTICIPANT_JOINED,
 *     participant: IParticipant
 * }}
 */
function localParticipantJoined(participant = { id: '' }) {
    return participantJoined((0, functions_1.set)(participant, 'local', true));
}
exports.localParticipantJoined = localParticipantJoined;
/**
 * Action to remove a local participant.
 *
 * @returns {Function}
 */
function localParticipantLeft() {
    return (dispatch, getState) => {
        const participant = (0, functions_2.getLocalParticipant)(getState);
        if (participant) {
            return (dispatch(participantLeft(participant.id, 
            // XXX Only the local participant is allowed to leave
            // without stating the JitsiConference instance because
            // the local participant is uniquely identified by the
            // very fact that there is only one local participant
            // (and the fact that the local participant "joins" at
            // the beginning of the app and "leaves" at the end of
            // the app).
            undefined)));
        }
    };
}
exports.localParticipantLeft = localParticipantLeft;
/**
 * Action to signal the role of the local participant has changed. It can happen
 * when the participant has joined a conference, even before a non-default local
 * id has been set, or after a moderator leaves.
 *
 * @param {string} role - The new role of the local participant.
 * @returns {Function}
 */
function localParticipantRoleChanged(role) {
    return (dispatch, getState) => {
        const participant = (0, functions_2.getLocalParticipant)(getState);
        if (participant) {
            return dispatch(participantRoleChanged(participant.id, role));
        }
    };
}
exports.localParticipantRoleChanged = localParticipantRoleChanged;
/**
 * Create an action for muting another participant in the conference.
 *
 * @param {string} id - Participant's ID.
 * @param {MEDIA_TYPE} mediaType - The media to mute.
 * @returns {{
 *     type: MUTE_REMOTE_PARTICIPANT,
 *     id: string,
 *     mediaType: MEDIA_TYPE
 * }}
 */
function muteRemoteParticipant(id, mediaType) {
    return {
        type: actionTypes_1.MUTE_REMOTE_PARTICIPANT,
        id,
        mediaType
    };
}
exports.muteRemoteParticipant = muteRemoteParticipant;
/**
 * Action to signal that a participant has joined.
 *
 * @param {IParticipant} participant - Information about participant.
 * @returns {{
 *     type: PARTICIPANT_JOINED,
 *     participant: IParticipant
 * }}
 */
function participantJoined(participant) {
    // Only the local participant is not identified with an id-conference pair.
    if (participant.local) {
        return {
            type: actionTypes_1.PARTICIPANT_JOINED,
            participant
        };
    }
    // In other words, a remote participant is identified with an id-conference
    // pair.
    const { conference } = participant;
    if (!conference) {
        throw Error('A remote participant must be associated with a JitsiConference!');
    }
    return (dispatch, getState) => {
        // A remote participant is only expected to join in a joined or joining
        // conference. The following check is really necessary because a
        // JitsiConference may have moved into leaving but may still manage to
        // sneak a PARTICIPANT_JOINED in if its leave is delayed for any purpose
        // (which is not outragous given that leaving involves network
        // requests.)
        const stateFeaturesBaseConference = getState()['features/base/conference'];
        if (conference === stateFeaturesBaseConference.conference
            || conference === stateFeaturesBaseConference.joining) {
            return dispatch({
                type: actionTypes_1.PARTICIPANT_JOINED,
                participant
            });
        }
    };
}
exports.participantJoined = participantJoined;
/**
 * Updates the sources of a remote participant.
 *
 * @param {IJitsiParticipant} jitsiParticipant - The IJitsiParticipant instance.
 * @returns {{
 *      type: PARTICIPANT_SOURCES_UPDATED,
 *      participant: IParticipant
 * }}
 */
function participantSourcesUpdated(jitsiParticipant) {
    return (dispatch, getState) => {
        const id = jitsiParticipant.getId();
        const participant = (0, functions_2.getParticipantById)(getState(), id);
        if (participant?.local) {
            return;
        }
        const sources = jitsiParticipant.getSources();
        if (!sources?.size) {
            return;
        }
        return dispatch({
            type: actionTypes_1.PARTICIPANT_SOURCES_UPDATED,
            participant: {
                id,
                sources
            }
        });
    };
}
exports.participantSourcesUpdated = participantSourcesUpdated;
/**
 * Updates the features of a remote participant.
 *
 * @param {JitsiParticipant} jitsiParticipant - The ID of the participant.
 * @returns {{
*     type: PARTICIPANT_UPDATED,
*     participant: IParticipant
* }}
*/
function updateRemoteParticipantFeatures(jitsiParticipant) {
    return (dispatch, getState) => {
        if (!jitsiParticipant) {
            return;
        }
        const id = jitsiParticipant.getId();
        jitsiParticipant.getFeatures()
            .then((features) => {
            const supportsRemoteControl = features.has(constants_2.DISCO_REMOTE_CONTROL_FEATURE);
            const participant = (0, functions_2.getParticipantById)(getState(), id);
            if (!participant || participant.local) {
                return;
            }
            if (participant?.supportsRemoteControl !== supportsRemoteControl) {
                return dispatch({
                    type: actionTypes_1.PARTICIPANT_UPDATED,
                    participant: {
                        id,
                        supportsRemoteControl
                    }
                });
            }
        })
            .catch((error) => {
            logger_1.default.error(`Failed to get participant features for ${id}!`, error);
        });
    };
}
exports.updateRemoteParticipantFeatures = updateRemoteParticipantFeatures;
/**
 * Action to signal that a hidden participant has joined the conference.
 *
 * @param {string} id - The id of the participant.
 * @param {string} displayName - The display name, or undefined when
 * unknown.
 * @returns {{
 *     type: HIDDEN_PARTICIPANT_JOINED,
 *     displayName: string,
 *     id: string
 * }}
 */
function hiddenParticipantJoined(id, displayName) {
    return {
        type: actionTypes_1.HIDDEN_PARTICIPANT_JOINED,
        id,
        displayName
    };
}
exports.hiddenParticipantJoined = hiddenParticipantJoined;
/**
 * Action to signal that a hidden participant has left the conference.
 *
 * @param {string} id - The id of the participant.
 * @returns {{
 *     type: HIDDEN_PARTICIPANT_LEFT,
 *     id: string
 * }}
 */
function hiddenParticipantLeft(id) {
    return {
        type: actionTypes_1.HIDDEN_PARTICIPANT_LEFT,
        id
    };
}
exports.hiddenParticipantLeft = hiddenParticipantLeft;
/**
 * Action to signal that a participant has left.
 *
 * @param {string} id - Participant's ID.
 * @param {JitsiConference} conference - The {@code JitsiConference} associated
 * with the participant identified by the specified {@code id}. Only the local
 * participant is allowed to not specify an associated {@code JitsiConference}
 * instance.
 * @param {Object} participantLeftProps - Other participant properties.
 * @typedef {Object} participantLeftProps
 * @param {FakeParticipant|undefined} participantLeftProps.fakeParticipant - The type of fake participant.
 * @param {boolean} participantLeftProps.isReplaced - Whether the participant is to be replaced in the meeting.
 *
 * @returns {{
 *     type: PARTICIPANT_LEFT,
 *     participant: {
 *         conference: JitsiConference,
 *         id: string
 *     }
 * }}
 */
function participantLeft(id, conference, participantLeftProps = {}) {
    return {
        type: actionTypes_1.PARTICIPANT_LEFT,
        participant: {
            conference,
            fakeParticipant: participantLeftProps.fakeParticipant,
            id,
            isReplaced: participantLeftProps.isReplaced
        }
    };
}
exports.participantLeft = participantLeft;
/**
 * Action to signal that a participant's presence status has changed.
 *
 * @param {string} id - Participant's ID.
 * @param {string} presence - Participant's new presence status.
 * @returns {{
 *     type: PARTICIPANT_UPDATED,
 *     participant: {
 *         id: string,
 *         presence: string
 *     }
 * }}
 */
function participantPresenceChanged(id, presence) {
    return participantUpdated({
        id,
        presence
    });
}
exports.participantPresenceChanged = participantPresenceChanged;
/**
 * Action to signal that a participant's role has changed.
 *
 * @param {string} id - Participant's ID.
 * @param {PARTICIPANT_ROLE} role - Participant's new role.
 * @returns {{
 *     type: PARTICIPANT_UPDATED,
 *     participant: {
 *         id: string,
 *         role: PARTICIPANT_ROLE
 *     }
 * }}
 */
function participantRoleChanged(id, role) {
    return participantUpdated({
        id,
        role
    });
}
exports.participantRoleChanged = participantRoleChanged;
/**
 * Action to signal that a participant's display name has changed.
 *
 * @param {string} id - Screenshare participant's ID.
 * @param {name} name - The new display name of the screenshare participant's owner.
 * @returns {{
 *     type: SCREENSHARE_PARTICIPANT_NAME_CHANGED,
 *     id: string,
 *     name: string
 * }}
 */
function screenshareParticipantDisplayNameChanged(id, name) {
    return {
        type: actionTypes_1.SCREENSHARE_PARTICIPANT_NAME_CHANGED,
        id,
        name
    };
}
exports.screenshareParticipantDisplayNameChanged = screenshareParticipantDisplayNameChanged;
/**
 * Action to signal that some of participant properties has been changed.
 *
 * @param {IParticipant} participant={} - Information about participant. To
 * identify the participant the object should contain either property id with
 * value the id of the participant or property local with value true (if the
 * local participant hasn't joined the conference yet).
 * @returns {{
 *     type: PARTICIPANT_UPDATED,
 *     participant: IParticipant
 * }}
 */
function participantUpdated(participant = { id: '' }) {
    const participantToUpdate = {
        ...participant
    };
    if (participant.name) {
        participantToUpdate.name = (0, functions_2.getNormalizedDisplayName)(participant.name);
    }
    return {
        type: actionTypes_1.PARTICIPANT_UPDATED,
        participant: participantToUpdate
    };
}
exports.participantUpdated = participantUpdated;
/**
 * Action to signal that a participant has muted us.
 *
 * @param {JitsiParticipant} participant - Information about participant.
 * @param {JitsiLocalTrack} track - Information about the track that has been muted.
 * @returns {Promise}
 */
function participantMutedUs(participant, track) {
    return (dispatch, getState) => {
        if (!participant) {
            return;
        }
        const isAudio = track.isAudioTrack();
        dispatch((0, actions_1.showNotification)({
            titleKey: isAudio ? 'notify.mutedRemotelyTitle' : 'notify.videoMutedRemotelyTitle',
            titleArguments: {
                participantDisplayName: (0, functions_2.getParticipantDisplayName)(getState, participant.getId())
            }
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
    };
}
exports.participantMutedUs = participantMutedUs;
/**
 * Action to create a virtual screenshare participant.
 *
 * @param {(string)} sourceName - The source name of the JitsiTrack instance.
 * @param {(boolean)} local - Whether it's a local or remote participant.
 * @param {JitsiConference} conference - The conference instance for which the participant is to be created.
 * @returns {Function}
 */
function createVirtualScreenshareParticipant(sourceName, local, conference) {
    return (dispatch, getState) => {
        const state = getState();
        const ownerId = (0, functions_2.getVirtualScreenshareParticipantOwnerId)(sourceName);
        const ownerName = (0, functions_2.getParticipantDisplayName)(state, ownerId);
        dispatch(participantJoined({
            conference,
            fakeParticipant: local ? types_1.FakeParticipant.LocalScreenShare : types_1.FakeParticipant.RemoteScreenShare,
            id: sourceName,
            name: ownerName
        }));
    };
}
exports.createVirtualScreenshareParticipant = createVirtualScreenshareParticipant;
/**
 * Action to signal that a participant had been kicked.
 *
 * @param {JitsiParticipant} kicker - Information about participant performing the kick.
 * @param {JitsiParticipant} kicked - Information about participant that was kicked.
 * @returns {Promise}
 */
function participantKicked(kicker, kicked) {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes_1.PARTICIPANT_KICKED,
            kicked: kicked.getId(),
            kicker: kicker?.getId()
        });
        if (kicked.isReplaced?.()) {
            return;
        }
        dispatch((0, actions_1.showNotification)({
            titleArguments: {
                kicked: (0, functions_2.getParticipantDisplayName)(getState, kicked.getId()),
                kicker: (0, functions_2.getParticipantDisplayName)(getState, kicker.getId())
            },
            titleKey: 'notify.kickParticipant'
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
    };
}
exports.participantKicked = participantKicked;
/**
 * Create an action which pins a conference participant.
 *
 * @param {string|null} id - The ID of the conference participant to pin or null
 * if none of the conference's participants are to be pinned.
 * @returns {{
 *     type: PIN_PARTICIPANT,
 *     participant: {
 *         id: string
 *     }
 * }}
 */
function pinParticipant(id) {
    return {
        type: actionTypes_1.PIN_PARTICIPANT,
        participant: {
            id
        }
    };
}
exports.pinParticipant = pinParticipant;
/**
 * Creates an action which notifies the app that the loadable URL of the avatar of a participant got updated.
 *
 * @param {string} participantId - The ID of the participant.
 * @param {string} url - The new URL.
 * @param {boolean} useCORS - Indicates whether we need to use CORS for this URL.
 * @returns {{
 *     type: SET_LOADABLE_AVATAR_URL,
 *     participant: {
 *         id: string,
 *         loadableAvatarUrl: string,
 *         loadableAvatarUrlUseCORS: boolean
 *     }
 * }}
*/
function setLoadableAvatarUrl(participantId, url, useCORS) {
    return {
        type: actionTypes_1.SET_LOADABLE_AVATAR_URL,
        participant: {
            id: participantId,
            loadableAvatarUrl: url,
            loadableAvatarUrlUseCORS: useCORS
        }
    };
}
exports.setLoadableAvatarUrl = setLoadableAvatarUrl;
/**
 * Raise hand for the local participant.
 *
 * @param {boolean} enabled - Raise or lower hand.
 * @returns {{
 *     type: LOCAL_PARTICIPANT_RAISE_HAND,
 *     raisedHandTimestamp: number
 * }}
 */
function raiseHand(enabled) {
    return {
        type: actionTypes_1.LOCAL_PARTICIPANT_RAISE_HAND,
        raisedHandTimestamp: enabled ? Date.now() : 0
    };
}
exports.raiseHand = raiseHand;
/**
 * Clear the raise hand queue.
 *
 * @returns {{
*     type: RAISE_HAND_CLEAR
* }}
*/
function raiseHandClear() {
    return {
        type: actionTypes_1.RAISE_HAND_CLEAR
    };
}
exports.raiseHandClear = raiseHandClear;
/**
 * Update raise hand queue of participants.
 *
 * @param {Object} participant - Participant that updated raised hand.
 * @returns {{
 *      type: RAISE_HAND_UPDATED,
 *      participant: Object
 * }}
 */
function raiseHandUpdateQueue(participant) {
    return {
        type: actionTypes_1.RAISE_HAND_UPDATED,
        participant
    };
}
exports.raiseHandUpdateQueue = raiseHandUpdateQueue;
/**
 * Notifies if the local participant audio level has changed.
 *
 * @param {number} level - The audio level.
 * @returns {{
 *      type: LOCAL_PARTICIPANT_AUDIO_LEVEL_CHANGED,
 *      level: number
 * }}
 */
function localParticipantAudioLevelChanged(level) {
    return {
        type: actionTypes_1.LOCAL_PARTICIPANT_AUDIO_LEVEL_CHANGED,
        level
    };
}
exports.localParticipantAudioLevelChanged = localParticipantAudioLevelChanged;
/**
 * Overwrites the name of the participant with the given id.
 *
 * @param {string} id - Participant id;.
 * @param {string} name - New participant name.
 * @returns {Object}
 */
function overwriteParticipantName(id, name) {
    return {
        type: actionTypes_1.OVERWRITE_PARTICIPANT_NAME,
        id,
        name
    };
}
exports.overwriteParticipantName = overwriteParticipantName;
/**
 * Overwrites the names of the given participants.
 *
 * @param {Array<Object>} participantList - The list of participants to overwrite.
 * @returns {Object}
 */
function overwriteParticipantsNames(participantList) {
    return {
        type: actionTypes_1.OVERWRITE_PARTICIPANTS_NAMES,
        participantList
    };
}
exports.overwriteParticipantsNames = overwriteParticipantsNames;
/**
 * Local video recording status for the local participant.
 *
 * @param {boolean} recording - If local recording is ongoing.
 * @param {boolean} onlySelf - If recording only local streams.
 * @returns {{
 *     type: SET_LOCAL_PARTICIPANT_RECORDING_STATUS,
 *     recording: boolean
 * }}
 */
function updateLocalRecordingStatus(recording, onlySelf) {
    return {
        type: actionTypes_1.SET_LOCAL_PARTICIPANT_RECORDING_STATUS,
        recording,
        onlySelf
    };
}
exports.updateLocalRecordingStatus = updateLocalRecordingStatus;
