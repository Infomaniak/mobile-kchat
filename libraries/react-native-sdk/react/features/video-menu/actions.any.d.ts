import { IStore } from '../app/types';
import { MediaType } from '../base/media/constants';
/**
 * Mutes the local participant.
 *
 * @param {boolean} enable - Whether to mute or unmute.
 * @param {MEDIA_TYPE} mediaType - The type of the media channel to mute.
 * @param {boolean} stopScreenSharing - Whether or not to stop the screensharing.
 * @returns {Function}
 */
export declare function muteLocal(enable: boolean, mediaType: MediaType, stopScreenSharing?: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Mutes the remote participant with the given ID.
 *
 * @param {string} participantId - ID of the participant to mute.
 * @param {MEDIA_TYPE} mediaType - The type of the media channel to mute.
 * @returns {Function}
 */
export declare function muteRemote(participantId: string, mediaType: MediaType): (dispatch: IStore['dispatch']) => void;
/**
 * Mutes all participants.
 *
 * @param {Array<string>} exclude - Array of participant IDs to not mute.
 * @param {MEDIA_TYPE} mediaType - The media type to mute.
 * @returns {Function}
 */
export declare function muteAllParticipants(exclude: Array<string>, mediaType: MediaType): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
