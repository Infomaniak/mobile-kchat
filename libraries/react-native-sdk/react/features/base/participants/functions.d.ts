import { IReduxState, IStore } from '../../app/types';
import { IStateful } from '../app/types';
import { MediaType } from '../media/constants';
import { IParticipant } from './types';
/**
 * Returns the list of active speakers that should be moved to the top of the sorted list of participants so that the
 * dominant speaker is visible always on the vertical filmstrip in stage layout.
 *
 * @param {Function | Object} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state.
 * @returns {Array<string>}
 */
export declare function getActiveSpeakersToBeDisplayed(stateful: IStateful): Map<string, string>;
/**
 * Resolves the first loadable avatar URL for a participant.
 *
 * @param {Object} participant - The participant to resolve avatars for.
 * @param {Store} store - Redux store.
 * @returns {Promise}
 */
export declare function getFirstLoadableAvatarUrl(participant: IParticipant, store: IStore): any;
/**
 * Returns local participant from Redux state.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {(IParticipant|undefined)}
 */
export declare function getLocalParticipant(stateful: IStateful): import("./types").ILocalParticipant | undefined;
/**
 * Returns local screen share participant from Redux state.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state features/base/participants.
 * @returns {(IParticipant|undefined)}
 */
export declare function getLocalScreenShareParticipant(stateful: IStateful): IParticipant | undefined;
/**
 * Returns screenshare participant.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state features/base/participants.
 * @param {string} id - The owner ID of the screenshare participant to retrieve.
 * @returns {(IParticipant|undefined)}
 */
export declare function getVirtualScreenshareParticipantByOwnerId(stateful: IStateful, id: string): IParticipant | undefined;
/**
 * Normalizes a display name so then no invalid values (padding, length...etc)
 * can be set.
 *
 * @param {string} name - The display name to set.
 * @returns {string}
 */
export declare function getNormalizedDisplayName(name: string): string | undefined;
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
export declare function getParticipantById(stateful: IStateful, id: string): IParticipant | undefined;
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
export declare function getParticipantByIdOrUndefined(stateful: IStateful, participantID?: string): IParticipant | undefined;
/**
 * Returns a count of the known participants in the passed in redux state,
 * excluding any fake participants.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {number}
 */
export declare function getParticipantCount(stateful: IStateful): number;
/**
 * Returns participant ID of the owner of a virtual screenshare participant.
 *
 * @param {string} id - The ID of the virtual screenshare participant.
 * @private
 * @returns {(string|undefined)}
 */
export declare function getVirtualScreenshareParticipantOwnerId(id: string): string;
/**
 * Returns the Map with fake participants.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {Map<string, IParticipant>} - The Map with fake participants.
 */
export declare function getFakeParticipants(stateful: IStateful): Map<string, IParticipant>;
/**
 * Returns whether the fake participant is a local screenshare.
 *
 * @param {IParticipant|undefined} participant - The participant entity.
 * @returns {boolean} - True if it's a local screenshare participant.
 */
export declare function isLocalScreenshareParticipant(participant?: IParticipant): boolean;
/**
 * Returns whether the fake participant is a remote screenshare.
 *
 * @param {IParticipant|undefined} participant - The participant entity.
 * @returns {boolean} - True if it's a remote screenshare participant.
 */
export declare function isRemoteScreenshareParticipant(participant?: IParticipant): boolean;
/**
 * Returns whether the fake participant is of local or virtual screenshare type.
 *
 * @param {IReduxState} state - The (whole) redux state, or redux's.
 * @param {string|undefined} participantId - The participant id.
 * @returns {boolean} - True if it's one of the two.
 */
export declare function isScreenShareParticipantById(state: IReduxState, participantId?: string): boolean;
/**
 * Returns whether the fake participant is of local or virtual screenshare type.
 *
 * @param {IParticipant|undefined} participant - The participant entity.
 * @returns {boolean} - True if it's one of the two.
 */
export declare function isScreenShareParticipant(participant?: IParticipant): boolean;
/**
 * Returns whether the (fake) participant is a shared video.
 *
 * @param {IParticipant|undefined} participant - The participant entity.
 * @returns {boolean} - True if it's a shared video participant.
 */
export declare function isSharedVideoParticipant(participant?: IParticipant): boolean;
/**
 * Returns whether the fake participant is a whiteboard.
 *
 * @param {IParticipant|undefined} participant - The participant entity.
 * @returns {boolean} - True if it's a whiteboard participant.
 */
export declare function isWhiteboardParticipant(participant?: IParticipant): boolean;
/**
 * Returns a count of the known remote participants in the passed in redux state.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {number}
 */
export declare function getRemoteParticipantCountWithFake(stateful: IStateful): number;
/**
 * Returns the muted state of the given media source for a given participant.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's.
 * @param {IParticipant} participant - The participant entity.
 * @param {MediaType} mediaType - The media type.
 * @returns {boolean} - True its muted, false otherwise.
 */
export declare function getMutedStateByParticipantAndMediaType(stateful: IStateful, participant: IParticipant, mediaType: MediaType): boolean;
/**
 * Returns a count of the known participants in the passed in redux state,
 * including fake participants.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {number}
 */
export declare function getParticipantCountWithFake(stateful: IStateful): number;
/**
 * Returns participant's display name.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state.
 * @param {string} id - The ID of the participant's display name to retrieve.
 * @returns {string}
 */
export declare function getParticipantDisplayName(stateful: IStateful, id: string): string;
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
export declare function getRemoteScreensharesBasedOnPresence(stateful: IStateful): string[];
/**
 * Returns screenshare participant's display name.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state.
 * @param {string} id - The ID of the screenshare participant's display name to retrieve.
 * @returns {string}
 */
export declare function getScreenshareParticipantDisplayName(stateful: IStateful, id: string): string;
/**
 * Returns a list of IDs of the participants that are currently screensharing.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state.
 * @returns {Array<string>}
 */
export declare function getScreenshareParticipantIds(stateful: IStateful): Array<string>;
/**
 * Returns a list of source names associated with a given remote participant and for the given media type.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state.
 * @param {string} id - The id of the participant whose source names are to be retrieved.
 * @param {string} mediaType - The type of source, audio or video.
 * @returns {Array<string>}
 */
export declare function getSourceNamesByMediaTypeAndParticipant(stateful: IStateful, id: string, mediaType: string): Array<string>;
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
export declare function getSourceNamesByVideoTypeAndParticipant(stateful: IStateful, id: string, videoType: string): Array<string>;
/**
 * Returns the presence status of a participant associated with the passed id.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {string} id - The id of the participant.
 * @returns {string} - The presence status.
 */
export declare function getParticipantPresenceStatus(stateful: IStateful, id: string): string | undefined;
/**
 * Selectors for getting all remote participants.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {Map<string, Object>}
 */
export declare function getRemoteParticipants(stateful: IStateful): Map<string, IParticipant>;
/**
 * Selectors for the getting the remote participants in the order that they are displayed in the filmstrip.
 *
@param {(Function|Object)} stateful - The (whole) redux state, or redux's {@code getState} function to be used to
 * retrieve the state features/filmstrip.
 * @returns {Array<string>}
 */
export declare function getRemoteParticipantsSorted(stateful: IStateful): string[];
/**
 * Returns the participant which has its pinned state set to truthy.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {(IParticipant|undefined)}
 */
export declare function getPinnedParticipant(stateful: IStateful): IParticipant | undefined;
/**
 * Returns true if the participant is a moderator.
 *
 * @param {string} participant - Participant object.
 * @returns {boolean}
 */
export declare function isParticipantModerator(participant?: IParticipant): boolean;
/**
 * Returns the dominant speaker participant.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state or redux's
 * {@code getState} function to be used to retrieve the state features/base/participants.
 * @returns {IParticipant} - The participant from the redux store.
 */
export declare function getDominantSpeakerParticipant(stateful: IStateful): IParticipant | undefined;
/**
 * Returns true if all of the meeting participants are moderators.
 *
 * @param {Object|Function} stateful -Object or function that can be resolved
 * to the Redux state.
 * @returns {boolean}
 */
export declare function isEveryoneModerator(stateful: IStateful): boolean;
/**
 * Checks a value and returns true if it's a preloaded icon object.
 *
 * @param {?string | ?Object} icon - The icon to check.
 * @returns {boolean}
 */
export declare function isIconUrl(icon?: string | Object): boolean;
/**
 * Returns true if the current local participant is a moderator in the
 * conference.
 *
 * @param {Object|Function} stateful - Object or function that can be resolved
 * to the Redux state.
 * @returns {boolean}
 */
export declare function isLocalParticipantModerator(stateful: IStateful): boolean;
/**
 * Get the participants queue with raised hands.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/participants.
 * @returns {Array<Object>}
 */
export declare function getRaiseHandsQueue(stateful: IStateful): Array<{
    id: string;
    raisedHandTimestamp: number;
}>;
/**
 * Returns whether the given participant has his hand raised or not.
 *
 * @param {Object} participant - The participant.
 * @returns {boolean} - Whether participant has raise hand or not.
 */
export declare function hasRaisedHand(participant?: IParticipant): boolean;
/**
 * Add people feature enabling/disabling.
 *
 * @param {Object|Function} stateful - Object or function that can be resolved
 * to the Redux state.
 * @returns {boolean}
 */
export declare const addPeopleFeatureControl: (stateful: IStateful) => any;
/**
 * Controls share dialog visibility.
 *
 * @param {boolean} addPeopleFeatureEnabled - Checks if add people functionality is enabled.
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {Function}
 */
export declare const setShareDialogVisiblity: (addPeopleFeatureEnabled: boolean, dispatch: IStore['dispatch']) => void;
