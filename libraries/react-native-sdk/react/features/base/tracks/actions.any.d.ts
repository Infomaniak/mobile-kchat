/// <reference types="node" />
import { IStore } from '../../app/types';
import { IJitsiConference } from '../conference/reducer';
import { MediaType, VideoType } from '../media/constants';
import { ITrackOptions } from './types';
/**
 * Add a given local track to the conference.
 *
 * @param {JitsiLocalTrack} newTrack - The local track to be added to the conference.
 * @returns {Function}
 */
export declare function addLocalTrack(newTrack: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<{
    type: string;
    track: {
        jitsiTrack: any;
        isReceivingData: any;
        local: any;
        mediaType: any;
        mirror: boolean;
        muted: any;
        noDataFromSourceNotificationInfo: {
            uid: string | undefined;
            timeout?: undefined;
        } | {
            timeout: NodeJS.Timeout;
            uid?: undefined;
        } | undefined;
        participantId: any;
        videoStarted: boolean;
        videoType: any;
    };
}[]>;
/**
 * Requests the creating of the desired media type tracks. Desire is expressed
 * by base/media unless the function caller specifies desired media types
 * explicitly and thus override base/media. Dispatches a
 * {@code createLocalTracksA} action for the desired media types for which there
 * are no existing tracks yet.
 *
 * @returns {Function}
 */
export declare function createDesiredLocalTracks(...desiredTypes: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Request to start capturing local audio and/or video. By default, the user
 * facing camera will be selected.
 *
 * @param {Object} [options] - For info @see JitsiMeetJS.createLocalTracks.
 * @returns {Function}
 */
export declare function createLocalTracksA(options?: ITrackOptions): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<any[]>;
/**
 * Calls JitsiLocalTrack#dispose() on the given track or on all local tracks (if none are passed) ignoring errors if
 * track is already disposed. After that signals tracks to be removed.
 *
 * @param {JitsiLocalTrack|null} [track] - The local track that needs to be destroyed.
 * @returns {Function}
 */
export declare function destroyLocalTracks(track?: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Signals that the passed JitsiLocalTrack has triggered a no data from source event.
 *
 * @param {JitsiLocalTrack} track - The track.
 * @returns {{
*     type: TRACK_NO_DATA_FROM_SOURCE,
*     track: Track
* }}
*/
export declare function noDataFromSource(track: any): {
    type: string;
    track: any;
};
/**
 * Displays a no data from source video error if needed.
 *
 * @param {JitsiLocalTrack} jitsiTrack - The track.
 * @returns {Function}
 */
export declare function showNoDataFromSourceVideoError(jitsiTrack: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Replaces one track with another for one renegotiation instead of invoking
 * two renegotiations with a separate removeTrack and addTrack. Disposes the
 * removed track as well.
 *
 * @param {JitsiLocalTrack|null} oldTrack - The track to dispose.
 * @param {JitsiLocalTrack|null} newTrack - The track to use instead.
 * @param {JitsiConference} [conference] - The conference from which to remove
 * and add the tracks. If one is not provided, the conference in the redux store
 * will be used.
 * @returns {Function}
 */
export declare function replaceLocalTrack(oldTrack: any, newTrack: any, conference?: IJitsiConference): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Create an action for when a new track has been signaled to be added to the
 * conference.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)} track - JitsiTrack instance.
 * @returns {Function}
 */
export declare function trackAdded(track: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<{
    type: string;
    track: {
        jitsiTrack: any;
        isReceivingData: any;
        local: any;
        mediaType: any;
        mirror: boolean;
        muted: any;
        noDataFromSourceNotificationInfo: {
            uid: string | undefined;
            timeout?: undefined;
        } | {
            timeout: NodeJS.Timeout;
            uid?: undefined;
        } | undefined;
        participantId: any;
        videoStarted: boolean;
        videoType: any;
    };
}>;
/**
 * Create an action for when a track's muted state has been signaled to be
 * changed.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)} track - JitsiTrack instance.
 * @returns {{
 *     type: TRACK_UPDATED,
 *     track: Track
 * }}
 */
export declare function trackMutedChanged(track: any): {
    track: {
        jitsiTrack: any;
        muted: boolean;
    };
    type: 'TRACK_UPDATED';
};
/**
 * Create an action for when a track's muted state change action has failed. This could happen because of
 * {@code getUserMedia} errors during unmute or replace track errors at the peerconnection level.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)} track - JitsiTrack instance.
 * @param {boolean} wasMuting - If the operation that failed was a mute operation or an unmute operation.
 * @returns {{
 *     type: TRACK_MUTE_UNMUTE_FAILED,
 *     track: Track
 * }}
 */
export declare function trackMuteUnmuteFailed(track: any, wasMuting: boolean): {
    track: any;
    type: 'TRACK_MUTE_UNMUTE_FAILED';
    wasMuting: boolean;
};
/**
 * Create an action for when a track's no data from source notification information changes.
 *
 * @param {JitsiLocalTrack} track - JitsiTrack instance.
 * @param {Object} noDataFromSourceNotificationInfo - Information about no data from source notification.
 * @returns {{
 *     type: TRACK_UPDATED,
 *     track: Track
 * }}
 */
export declare function trackNoDataFromSourceNotificationInfoChanged(track: any, noDataFromSourceNotificationInfo?: Object): {
    type: string;
    track: {
        jitsiTrack: any;
        noDataFromSourceNotificationInfo: Object | undefined;
    };
};
/**
 * Create an action for when a track has been signaled for removal from the
 * conference.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)} track - JitsiTrack instance.
 * @returns {{
 *     type: TRACK_REMOVED,
 *     track: Track
 * }}
 */
export declare function trackRemoved(track: any): {
    track: {
        jitsiTrack: any;
    };
    type: 'TRACK_REMOVED';
};
/**
 * Signal that track's video started to play.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)} track - JitsiTrack instance.
 * @returns {{
 *     type: TRACK_UPDATED,
 *     track: Track
 * }}
 */
export declare function trackVideoStarted(track: any): {
    track: {
        jitsiTrack: any;
        videoStarted: true;
    };
    type: 'TRACK_UPDATED';
};
/**
 * Create an action for when participant video type changes.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)} track - JitsiTrack instance.
 * @param {VIDEO_TYPE|undefined} videoType - Video type.
 * @returns {{
 *     type: TRACK_UPDATED,
 *     track: Track
 * }}
 */
export declare function trackVideoTypeChanged(track: any, videoType: VideoType): {
    type: string;
    track: {
        jitsiTrack: any;
        videoType: VideoType;
        mediaType: MediaType;
    };
};
/**
 * Create an action for when track streaming status changes.
 *
 * @param {(JitsiRemoteTrack)} track - JitsiTrack instance.
 * @param {string} streamingStatus - The new streaming status of the track.
 * @returns {{
 *     type: TRACK_UPDATED,
 *     track: Track
 * }}
 */
export declare function trackStreamingStatusChanged(track: any, streamingStatus: string): {
    track: {
        jitsiTrack: any;
        streamingStatus: string;
    };
    type: 'TRACK_UPDATED';
};
/**
 * Disposes passed tracks and signals them to be removed.
 *
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)[]} tracks - List of tracks.
 * @protected
 * @returns {Function}
 */
export declare function _disposeAndRemoveTracks(tracks: any[]): (dispatch: IStore['dispatch']) => Promise<{
    track: {
        jitsiTrack: any;
    };
    type: "TRACK_REMOVED";
}[]>;
/**
 * If the local track if of type Desktop, it calls _disposeAndRemoveTracks) on it.
 *
 * @returns {Function}
 */
export declare function destroyLocalDesktopTrackIfExists(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sets UID of the displayed no data from source notification. Used to track
 * if the notification was previously displayed in this context.
 *
 * @param {number} uid - Notification UID.
 * @returns {{
    *     type: SET_NO_AUDIO_SIGNAL_UID,
    *     uid: string
    * }}
    */
export declare function setNoSrcDataNotificationUid(uid?: string): {
    type: string;
    uid: string | undefined;
};
/**
 * Toggles the facingMode constraint on the video stream.
 *
 * @returns {Function}
 */
export declare function toggleCamera(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
