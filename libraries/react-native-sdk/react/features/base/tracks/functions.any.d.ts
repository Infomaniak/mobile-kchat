import { IReduxState, IStore } from '../../app/types';
import { MediaType } from '../media/constants';
import { IMediaState } from '../media/reducer';
import { IGUMPendingState } from '../media/types';
import { IParticipant } from '../participants/types';
import { ITrack } from './types';
/**
 * Returns root tracks state.
 *
 * @param {IReduxState} state - Global state.
 * @returns {Object} Tracks state.
 */
export declare const getTrackState: (state: IReduxState) => import("./reducer").ITracksState;
/**
 * Checks if the passed media type is muted for the participant.
 *
 * @param {IParticipant} participant - Participant reference.
 * @param {MediaType} mediaType - Media type.
 * @param {IReduxState} state - Global state.
 * @returns {boolean} - Is the media type muted for the participant.
 */
export declare function isParticipantMediaMuted(participant: IParticipant | undefined, mediaType: MediaType, state: IReduxState): boolean;
/**
 * Checks if the participant is audio muted.
 *
 * @param {IParticipant} participant - Participant reference.
 * @param {IReduxState} state - Global state.
 * @returns {boolean} - Is audio muted for the participant.
 */
export declare function isParticipantAudioMuted(participant: IParticipant, state: IReduxState): boolean;
/**
 * Checks if the participant is video muted.
 *
 * @param {IParticipant} participant - Participant reference.
 * @param {IReduxState} state - Global state.
 * @returns {boolean} - Is video muted for the participant.
 */
export declare function isParticipantVideoMuted(participant: IParticipant | undefined, state: IReduxState): boolean;
/**
 * Returns local audio track.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @returns {(Track|undefined)}
 */
export declare function getLocalAudioTrack(tracks: ITrack[]): ITrack | undefined;
/**
 * Returns the local desktop track.
 *
 * @param {Track[]} tracks - List of all tracks.
 * @param {boolean} [includePending] - Indicates whether a local track is to be returned if it is still pending.
 * A local track is pending if {@code getUserMedia} is still executing to create it and, consequently, its
 * {@code jitsiTrack} property is {@code undefined}. By default a pending local track is not returned.
 * @returns {(Track|undefined)}
 */
export declare function getLocalDesktopTrack(tracks: ITrack[], includePending?: boolean): ITrack | undefined;
/**
 * Returns the stored local desktop jitsiLocalTrack.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {JitsiLocalTrack|undefined}
 */
export declare function getLocalJitsiDesktopTrack(state: IReduxState): any;
/**
 * Returns local track by media type.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {MediaType} mediaType - Media type.
 * @param {boolean} [includePending] - Indicates whether a local track is to be
 * returned if it is still pending. A local track is pending if
 * {@code getUserMedia} is still executing to create it and, consequently, its
 * {@code jitsiTrack} property is {@code undefined}. By default a pending local
 * track is not returned.
 * @returns {(Track|undefined)}
 */
export declare function getLocalTrack(tracks: ITrack[], mediaType: MediaType, includePending?: boolean): ITrack | undefined;
/**
 * Returns an array containing the local tracks with or without a (valid)
 * {@code JitsiTrack}.
 *
 * @param {ITrack[]} tracks - An array containing all local tracks.
 * @param {boolean} [includePending] - Indicates whether a local track is to be
 * returned if it is still pending. A local track is pending if
 * {@code getUserMedia} is still executing to create it and, consequently, its
 * {@code jitsiTrack} property is {@code undefined}. By default a pending local
 * track is not returned.
 * @returns {Track[]}
 */
export declare function getLocalTracks(tracks: ITrack[], includePending?: boolean): ITrack[];
/**
 * Returns local video track.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @returns {(Track|undefined)}
 */
export declare function getLocalVideoTrack(tracks: ITrack[]): ITrack | undefined;
/**
 * Returns the stored local video track.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {Object}
 */
export declare function getLocalJitsiVideoTrack(state: IReduxState): any;
/**
 * Returns the stored local audio track.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {Object}
 */
export declare function getLocalJitsiAudioTrack(state: IReduxState): any;
/**
 * Returns track of specified media type for specified participant.
 *
 * @param {IReduxState} state - The redux state.
 * @param {IParticipant} participant - Participant Object.
 * @returns {(Track|undefined)}
 */
export declare function getVideoTrackByParticipant(state: IReduxState, participant?: IParticipant): ITrack | undefined;
/**
 * Returns track of specified media type for specified participant id.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {MediaType} mediaType - Media type.
 * @param {string} participantId - Participant ID.
 * @returns {(Track|undefined)}
 */
export declare function getTrackByMediaTypeAndParticipant(tracks: ITrack[], mediaType: MediaType, participantId?: string): ITrack | undefined;
/**
 * Returns track for specified participant id.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {string} participantId - Participant ID.
 * @returns {(Track[]|undefined)}
 */
export declare function getTrackByParticipantId(tracks: ITrack[], participantId: string): ITrack[];
/**
 * Returns screenshare track of given virtualScreenshareParticipantId.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {string} virtualScreenshareParticipantId - Virtual Screenshare Participant ID.
 * @returns {(Track|undefined)}
 */
export declare function getVirtualScreenshareParticipantTrack(tracks: ITrack[], virtualScreenshareParticipantId: string): ITrack | undefined;
/**
 * Returns screenshare track of given owner ID.
 *
 * @param {Track[]} tracks - List of all tracks.
 * @param {string} ownerId - Screenshare track owner ID.
 * @returns {(Track|undefined)}
 */
export declare function getScreenShareTrack(tracks: ITrack[], ownerId: string): ITrack | undefined;
/**
 * Returns track source name of specified media type for specified participant id.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {MediaType} mediaType - Media type.
 * @param {string} participantId - Participant ID.
 * @returns {(string|undefined)}
 */
export declare function getTrackSourceNameByMediaTypeAndParticipant(tracks: ITrack[], mediaType: MediaType, participantId: string): any;
/**
 * Returns the track if any which corresponds to a specific instance
 * of JitsiLocalTrack or JitsiRemoteTrack.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)} jitsiTrack - JitsiTrack instance.
 * @returns {(Track|undefined)}
 */
export declare function getTrackByJitsiTrack(tracks: ITrack[], jitsiTrack: any): ITrack | undefined;
/**
 * Returns tracks of specified media type.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {MediaType} mediaType - Media type.
 * @returns {Track[]}
 */
export declare function getTracksByMediaType(tracks: ITrack[], mediaType: MediaType): ITrack[];
/**
 * Checks if the first local track in the given tracks set is muted.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {MediaType} mediaType - The media type of tracks to be checked.
 * @returns {boolean} True if local track is muted or false if the track is
 * unmuted or if there are no local tracks of the given media type in the given
 * set of tracks.
 */
export declare function isLocalTrackMuted(tracks: ITrack[], mediaType: MediaType): boolean;
/**
 * Checks if the local video track is of type DESKtOP.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean}
 */
export declare function isLocalVideoTrackDesktop(state: IReduxState): boolean;
/**
 * Returns true if the remote track of the given media type and the given
 * participant is muted, false otherwise.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {MediaType} mediaType - The media type of tracks to be checked.
 * @param {string} participantId - Participant ID.
 * @returns {boolean}
 */
export declare function isRemoteTrackMuted(tracks: ITrack[], mediaType: MediaType, participantId: string): boolean;
/**
 * Returns whether or not the current environment needs a user interaction with
 * the page before any unmute can occur.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean}
 */
export declare function isUserInteractionRequiredForUnmute(state: IReduxState): any;
/**
 * Sets the GUM pending state for the passed track operation (mute/unmute) and media type.
 * NOTE: We need this only for web.
 *
 * @param {IGUMPendingState} status - The new GUM pending status.
 * @param {MediaType} mediaType - The media type related to the operation (audio or video).
 * @param {boolean} muted - True if the operation is mute and false for unmute.
 * @param {Function} dispatch - The dispatch method.
 * @returns {void}
 */
export declare function _setGUMPendingState(status: IGUMPendingState, mediaType: MediaType, muted: boolean, dispatch?: IStore['dispatch']): void;
/**
 * Mutes or unmutes a specific {@code JitsiLocalTrack}. If the muted state of the specified {@code track} is already in
 * accord with the specified {@code muted} value, then does nothing.
 *
 * @param {JitsiLocalTrack} track - The {@code JitsiLocalTrack} to mute or unmute.
 * @param {boolean} muted - If the specified {@code track} is to be muted, then {@code true}; otherwise, {@code false}.
 * @param {Object} state - The redux state.
 * @param {Function} dispatch - The dispatch method.
 * @returns {Promise}
 */
export declare function setTrackMuted(track: any, muted: boolean, state: IReduxState | IMediaState, dispatch?: IStore['dispatch']): any;
/**
 * Logs the current track state for a participant.
 *
 * @param {ITrack[]} tracksState - The tracks from redux.
 * @param {string} participantId - The ID of the participant.
 * @param {string} reason - The reason for the track change.
 * @returns {void}
 */
export declare function logTracksForParticipant(tracksState: ITrack[], participantId: string, reason?: string): void;
/**
 * Gets the default camera facing mode.
 *
 * @param {Object} state - The redux state.
 * @returns {string} - The camera facing mode.
 */
export declare function getCameraFacingMode(state: IReduxState): string;
