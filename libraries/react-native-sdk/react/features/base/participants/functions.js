"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setShareDialogVisiblity = exports.addPeopleFeatureControl = exports.hasRaisedHand = exports.getRaiseHandsQueue = exports.isLocalParticipantModerator = exports.isIconUrl = exports.isEveryoneModerator = exports.getDominantSpeakerParticipant = exports.isParticipantModerator = exports.getPinnedParticipant = exports.getRemoteParticipantsSorted = exports.getRemoteParticipants = exports.getParticipantPresenceStatus = exports.getSourceNamesByVideoTypeAndParticipant = exports.getSourceNamesByMediaTypeAndParticipant = exports.getScreenshareParticipantIds = exports.getScreenshareParticipantDisplayName = exports.getRemoteScreensharesBasedOnPresence = exports.getParticipantDisplayName = exports.getParticipantCountWithFake = exports.getMutedStateByParticipantAndMediaType = exports.getRemoteParticipantCountWithFake = exports.isWhiteboardParticipant = exports.isSharedVideoParticipant = exports.isScreenShareParticipant = exports.isScreenShareParticipantById = exports.isRemoteScreenshareParticipant = exports.isLocalScreenshareParticipant = exports.getFakeParticipants = exports.getVirtualScreenshareParticipantOwnerId = exports.getParticipantCount = exports.getParticipantByIdOrUndefined = exports.getParticipantById = exports.getNormalizedDisplayName = exports.getVirtualScreenshareParticipantByOwnerId = exports.getLocalScreenShareParticipant = exports.getLocalParticipant = exports.getFirstLoadableAvatarUrl = exports.getActiveSpeakersToBeDisplayed = void 0;
// @ts-expect-error
const avatar_1 = require("@jitsi/js-utils/avatar");
const functions_1 = require("../../filmstrip/functions");
const functions_2 = require("../../invite/functions");
const actions_1 = require("../../share-room/actions");
const constants_1 = require("../avatar/constants");
const functions_3 = require("../avatar/functions");
const functions_4 = require("../conference/functions");
const constants_2 = require("../flags/constants");
const functions_5 = require("../flags/functions");
const i18next_1 = __importDefault(require("../i18n/i18next"));
const constants_3 = require("../media/constants");
const functions_6 = require("../redux/functions");
const functions_any_1 = require("../tracks/functions.any");
const helpers_1 = require("../util/helpers");
const constants_4 = require("./constants");
const preloadImage_1 = require("./preloadImage");
const types_1 = require("./types");
/**
 * Temp structures for avatar urls to be checked/preloaded.
 */
const AVATAR_QUEUE = [];
const AVATAR_CHECKED_URLS = new Map();
/* eslint-disable arrow-body-style */
const AVATAR_CHECKER_FUNCTIONS = [
    (participant) => {
        return participant?.isJigasi ? constants_4.JIGASI_PARTICIPANT_ICON : null;
    },
    (participant) => {
        return isWhiteboardParticipant(participant) ? constants_4.WHITEBOARD_PARTICIPANT_ICON : null;
    },
    (participant) => {
        return participant?.avatarURL ? participant.avatarURL : null;
    },
    (participant, store) => {
        const config = store.getState()['features/base/config'];
        const isGravatarDisabled = config.gravatar?.disabled;
        if (participant?.email && !isGravatarDisabled) {
            const gravatarBaseURL = config.gravatar?.baseUrl
                || config.gravatarBaseURL
                || constants_1.GRAVATAR_BASE_URL;
            return (0, avatar_1.getGravatarURL)(participant.email, gravatarBaseURL);
        }
        return null;
    }
];
/* eslint-enable arrow-body-style */
/**
 * Returns the list of active speakers that should be moved to the top of the sorted list of participants so that the
 * dominant speaker is visible always on the vertical filmstrip in stage layout.
 *
 * @param {Function | Object} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state.
 * @returns {Array<string>}
 */
function getActiveSpeakersToBeDisplayed(stateful) {
    const state = (0, functions_6.toState)(stateful);
    const { dominantSpeaker, fakeParticipants, sortedRemoteVirtualScreenshareParticipants, speakersList } = state['features/base/participants'];
    const { visibleRemoteParticipants } = state['features/filmstrip'];
    let activeSpeakers = new Map(speakersList);
    // Do not re-sort the active speakers if dominant speaker is currently visible.
    if (dominantSpeaker && visibleRemoteParticipants.has(dominantSpeaker)) {
        return activeSpeakers;
    }
    let availableSlotsForActiveSpeakers = visibleRemoteParticipants.size;
    if (activeSpeakers.has(dominantSpeaker ?? '')) {
        activeSpeakers.delete(dominantSpeaker ?? '');
    }
    // Add dominant speaker to the beginning of the list (not including self) since the active speaker list is always
    // alphabetically sorted.
    if (dominantSpeaker && dominantSpeaker !== getLocalParticipant(state)?.id) {
        const updatedSpeakers = Array.from(activeSpeakers);
        updatedSpeakers.splice(0, 0, [dominantSpeaker, getParticipantById(state, dominantSpeaker)?.name ?? '']);
        activeSpeakers = new Map(updatedSpeakers);
    }
    // Remove screenshares from the count.
    if (sortedRemoteVirtualScreenshareParticipants) {
        availableSlotsForActiveSpeakers -= sortedRemoteVirtualScreenshareParticipants.size * 2;
        for (const screenshare of Array.from(sortedRemoteVirtualScreenshareParticipants.keys())) {
            const ownerId = getVirtualScreenshareParticipantOwnerId(screenshare);
            activeSpeakers.delete(ownerId);
        }
    }
    // Remove fake participants from the count.
    if (fakeParticipants) {
        availableSlotsForActiveSpeakers -= fakeParticipants.size;
    }
    const truncatedSpeakersList = Array.from(activeSpeakers).slice(0, availableSlotsForActiveSpeakers);
    truncatedSpeakersList.sort((a, b) => a[1].localeCompare(b[1]));
    return new Map(truncatedSpeakersList);
}
exports.getActiveSpeakersToBeDisplayed = getActiveSpeakersToBeDisplayed;
/**
 * Resolves the first loadable avatar URL for a participant.
 *
 * @param {Object} participant - The participant to resolve avatars for.
 * @param {Store} store - Redux store.
 * @returns {Promise}
 */
function getFirstLoadableAvatarUrl(participant, store) {
    const deferred = (0, helpers_1.createDeferred)();
    const fullPromise = deferred.promise
        .then(() => _getFirstLoadableAvatarUrl(participant, store))
        .then((result) => {
        if (AVATAR_QUEUE.length) {
            const next = AVATAR_QUEUE.shift();
            next.resolve();
        }
        return result;
    });
    if (AVATAR_QUEUE.length) {
        AVATAR_QUEUE.push(deferred);
    }
    else {
        deferred.resolve();
    }
    return fullPromise;
}
exports.getFirstLoadableAvatarUrl = getFirstLoadableAvatarUrl;
/**
 * Returns local participant from Redux state.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {(IParticipant|undefined)}
 */
function getLocalParticipant(stateful) {
    const state = (0, functions_6.toState)(stateful)['features/base/participants'];
    return state.local;
}
exports.getLocalParticipant = getLocalParticipant;
/**
 * Returns local screen share participant from Redux state.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state features/base/participants.
 * @returns {(IParticipant|undefined)}
 */
function getLocalScreenShareParticipant(stateful) {
    const state = (0, functions_6.toState)(stateful)['features/base/participants'];
    return state.localScreenShare;
}
exports.getLocalScreenShareParticipant = getLocalScreenShareParticipant;
/**
 * Returns screenshare participant.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state features/base/participants.
 * @param {string} id - The owner ID of the screenshare participant to retrieve.
 * @returns {(IParticipant|undefined)}
 */
function getVirtualScreenshareParticipantByOwnerId(stateful, id) {
    const state = (0, functions_6.toState)(stateful);
    const track = (0, functions_any_1.getScreenShareTrack)(state['features/base/tracks'], id);
    return getParticipantById(stateful, track?.jitsiTrack.getSourceName());
}
exports.getVirtualScreenshareParticipantByOwnerId = getVirtualScreenshareParticipantByOwnerId;
/**
 * Normalizes a display name so then no invalid values (padding, length...etc)
 * can be set.
 *
 * @param {string} name - The display name to set.
 * @returns {string}
 */
function getNormalizedDisplayName(name) {
    if (!name?.trim()) {
        return undefined;
    }
    return name.trim().substring(0, constants_4.MAX_DISPLAY_NAME_LENGTH);
}
exports.getNormalizedDisplayName = getNormalizedDisplayName;
/**
 * Returns participant by ID from Redux state.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @param {string} id - The ID of the participant to retrieve.
 * @private
 * @returns {(IParticipant|undefined)}
 */
function getParticipantById(stateful, id) {
    const state = (0, functions_6.toState)(stateful)['features/base/participants'];
    const { local, localScreenShare, remote } = state;
    return remote.get(id)
        || (local?.id === id ? local : undefined)
        || (localScreenShare?.id === id ? localScreenShare : undefined);
}
exports.getParticipantById = getParticipantById;
/**
 * Returns the participant with the ID matching the passed ID or the local participant if the ID is
 * undefined.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @param {string|undefined} [participantID] - An optional partipantID argument.
 * @returns {IParticipant|undefined}
 */
function getParticipantByIdOrUndefined(stateful, participantID) {
    return participantID ? getParticipantById(stateful, participantID) : getLocalParticipant(stateful);
}
exports.getParticipantByIdOrUndefined = getParticipantByIdOrUndefined;
/**
 * Returns a count of the known participants in the passed in redux state,
 * excluding any fake participants.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {number}
 */
function getParticipantCount(stateful) {
    const state = (0, functions_6.toState)(stateful);
    const { local, remote, fakeParticipants, sortedRemoteVirtualScreenshareParticipants } = state['features/base/participants'];
    return remote.size - fakeParticipants.size - sortedRemoteVirtualScreenshareParticipants.size + (local ? 1 : 0);
}
exports.getParticipantCount = getParticipantCount;
/**
 * Returns participant ID of the owner of a virtual screenshare participant.
 *
 * @param {string} id - The ID of the virtual screenshare participant.
 * @private
 * @returns {(string|undefined)}
 */
function getVirtualScreenshareParticipantOwnerId(id) {
    return id.split('-')[0];
}
exports.getVirtualScreenshareParticipantOwnerId = getVirtualScreenshareParticipantOwnerId;
/**
 * Returns the Map with fake participants.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {Map<string, IParticipant>} - The Map with fake participants.
 */
function getFakeParticipants(stateful) {
    return (0, functions_6.toState)(stateful)['features/base/participants'].fakeParticipants;
}
exports.getFakeParticipants = getFakeParticipants;
/**
 * Returns whether the fake participant is a local screenshare.
 *
 * @param {IParticipant|undefined} participant - The participant entity.
 * @returns {boolean} - True if it's a local screenshare participant.
 */
function isLocalScreenshareParticipant(participant) {
    return participant?.fakeParticipant === types_1.FakeParticipant.LocalScreenShare;
}
exports.isLocalScreenshareParticipant = isLocalScreenshareParticipant;
/**
 * Returns whether the fake participant is a remote screenshare.
 *
 * @param {IParticipant|undefined} participant - The participant entity.
 * @returns {boolean} - True if it's a remote screenshare participant.
 */
function isRemoteScreenshareParticipant(participant) {
    return participant?.fakeParticipant === types_1.FakeParticipant.RemoteScreenShare;
}
exports.isRemoteScreenshareParticipant = isRemoteScreenshareParticipant;
/**
 * Returns whether the fake participant is of local or virtual screenshare type.
 *
 * @param {IReduxState} state - The (whole) redux state, or redux's.
 * @param {string|undefined} participantId - The participant id.
 * @returns {boolean} - True if it's one of the two.
 */
function isScreenShareParticipantById(state, participantId) {
    const participant = getParticipantByIdOrUndefined(state, participantId);
    return isScreenShareParticipant(participant);
}
exports.isScreenShareParticipantById = isScreenShareParticipantById;
/**
 * Returns whether the fake participant is of local or virtual screenshare type.
 *
 * @param {IParticipant|undefined} participant - The participant entity.
 * @returns {boolean} - True if it's one of the two.
 */
function isScreenShareParticipant(participant) {
    return isLocalScreenshareParticipant(participant) || isRemoteScreenshareParticipant(participant);
}
exports.isScreenShareParticipant = isScreenShareParticipant;
/**
 * Returns whether the (fake) participant is a shared video.
 *
 * @param {IParticipant|undefined} participant - The participant entity.
 * @returns {boolean} - True if it's a shared video participant.
 */
function isSharedVideoParticipant(participant) {
    return participant?.fakeParticipant === types_1.FakeParticipant.SharedVideo;
}
exports.isSharedVideoParticipant = isSharedVideoParticipant;
/**
 * Returns whether the fake participant is a whiteboard.
 *
 * @param {IParticipant|undefined} participant - The participant entity.
 * @returns {boolean} - True if it's a whiteboard participant.
 */
function isWhiteboardParticipant(participant) {
    return participant?.fakeParticipant === types_1.FakeParticipant.Whiteboard;
}
exports.isWhiteboardParticipant = isWhiteboardParticipant;
/**
 * Returns a count of the known remote participants in the passed in redux state.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {number}
 */
function getRemoteParticipantCountWithFake(stateful) {
    const state = (0, functions_6.toState)(stateful);
    const participantsState = state['features/base/participants'];
    return participantsState.remote.size;
}
exports.getRemoteParticipantCountWithFake = getRemoteParticipantCountWithFake;
/**
 * Returns the muted state of the given media source for a given participant.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's.
 * @param {IParticipant} participant - The participant entity.
 * @param {MediaType} mediaType - The media type.
 * @returns {boolean} - True its muted, false otherwise.
 */
function getMutedStateByParticipantAndMediaType(stateful, participant, mediaType) {
    const type = mediaType === constants_3.MEDIA_TYPE.SCREENSHARE ? 'video' : mediaType;
    if (participant.local) {
        const state = (0, functions_6.toState)(stateful);
        const tracks = state['features/base/tracks'];
        return (0, functions_any_1.isLocalTrackMuted)(tracks, mediaType);
    }
    const sources = participant.sources?.get(type);
    if (!sources) {
        return true;
    }
    if (mediaType === constants_3.MEDIA_TYPE.AUDIO) {
        return Array.from(sources.values())[0].muted;
    }
    const videoType = mediaType === constants_3.MEDIA_TYPE.VIDEO ? constants_3.VIDEO_TYPE.CAMERA : constants_3.VIDEO_TYPE.SCREENSHARE;
    const source = Array.from(sources.values()).find(src => src.videoType === videoType);
    return source?.muted ?? true;
}
exports.getMutedStateByParticipantAndMediaType = getMutedStateByParticipantAndMediaType;
/**
 * Returns a count of the known participants in the passed in redux state,
 * including fake participants.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {number}
 */
function getParticipantCountWithFake(stateful) {
    const state = (0, functions_6.toState)(stateful);
    const { local, localScreenShare, remote } = state['features/base/participants'];
    return remote.size + (local ? 1 : 0) + (localScreenShare ? 1 : 0);
}
exports.getParticipantCountWithFake = getParticipantCountWithFake;
/**
 * Returns participant's display name.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state.
 * @param {string} id - The ID of the participant's display name to retrieve.
 * @returns {string}
 */
function getParticipantDisplayName(stateful, id) {
    const state = (0, functions_6.toState)(stateful);
    const participant = getParticipantById(state, id);
    const { defaultLocalDisplayName, defaultRemoteDisplayName } = state['features/base/config'];
    if (participant) {
        if (isScreenShareParticipant(participant)) {
            return getScreenshareParticipantDisplayName(state, id);
        }
        if (participant.name) {
            return participant.name;
        }
        if (participant.local) {
            return defaultLocalDisplayName ?? '';
        }
    }
    return defaultRemoteDisplayName ?? '';
}
exports.getParticipantDisplayName = getParticipantDisplayName;
/**
 * Returns the source names of the screenshare sources in the conference based on the presence shared by the remote
 * endpoints. This should be only used for creating/removing virtual screenshare participant tiles when ssrc-rewriting
 * is enabled. Once the tile is created, the source-name gets added to the receiver constraints based on which the
 * JVB will add the source to the video sources map and signal it to the local endpoint. Only then, a remote track is
 * created/remapped and the tracks in redux will be updated. Once the track is updated in redux, the client will
 * will continue to use the other track based getter functions for other operations related to screenshare.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state.
 * @returns {string[]}
 */
function getRemoteScreensharesBasedOnPresence(stateful) {
    const conference = (0, functions_4.getCurrentConference)(stateful);
    return conference?.getParticipants()?.reduce((screenshares, participant) => {
        const sources = participant.getSources();
        const videoSources = sources.get(constants_3.MEDIA_TYPE.VIDEO);
        const screenshareSources = Array.from(videoSources ?? new Map())
            .filter(source => source[1].videoType === constants_3.VIDEO_TYPE.DESKTOP && !source[1].muted)
            .map(source => source[0]);
        // eslint-disable-next-line no-param-reassign
        screenshares = [...screenshares, ...screenshareSources];
        return screenshares;
    }, []);
}
exports.getRemoteScreensharesBasedOnPresence = getRemoteScreensharesBasedOnPresence;
/**
 * Returns screenshare participant's display name.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state.
 * @param {string} id - The ID of the screenshare participant's display name to retrieve.
 * @returns {string}
 */
function getScreenshareParticipantDisplayName(stateful, id) {
    const ownerDisplayName = getParticipantDisplayName(stateful, getVirtualScreenshareParticipantOwnerId(id));
    return i18next_1.default.t('screenshareDisplayName', { name: ownerDisplayName });
}
exports.getScreenshareParticipantDisplayName = getScreenshareParticipantDisplayName;
/**
 * Returns a list of IDs of the participants that are currently screensharing.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state.
 * @returns {Array<string>}
 */
function getScreenshareParticipantIds(stateful) {
    return (0, functions_6.toState)(stateful)['features/base/tracks']
        .filter(track => track.videoType === constants_3.VIDEO_TYPE.DESKTOP && !track.muted)
        .map(t => t.participantId);
}
exports.getScreenshareParticipantIds = getScreenshareParticipantIds;
/**
 * Returns a list of source names associated with a given remote participant and for the given media type.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state.
 * @param {string} id - The id of the participant whose source names are to be retrieved.
 * @param {string} mediaType - The type of source, audio or video.
 * @returns {Array<string>}
 */
function getSourceNamesByMediaTypeAndParticipant(stateful, id, mediaType) {
    const participant = getParticipantById(stateful, id);
    if (!participant) {
        return [];
    }
    const sources = participant.sources;
    if (!sources) {
        return [];
    }
    return Array.from(sources.get(mediaType) ?? new Map())
        .filter(source => source[1].videoType !== constants_3.VIDEO_TYPE.DESKTOP || !source[1].muted)
        .map(s => s[0]);
}
exports.getSourceNamesByMediaTypeAndParticipant = getSourceNamesByMediaTypeAndParticipant;
/**
 * Returns a list of source names associated with a given remote participant and for the given video type (only for
 * video sources).
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state.
 * @param {string} id - The id of the participant whose source names are to be retrieved.
 * @param {string} videoType - The type of video, camera or desktop.
 * @returns {Array<string>}
 */
function getSourceNamesByVideoTypeAndParticipant(stateful, id, videoType) {
    const participant = getParticipantById(stateful, id);
    if (!participant) {
        return [];
    }
    const sources = participant.sources;
    if (!sources) {
        return [];
    }
    return Array.from(sources.get(constants_3.MEDIA_TYPE.VIDEO) ?? new Map())
        .filter(source => source[1].videoType === videoType && (videoType === constants_3.VIDEO_TYPE.CAMERA || !source[1].muted))
        .map(s => s[0]);
}
exports.getSourceNamesByVideoTypeAndParticipant = getSourceNamesByVideoTypeAndParticipant;
/**
 * Returns the presence status of a participant associated with the passed id.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {string} id - The id of the participant.
 * @returns {string} - The presence status.
 */
function getParticipantPresenceStatus(stateful, id) {
    if (!id) {
        return undefined;
    }
    const participantById = getParticipantById(stateful, id);
    if (!participantById) {
        return undefined;
    }
    return participantById.presence;
}
exports.getParticipantPresenceStatus = getParticipantPresenceStatus;
/**
 * Selectors for getting all remote participants.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {Map<string, Object>}
 */
function getRemoteParticipants(stateful) {
    return (0, functions_6.toState)(stateful)['features/base/participants'].remote;
}
exports.getRemoteParticipants = getRemoteParticipants;
/**
 * Selectors for the getting the remote participants in the order that they are displayed in the filmstrip.
 *
@param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state features/filmstrip.
 * @returns {Array<string>}
 */
function getRemoteParticipantsSorted(stateful) {
    return (0, functions_6.toState)(stateful)['features/filmstrip'].remoteParticipants;
}
exports.getRemoteParticipantsSorted = getRemoteParticipantsSorted;
/**
 * Returns the participant which has its pinned state set to truthy.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {(IParticipant|undefined)}
 */
function getPinnedParticipant(stateful) {
    const state = (0, functions_6.toState)(stateful);
    const { pinnedParticipant } = state['features/base/participants'];
    const stageFilmstrip = (0, functions_1.isStageFilmstripAvailable)(state);
    if (stageFilmstrip) {
        const { activeParticipants } = state['features/filmstrip'];
        const id = activeParticipants.find(p => p.pinned)?.participantId;
        return id ? getParticipantById(stateful, id) : undefined;
    }
    if (!pinnedParticipant) {
        return undefined;
    }
    return getParticipantById(stateful, pinnedParticipant);
}
exports.getPinnedParticipant = getPinnedParticipant;
/**
 * Returns true if the participant is a moderator.
 *
 * @param {string} participant - Participant object.
 * @returns {boolean}
 */
function isParticipantModerator(participant) {
    return participant?.role === constants_4.PARTICIPANT_ROLE.MODERATOR;
}
exports.isParticipantModerator = isParticipantModerator;
/**
 * Returns the dominant speaker participant.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state or redux's
 * {@code getState} function to be used to retrieve the state features/base/participants.
 * @returns {IParticipant} - The participant from the redux store.
 */
function getDominantSpeakerParticipant(stateful) {
    const state = (0, functions_6.toState)(stateful)['features/base/participants'];
    const { dominantSpeaker } = state;
    if (!dominantSpeaker) {
        return undefined;
    }
    return getParticipantById(stateful, dominantSpeaker);
}
exports.getDominantSpeakerParticipant = getDominantSpeakerParticipant;
/**
 * Returns true if all of the meeting participants are moderators.
 *
 * @param {Object|Function} stateful -Object or function that can be resolved
 * to the Redux state.
 * @returns {boolean}
 */
function isEveryoneModerator(stateful) {
    const state = (0, functions_6.toState)(stateful)['features/base/participants'];
    return state.numberOfNonModeratorParticipants === 0;
}
exports.isEveryoneModerator = isEveryoneModerator;
/**
 * Checks a value and returns true if it's a preloaded icon object.
 *
 * @param {?string | ?Object} icon - The icon to check.
 * @returns {boolean}
 */
function isIconUrl(icon) {
    return Boolean(icon) && (typeof icon === 'object' || typeof icon === 'function');
}
exports.isIconUrl = isIconUrl;
/**
 * Returns true if the current local participant is a moderator in the
 * conference.
 *
 * @param {Object|Function} stateful - Object or function that can be resolved
 * to the Redux state.
 * @returns {boolean}
 */
function isLocalParticipantModerator(stateful) {
    const state = (0, functions_6.toState)(stateful)['features/base/participants'];
    const { local } = state;
    if (!local) {
        return false;
    }
    return isParticipantModerator(local);
}
exports.isLocalParticipantModerator = isLocalParticipantModerator;
/**
 * Resolves the first loadable avatar URL for a participant.
 *
 * @param {Object} participant - The participant to resolve avatars for.
 * @param {Store} store - Redux store.
 * @returns {?string}
 */
async function _getFirstLoadableAvatarUrl(participant, store) {
    for (let i = 0; i < AVATAR_CHECKER_FUNCTIONS.length; i++) {
        const url = AVATAR_CHECKER_FUNCTIONS[i](participant, store);
        if (url !== null) {
            if (AVATAR_CHECKED_URLS.has(url)) {
                const { isLoadable, isUsingCORS } = AVATAR_CHECKED_URLS.get(url) || {};
                if (isLoadable) {
                    return {
                        isUsingCORS,
                        src: url
                    };
                }
            }
            else {
                try {
                    const { corsAvatarURLs } = store.getState()['features/base/config'];
                    const useCORS = isIconUrl(url) ? false : (0, functions_3.isCORSAvatarURL)(url, corsAvatarURLs);
                    const { isUsingCORS, src } = await (0, preloadImage_1.preloadImage)(url, useCORS);
                    AVATAR_CHECKED_URLS.set(src, {
                        isLoadable: true,
                        isUsingCORS
                    });
                    return {
                        isUsingCORS,
                        src
                    };
                }
                catch (e) {
                    AVATAR_CHECKED_URLS.set(url, {
                        isLoadable: false,
                        isUsingCORS: false
                    });
                }
            }
        }
    }
    return undefined;
}
/**
 * Get the participants queue with raised hands.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {Array<Object>}
 */
function getRaiseHandsQueue(stateful) {
    const { raisedHandsQueue } = (0, functions_6.toState)(stateful)['features/base/participants'];
    return raisedHandsQueue;
}
exports.getRaiseHandsQueue = getRaiseHandsQueue;
/**
 * Returns whether the given participant has his hand raised or not.
 *
 * @param {Object} participant - The participant.
 * @returns {boolean} - Whether participant has raise hand or not.
 */
function hasRaisedHand(participant) {
    return Boolean(participant?.raisedHandTimestamp);
}
exports.hasRaisedHand = hasRaisedHand;
/**
 * Add people feature enabling/disabling.
 *
 * @param {Object|Function} stateful - Object or function that can be resolved
 * to the Redux state.
 * @returns {boolean}
 */
const addPeopleFeatureControl = (stateful) => {
    const state = (0, functions_6.toState)(stateful);
    return (0, functions_5.getFeatureFlag)(state, constants_2.ADD_PEOPLE_ENABLED, true)
        && ((0, functions_2.isAddPeopleEnabled)(state) || (0, functions_2.isDialOutEnabled)(state));
};
exports.addPeopleFeatureControl = addPeopleFeatureControl;
/**
 * Controls share dialog visibility.
 *
 * @param {boolean} addPeopleFeatureEnabled - Checks if add people functionality is enabled.
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {Function}
 */
const setShareDialogVisiblity = (addPeopleFeatureEnabled, dispatch) => {
    if (addPeopleFeatureEnabled) {
        dispatch((0, actions_1.toggleShareDialog)(false));
    }
    else {
        dispatch((0, actions_1.toggleShareDialog)(true));
    }
};
exports.setShareDialogVisiblity = setShareDialogVisiblity;
