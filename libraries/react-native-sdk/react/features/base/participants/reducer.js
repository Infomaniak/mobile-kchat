"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../media/constants");
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const functions_1 = require("../redux/functions");
const actionTypes_1 = require("./actionTypes");
const constants_2 = require("./constants");
const functions_2 = require("./functions");
const types_1 = require("./types");
/**
 * Participant object.
 *
 * @typedef {Object} Participant
 * @property {string} id - Participant ID.
 * @property {string} name - Participant name.
 * @property {string} avatar - Path to participant avatar if any.
 * @property {string} role - Participant role.
 * @property {boolean} local - If true, participant is local.
 * @property {boolean} pinned - If true, participant is currently a
 * "PINNED_ENDPOINT".
 * @property {boolean} dominantSpeaker - If this participant is the dominant
 * speaker in the (associated) conference, {@code true}; otherwise,
 * {@code false}.
 * @property {string} email - Participant email.
 */
/**
 * The participant properties which cannot be updated through
 * {@link PARTICIPANT_UPDATED}. They either identify the participant or can only
 * be modified through property-dedicated actions.
 *
 * @type {string[]}
 */
const PARTICIPANT_PROPS_TO_OMIT_WHEN_UPDATE = [
    // The following properties identify the participant:
    'conference',
    'id',
    'local',
    // The following properties can only be modified through property-dedicated
    // actions:
    'dominantSpeaker',
    'pinned'
];
const DEFAULT_STATE = {
    dominantSpeaker: undefined,
    fakeParticipants: new Map(),
    local: undefined,
    localScreenShare: undefined,
    numberOfNonModeratorParticipants: 0,
    numberOfParticipantsDisabledE2EE: 0,
    numberOfParticipantsNotSupportingE2EE: 0,
    overwrittenNameList: {},
    pinnedParticipant: undefined,
    raisedHandsQueue: [],
    remote: new Map(),
    remoteVideoSources: new Set(),
    sortedRemoteVirtualScreenshareParticipants: new Map(),
    sortedRemoteParticipants: new Map(),
    speakersList: new Map()
};
/**
 * Listen for actions which add, remove, or update the set of participants in
 * the conference.
 *
 * @param {IParticipant[]} state - List of participants to be modified.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @param {IParticipant} action.participant - Information about participant to be
 * added/removed/modified.
 * @returns {IParticipant[]}
 */
ReducerRegistry_1.default.register('features/base/participants', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.PARTICIPANT_ID_CHANGED: {
            const { local } = state;
            if (local) {
                if (action.newValue === 'local' && state.raisedHandsQueue.find(pid => pid.id === local.id)) {
                    state.raisedHandsQueue = state.raisedHandsQueue.filter(pid => pid.id !== local.id);
                }
                state.local = {
                    ...local,
                    id: action.newValue
                };
                return {
                    ...state
                };
            }
            return state;
        }
        case actionTypes_1.DOMINANT_SPEAKER_CHANGED: {
            const { participant } = action;
            const { id, previousSpeakers = [] } = participant;
            const { dominantSpeaker, local } = state;
            const newSpeakers = [id, ...previousSpeakers];
            const sortedSpeakersList = [];
            for (const speaker of newSpeakers) {
                if (speaker !== local?.id) {
                    const remoteParticipant = state.remote.get(speaker);
                    remoteParticipant
                        && sortedSpeakersList.push([speaker, _getDisplayName(state, remoteParticipant?.name)]);
                }
            }
            // Keep the remote speaker list sorted alphabetically.
            sortedSpeakersList.sort((a, b) => a[1].localeCompare(b[1]));
            // Only one dominant speaker is allowed.
            if (dominantSpeaker) {
                _updateParticipantProperty(state, dominantSpeaker, 'dominantSpeaker', false);
            }
            if (_updateParticipantProperty(state, id, 'dominantSpeaker', true)) {
                return {
                    ...state,
                    dominantSpeaker: id,
                    speakersList: new Map(sortedSpeakersList)
                };
            }
            delete state.dominantSpeaker;
            return {
                ...state
            };
        }
        case actionTypes_1.PIN_PARTICIPANT: {
            const { participant } = action;
            const { id } = participant;
            const { pinnedParticipant } = state;
            // Only one pinned participant is allowed.
            if (pinnedParticipant) {
                _updateParticipantProperty(state, pinnedParticipant, 'pinned', false);
            }
            if (id && _updateParticipantProperty(state, id, 'pinned', true)) {
                return {
                    ...state,
                    pinnedParticipant: id
                };
            }
            delete state.pinnedParticipant;
            return {
                ...state
            };
        }
        case actionTypes_1.SET_LOADABLE_AVATAR_URL:
        case actionTypes_1.PARTICIPANT_UPDATED: {
            const { participant } = action;
            let { id } = participant;
            const { local } = participant;
            if (!id && local) {
                id = constants_2.LOCAL_PARTICIPANT_DEFAULT_ID;
            }
            let newParticipant = null;
            const oldParticipant = local || state.local?.id === id ? state.local : state.remote.get(id);
            if (state.remote.has(id)) {
                newParticipant = _participant(oldParticipant, action);
                state.remote.set(id, newParticipant);
            }
            else if (id === state.local?.id) {
                newParticipant = state.local = _participant(state.local, action);
            }
            if (oldParticipant && newParticipant && !newParticipant.fakeParticipant) {
                const isModerator = (0, functions_2.isParticipantModerator)(newParticipant);
                if ((0, functions_2.isParticipantModerator)(oldParticipant) !== isModerator) {
                    state.numberOfNonModeratorParticipants += isModerator ? -1 : 1;
                }
                const e2eeEnabled = Boolean(newParticipant.e2eeEnabled);
                const e2eeSupported = Boolean(newParticipant.e2eeSupported);
                if (Boolean(oldParticipant.e2eeEnabled) !== e2eeEnabled) {
                    state.numberOfParticipantsDisabledE2EE += e2eeEnabled ? -1 : 1;
                }
                if (!local && Boolean(oldParticipant.e2eeSupported) !== e2eeSupported) {
                    state.numberOfParticipantsNotSupportingE2EE += e2eeSupported ? -1 : 1;
                }
            }
            return {
                ...state
            };
        }
        case actionTypes_1.SCREENSHARE_PARTICIPANT_NAME_CHANGED: {
            const { id, name } = action;
            if (state.sortedRemoteVirtualScreenshareParticipants.has(id)) {
                state.sortedRemoteVirtualScreenshareParticipants.delete(id);
                const sortedRemoteVirtualScreenshareParticipants = [...state.sortedRemoteVirtualScreenshareParticipants];
                sortedRemoteVirtualScreenshareParticipants.push([id, name]);
                sortedRemoteVirtualScreenshareParticipants.sort((a, b) => a[1].localeCompare(b[1]));
                state.sortedRemoteVirtualScreenshareParticipants = new Map(sortedRemoteVirtualScreenshareParticipants);
            }
            return { ...state };
        }
        case actionTypes_1.PARTICIPANT_JOINED: {
            const participant = _participantJoined(action);
            const { fakeParticipant, id, name, pinned, sources } = participant;
            const { pinnedParticipant, dominantSpeaker } = state;
            if (pinned) {
                if (pinnedParticipant) {
                    _updateParticipantProperty(state, pinnedParticipant, 'pinned', false);
                }
                state.pinnedParticipant = id;
            }
            if (participant.dominantSpeaker) {
                if (dominantSpeaker) {
                    _updateParticipantProperty(state, dominantSpeaker, 'dominantSpeaker', false);
                }
                state.dominantSpeaker = id;
            }
            if (!fakeParticipant) {
                const isModerator = (0, functions_2.isParticipantModerator)(participant);
                if (!isModerator) {
                    state.numberOfNonModeratorParticipants += 1;
                }
                const { e2eeEnabled, e2eeSupported } = participant;
                if (!e2eeEnabled) {
                    state.numberOfParticipantsDisabledE2EE += 1;
                }
                if (!participant.local && !e2eeSupported) {
                    state.numberOfParticipantsNotSupportingE2EE += 1;
                }
            }
            if (participant.local) {
                return {
                    ...state,
                    local: participant
                };
            }
            if ((0, functions_2.isLocalScreenshareParticipant)(participant)) {
                return {
                    ...state,
                    localScreenShare: participant
                };
            }
            state.remote.set(id, participant);
            if (sources?.size) {
                const videoSources = sources.get(constants_1.MEDIA_TYPE.VIDEO);
                if (videoSources?.size) {
                    const newRemoteVideoSources = new Set(state.remoteVideoSources);
                    for (const source of videoSources.keys()) {
                        newRemoteVideoSources.add(source);
                    }
                    state.remoteVideoSources = newRemoteVideoSources;
                }
            }
            // Insert the new participant.
            const displayName = _getDisplayName(state, name);
            const sortedRemoteParticipants = Array.from(state.sortedRemoteParticipants);
            sortedRemoteParticipants.push([id, displayName]);
            sortedRemoteParticipants.sort((a, b) => a[1].localeCompare(b[1]));
            // The sort order of participants is preserved since Map remembers the original insertion order of the keys.
            state.sortedRemoteParticipants = new Map(sortedRemoteParticipants);
            if ((0, functions_2.isRemoteScreenshareParticipant)(participant)) {
                const sortedRemoteVirtualScreenshareParticipants = [...state.sortedRemoteVirtualScreenshareParticipants];
                sortedRemoteVirtualScreenshareParticipants.push([id, name ?? '']);
                sortedRemoteVirtualScreenshareParticipants.sort((a, b) => a[1].localeCompare(b[1]));
                state.sortedRemoteVirtualScreenshareParticipants = new Map(sortedRemoteVirtualScreenshareParticipants);
            }
            // Exclude the screenshare participant from the fake participant count to avoid duplicates.
            if (fakeParticipant && !(0, functions_2.isScreenShareParticipant)(participant)) {
                state.fakeParticipants.set(id, participant);
            }
            return { ...state };
        }
        case actionTypes_1.PARTICIPANT_LEFT: {
            // XXX A remote participant is uniquely identified by their id in a
            // specific JitsiConference instance. The local participant is uniquely
            // identified by the very fact that there is only one local participant
            // (and the fact that the local participant "joins" at the beginning of
            // the app and "leaves" at the end of the app).
            const { conference, id } = action.participant;
            const { fakeParticipants, sortedRemoteVirtualScreenshareParticipants, remote, local, localScreenShare, dominantSpeaker, pinnedParticipant } = state;
            let oldParticipant = remote.get(id);
            let isLocalScreenShare = false;
            if (oldParticipant && oldParticipant.conference === conference) {
                remote.delete(id);
            }
            else if (local?.id === id) {
                oldParticipant = state.local;
                delete state.local;
            }
            else if (localScreenShare?.id === id) {
                isLocalScreenShare = true;
                oldParticipant = state.local;
                delete state.localScreenShare;
            }
            else {
                // no participant found
                return state;
            }
            if (oldParticipant?.sources?.size) {
                const videoSources = oldParticipant.sources.get(constants_1.MEDIA_TYPE.VIDEO);
                if (videoSources?.size) {
                    const newRemoteVideoSources = new Set(state.remoteVideoSources);
                    for (const source of videoSources.keys()) {
                        newRemoteVideoSources.delete(source);
                    }
                    state.remoteVideoSources = newRemoteVideoSources;
                }
            }
            else if (oldParticipant?.fakeParticipant === types_1.FakeParticipant.RemoteScreenShare) {
                const newRemoteVideoSources = new Set(state.remoteVideoSources);
                if (newRemoteVideoSources.delete(id)) {
                    state.remoteVideoSources = newRemoteVideoSources;
                }
            }
            state.sortedRemoteParticipants.delete(id);
            state.raisedHandsQueue = state.raisedHandsQueue.filter(pid => pid.id !== id);
            if (dominantSpeaker === id) {
                state.dominantSpeaker = undefined;
            }
            // Remove the participant from the list of speakers.
            state.speakersList.has(id) && state.speakersList.delete(id);
            if (pinnedParticipant === id) {
                state.pinnedParticipant = undefined;
            }
            if (fakeParticipants.has(id)) {
                fakeParticipants.delete(id);
            }
            if (sortedRemoteVirtualScreenshareParticipants.has(id)) {
                sortedRemoteVirtualScreenshareParticipants.delete(id);
                state.sortedRemoteVirtualScreenshareParticipants = new Map(sortedRemoteVirtualScreenshareParticipants);
            }
            if (oldParticipant && !oldParticipant.fakeParticipant && !isLocalScreenShare) {
                const { e2eeEnabled, e2eeSupported } = oldParticipant;
                if (!(0, functions_2.isParticipantModerator)(oldParticipant)) {
                    state.numberOfNonModeratorParticipants -= 1;
                }
                if (!e2eeEnabled) {
                    state.numberOfParticipantsDisabledE2EE -= 1;
                }
                if (!oldParticipant.local && !e2eeSupported) {
                    state.numberOfParticipantsNotSupportingE2EE -= 1;
                }
            }
            return { ...state };
        }
        case actionTypes_1.PARTICIPANT_SOURCES_UPDATED: {
            const { id, sources } = action.participant;
            const participant = state.remote.get(id);
            if (participant) {
                participant.sources = sources;
                const videoSources = sources.get(constants_1.MEDIA_TYPE.VIDEO);
                if (videoSources?.size) {
                    const newRemoteVideoSources = new Set(state.remoteVideoSources);
                    for (const source of videoSources.keys()) {
                        newRemoteVideoSources.add(source);
                    }
                    state.remoteVideoSources = newRemoteVideoSources;
                }
            }
            return { ...state };
        }
        case actionTypes_1.RAISE_HAND_CLEAR: {
            return {
                ...state,
                raisedHandsQueue: []
            };
        }
        case actionTypes_1.RAISE_HAND_UPDATED: {
            return {
                ...state,
                raisedHandsQueue: action.queue
            };
        }
        case actionTypes_1.OVERWRITE_PARTICIPANT_NAME: {
            const { id, name } = action;
            return {
                ...state,
                overwrittenNameList: {
                    ...state.overwrittenNameList,
                    [id]: name
                }
            };
        }
    }
    return state;
});
/**
 * Returns the participant's display name, default string if display name is not set on the participant.
 *
 * @param {Object} state - The local participant redux state.
 * @param {string} name - The display name of the participant.
 * @returns {string}
 */
function _getDisplayName(state, name) {
    // @ts-ignore
    const config = state['features/base/config'];
    return name ?? (config?.defaultRemoteDisplayName || 'Fellow Jitster');
}
/**
 * Reducer function for a single participant.
 *
 * @param {IParticipant|undefined} state - Participant to be modified.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @param {IParticipant} action.participant - Information about participant to be
 * added/modified.
 * @param {JitsiConference} action.conference - Conference instance.
 * @private
 * @returns {IParticipant}
 */
function _participant(state = { id: '' }, action) {
    switch (action.type) {
        case actionTypes_1.SET_LOADABLE_AVATAR_URL:
        case actionTypes_1.PARTICIPANT_UPDATED: {
            const { participant } = action; // eslint-disable-line no-shadow
            const newState = { ...state };
            for (const key in participant) {
                if (participant.hasOwnProperty(key)
                    && PARTICIPANT_PROPS_TO_OMIT_WHEN_UPDATE.indexOf(key)
                        === -1) {
                    // @ts-ignore
                    newState[key] = participant[key];
                }
            }
            return newState;
        }
    }
    return state;
}
/**
 * Reduces a specific redux action of type {@link PARTICIPANT_JOINED} in the
 * feature base/participants.
 *
 * @param {Action} action - The redux action of type {@code PARTICIPANT_JOINED}
 * to reduce.
 * @private
 * @returns {Object} The new participant derived from the payload of the
 * specified {@code action} to be added into the redux state of the feature
 * base/participants after the reduction of the specified
 * {@code action}.
 */
function _participantJoined({ participant }) {
    const { avatarURL, botType, dominantSpeaker, email, fakeParticipant, isReplacing, loadableAvatarUrl, local, name, pinned, presence, role, sources } = participant;
    let { conference, id } = participant;
    if (local) {
        // conference
        //
        // XXX The local participant is not identified in association with a
        // JitsiConference because it is identified by the very fact that it is
        // the local participant.
        conference = undefined;
        // id
        id || (id = constants_2.LOCAL_PARTICIPANT_DEFAULT_ID);
    }
    return {
        avatarURL,
        botType,
        conference,
        dominantSpeaker: dominantSpeaker || false,
        email,
        fakeParticipant,
        id,
        isReplacing,
        loadableAvatarUrl,
        local: local || false,
        name,
        pinned: pinned || false,
        presence,
        role: role || constants_2.PARTICIPANT_ROLE.NONE,
        sources
    };
}
/**
 * Updates a specific property for a participant.
 *
 * @param {State} state - The redux state.
 * @param {string} id - The ID of the participant.
 * @param {string} property - The property to update.
 * @param {*} value - The new value.
 * @returns {boolean} - True if a participant was updated and false otherwise.
 */
function _updateParticipantProperty(state, id, property, value) {
    const { remote, local, localScreenShare } = state;
    if (remote.has(id)) {
        remote.set(id, (0, functions_1.set)(remote.get(id) ?? {
            id: '',
            name: ''
        }, property, value));
        return true;
    }
    else if (local?.id === id || local?.id === 'local') {
        // The local participant's ID can chance from something to "local" when
        // not in a conference.
        state.local = (0, functions_1.set)(local, property, value);
        return true;
    }
    else if (localScreenShare?.id === id) {
        state.localScreenShare = (0, functions_1.set)(localScreenShare, property, value);
        return true;
    }
    return false;
}
