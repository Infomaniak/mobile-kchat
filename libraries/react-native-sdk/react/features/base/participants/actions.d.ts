import { IStore } from '../../app/types';
import { IJitsiConference } from '../conference/reducer';
import { FakeParticipant, IJitsiParticipant, IParticipant } from './types';
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
export declare function dominantSpeakerChanged(dominantSpeaker: string, previousSpeakers: string[], silence: boolean, conference: IJitsiConference): {
    type: string;
    participant: {
        conference: IJitsiConference;
        id: string;
        previousSpeakers: string[];
        silence: boolean;
    };
};
/**
 * Create an action for granting moderator to a participant.
 *
 * @param {string} id - Participant's ID.
 * @returns {{
 *     type: GRANT_MODERATOR,
 *     id: string
 * }}
 */
export declare function grantModerator(id: string): {
    type: string;
    id: string;
};
/**
 * Create an action for removing a participant from the conference.
 *
 * @param {string} id - Participant's ID.
 * @returns {{
 *     type: KICK_PARTICIPANT,
 *     id: string
 * }}
 */
export declare function kickParticipant(id: string): {
    type: string;
    id: string;
};
/**
 * Action to signal that the ID of local participant has changed. It happens
 * when the local participant joins a new conference or leaves an existing
 * conference.
 *
 * @param {string} id - New ID for local participant.
 * @returns {Function}
 */
export declare function localParticipantIdChanged(id: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    type: string;
    conference: undefined;
    newValue: string;
    oldValue: string;
} | undefined;
/**
 * Action to signal that a local participant has joined.
 *
 * @param {IParticipant} participant={} - Information about participant.
 * @returns {{
 *     type: PARTICIPANT_JOINED,
 *     participant: IParticipant
 * }}
 */
export declare function localParticipantJoined(participant?: IParticipant): ((dispatch: import("redux-thunk").ThunkDispatch<import("../../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../../app/types").IReduxState) => {
    type: string;
    participant: IParticipant;
} | undefined) | {
    type: string;
    participant: IParticipant;
};
/**
 * Action to remove a local participant.
 *
 * @returns {Function}
 */
export declare function localParticipantLeft(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    type: string;
    participant: {
        conference: IJitsiConference | undefined;
        fakeParticipant: string | undefined;
        id: string;
        isReplaced: boolean | undefined;
    };
} | undefined;
/**
 * Action to signal the role of the local participant has changed. It can happen
 * when the participant has joined a conference, even before a non-default local
 * id has been set, or after a moderator leaves.
 *
 * @param {string} role - The new role of the local participant.
 * @returns {Function}
 */
export declare function localParticipantRoleChanged(role: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    type: string;
    participant: {
        avatarURL?: string | undefined;
        botType?: string | undefined;
        conference?: IJitsiConference | undefined;
        displayName?: string | undefined;
        dominantSpeaker?: boolean | undefined;
        e2eeEnabled?: boolean | undefined;
        e2eeSupported?: boolean | undefined;
        e2eeVerificationAvailable?: boolean | undefined;
        e2eeVerified?: boolean | undefined;
        email?: string | undefined;
        fakeParticipant?: FakeParticipant | undefined;
        features?: {
            'screen-sharing'?: string | boolean | undefined;
        } | undefined;
        getId?: Function | undefined;
        id: string;
        isJigasi?: boolean | undefined;
        isReplaced?: boolean | undefined;
        isReplacing?: number | undefined;
        jwtId?: string | undefined;
        loadableAvatarUrl?: string | undefined;
        loadableAvatarUrlUseCORS?: boolean | undefined;
        local?: boolean | undefined;
        localRecording?: string | undefined;
        name?: string | undefined;
        pinned?: boolean | undefined;
        presence?: string | undefined;
        raisedHandTimestamp?: number | undefined;
        region?: string | undefined;
        remoteControlSessionStatus?: boolean | undefined;
        role?: string | undefined;
        sources?: Map<string, Map<string, import("./types").ISourceInfo>> | undefined;
        supportsRemoteControl?: boolean | undefined;
    };
} | undefined;
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
export declare function muteRemoteParticipant(id: string, mediaType: string): {
    type: string;
    id: string;
    mediaType: string;
};
/**
 * Action to signal that a participant has joined.
 *
 * @param {IParticipant} participant - Information about participant.
 * @returns {{
 *     type: PARTICIPANT_JOINED,
 *     participant: IParticipant
 * }}
 */
export declare function participantJoined(participant: IParticipant): ((dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    type: string;
    participant: IParticipant;
} | undefined) | {
    type: string;
    participant: IParticipant;
};
/**
 * Updates the sources of a remote participant.
 *
 * @param {IJitsiParticipant} jitsiParticipant - The IJitsiParticipant instance.
 * @returns {{
 *      type: PARTICIPANT_SOURCES_UPDATED,
 *      participant: IParticipant
 * }}
 */
export declare function participantSourcesUpdated(jitsiParticipant: IJitsiParticipant): (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    type: string;
    participant: {
        id: string;
        sources: Map<string, Map<string, import("./types").ISourceInfo>>;
    };
} | undefined;
/**
 * Updates the features of a remote participant.
 *
 * @param {JitsiParticipant} jitsiParticipant - The ID of the participant.
 * @returns {{
*     type: PARTICIPANT_UPDATED,
*     participant: IParticipant
* }}
*/
export declare function updateRemoteParticipantFeatures(jitsiParticipant: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
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
export declare function hiddenParticipantJoined(id: string, displayName: string): {
    type: string;
    id: string;
    displayName: string;
};
/**
 * Action to signal that a hidden participant has left the conference.
 *
 * @param {string} id - The id of the participant.
 * @returns {{
 *     type: HIDDEN_PARTICIPANT_LEFT,
 *     id: string
 * }}
 */
export declare function hiddenParticipantLeft(id: string): {
    type: string;
    id: string;
};
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
export declare function participantLeft(id: string, conference?: IJitsiConference, participantLeftProps?: {
    fakeParticipant?: string;
    isReplaced?: boolean;
}): {
    type: string;
    participant: {
        conference: IJitsiConference | undefined;
        fakeParticipant: string | undefined;
        id: string;
        isReplaced: boolean | undefined;
    };
};
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
export declare function participantPresenceChanged(id: string, presence: string): {
    type: string;
    participant: {
        avatarURL?: string | undefined;
        botType?: string | undefined;
        conference?: IJitsiConference | undefined;
        displayName?: string | undefined;
        dominantSpeaker?: boolean | undefined;
        e2eeEnabled?: boolean | undefined;
        e2eeSupported?: boolean | undefined;
        e2eeVerificationAvailable?: boolean | undefined;
        e2eeVerified?: boolean | undefined;
        email?: string | undefined;
        fakeParticipant?: FakeParticipant | undefined;
        features?: {
            'screen-sharing'?: string | boolean | undefined;
        } | undefined;
        getId?: Function | undefined;
        id: string;
        isJigasi?: boolean | undefined;
        isReplaced?: boolean | undefined;
        isReplacing?: number | undefined;
        jwtId?: string | undefined;
        loadableAvatarUrl?: string | undefined;
        loadableAvatarUrlUseCORS?: boolean | undefined;
        local?: boolean | undefined;
        localRecording?: string | undefined;
        name?: string | undefined;
        pinned?: boolean | undefined;
        presence?: string | undefined;
        raisedHandTimestamp?: number | undefined;
        region?: string | undefined;
        remoteControlSessionStatus?: boolean | undefined;
        role?: string | undefined;
        sources?: Map<string, Map<string, import("./types").ISourceInfo>> | undefined;
        supportsRemoteControl?: boolean | undefined;
    };
};
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
export declare function participantRoleChanged(id: string, role: string): {
    type: string;
    participant: {
        avatarURL?: string | undefined;
        botType?: string | undefined;
        conference?: IJitsiConference | undefined;
        displayName?: string | undefined;
        dominantSpeaker?: boolean | undefined;
        e2eeEnabled?: boolean | undefined;
        e2eeSupported?: boolean | undefined;
        e2eeVerificationAvailable?: boolean | undefined;
        e2eeVerified?: boolean | undefined;
        email?: string | undefined;
        fakeParticipant?: FakeParticipant | undefined;
        features?: {
            'screen-sharing'?: string | boolean | undefined;
        } | undefined;
        getId?: Function | undefined;
        id: string;
        isJigasi?: boolean | undefined;
        isReplaced?: boolean | undefined;
        isReplacing?: number | undefined;
        jwtId?: string | undefined;
        loadableAvatarUrl?: string | undefined;
        loadableAvatarUrlUseCORS?: boolean | undefined;
        local?: boolean | undefined;
        localRecording?: string | undefined;
        name?: string | undefined;
        pinned?: boolean | undefined;
        presence?: string | undefined;
        raisedHandTimestamp?: number | undefined;
        region?: string | undefined;
        remoteControlSessionStatus?: boolean | undefined;
        role?: string | undefined;
        sources?: Map<string, Map<string, import("./types").ISourceInfo>> | undefined;
        supportsRemoteControl?: boolean | undefined;
    };
};
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
export declare function screenshareParticipantDisplayNameChanged(id: string, name: string): {
    type: string;
    id: string;
    name: string;
};
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
export declare function participantUpdated(participant?: IParticipant): {
    type: string;
    participant: {
        avatarURL?: string | undefined;
        botType?: string | undefined;
        conference?: IJitsiConference | undefined;
        displayName?: string | undefined;
        dominantSpeaker?: boolean | undefined;
        e2eeEnabled?: boolean | undefined;
        e2eeSupported?: boolean | undefined;
        e2eeVerificationAvailable?: boolean | undefined;
        e2eeVerified?: boolean | undefined;
        email?: string | undefined;
        fakeParticipant?: FakeParticipant | undefined;
        features?: {
            'screen-sharing'?: string | boolean | undefined;
        } | undefined;
        getId?: Function | undefined;
        id: string;
        isJigasi?: boolean | undefined;
        isReplaced?: boolean | undefined;
        isReplacing?: number | undefined;
        jwtId?: string | undefined;
        loadableAvatarUrl?: string | undefined;
        loadableAvatarUrlUseCORS?: boolean | undefined;
        local?: boolean | undefined;
        localRecording?: string | undefined;
        name?: string | undefined;
        pinned?: boolean | undefined;
        presence?: string | undefined;
        raisedHandTimestamp?: number | undefined;
        region?: string | undefined;
        remoteControlSessionStatus?: boolean | undefined;
        role?: string | undefined;
        sources?: Map<string, Map<string, import("./types").ISourceInfo>> | undefined;
        supportsRemoteControl?: boolean | undefined;
    };
};
/**
 * Action to signal that a participant has muted us.
 *
 * @param {JitsiParticipant} participant - Information about participant.
 * @param {JitsiLocalTrack} track - Information about the track that has been muted.
 * @returns {Promise}
 */
export declare function participantMutedUs(participant: any, track: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action to create a virtual screenshare participant.
 *
 * @param {(string)} sourceName - The source name of the JitsiTrack instance.
 * @param {(boolean)} local - Whether it's a local or remote participant.
 * @param {JitsiConference} conference - The conference instance for which the participant is to be created.
 * @returns {Function}
 */
export declare function createVirtualScreenshareParticipant(sourceName: string, local: boolean, conference?: IJitsiConference): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action to signal that a participant had been kicked.
 *
 * @param {JitsiParticipant} kicker - Information about participant performing the kick.
 * @param {JitsiParticipant} kicked - Information about participant that was kicked.
 * @returns {Promise}
 */
export declare function participantKicked(kicker: any, kicked: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
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
export declare function pinParticipant(id?: string | null): {
    type: string;
    participant: {
        id: string | null | undefined;
    };
};
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
export declare function setLoadableAvatarUrl(participantId: string, url: string, useCORS: boolean): {
    type: string;
    participant: {
        id: string;
        loadableAvatarUrl: string;
        loadableAvatarUrlUseCORS: boolean;
    };
};
/**
 * Raise hand for the local participant.
 *
 * @param {boolean} enabled - Raise or lower hand.
 * @returns {{
 *     type: LOCAL_PARTICIPANT_RAISE_HAND,
 *     raisedHandTimestamp: number
 * }}
 */
export declare function raiseHand(enabled: boolean): {
    type: string;
    raisedHandTimestamp: number;
};
/**
 * Clear the raise hand queue.
 *
 * @returns {{
*     type: RAISE_HAND_CLEAR
* }}
*/
export declare function raiseHandClear(): {
    type: string;
};
/**
 * Update raise hand queue of participants.
 *
 * @param {Object} participant - Participant that updated raised hand.
 * @returns {{
 *      type: RAISE_HAND_UPDATED,
 *      participant: Object
 * }}
 */
export declare function raiseHandUpdateQueue(participant: IParticipant): {
    type: string;
    participant: IParticipant;
};
/**
 * Notifies if the local participant audio level has changed.
 *
 * @param {number} level - The audio level.
 * @returns {{
 *      type: LOCAL_PARTICIPANT_AUDIO_LEVEL_CHANGED,
 *      level: number
 * }}
 */
export declare function localParticipantAudioLevelChanged(level: number): {
    type: string;
    level: number;
};
/**
 * Overwrites the name of the participant with the given id.
 *
 * @param {string} id - Participant id;.
 * @param {string} name - New participant name.
 * @returns {Object}
 */
export declare function overwriteParticipantName(id: string, name: string): {
    type: string;
    id: string;
    name: string;
};
/**
 * Overwrites the names of the given participants.
 *
 * @param {Array<Object>} participantList - The list of participants to overwrite.
 * @returns {Object}
 */
export declare function overwriteParticipantsNames(participantList: IParticipant[]): {
    type: string;
    participantList: IParticipant[];
};
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
export declare function updateLocalRecordingStatus(recording: boolean, onlySelf?: boolean): {
    type: string;
    recording: boolean;
    onlySelf: boolean | undefined;
};
