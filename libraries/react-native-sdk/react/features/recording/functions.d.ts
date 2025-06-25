import { IReduxState, IStore } from '../app/types';
/**
 * Searches in the passed in redux state for an active recording session of the
 * passed in mode.
 *
 * @param {Object} state - The redux state to search in.
 * @param {string} mode - Find an active recording session of the given mode.
 * @returns {Object|undefined}
 */
export declare function getActiveSession(state: IReduxState, mode: string): import("./reducer").ISessionData | undefined;
/**
 * Returns an estimated recording duration based on the size of the video file
 * in MB. The estimate is calculated under the assumption that 1 min of recorded
 * video needs 10MB of storage on average.
 *
 * @param {number} size - The size in MB of the recorded video.
 * @returns {number} - The estimated duration in minutes.
 */
export declare function getRecordingDurationEstimation(size?: number | null): number;
/**
 * Searches in the passed in redux state for a recording session that matches
 * the passed in recording session ID.
 *
 * @param {Object} state - The redux state to search in.
 * @param {string} id - The ID of the recording session to find.
 * @returns {Object|undefined}
 */
export declare function getSessionById(state: IReduxState, id: string): import("./reducer").ISessionData | undefined;
/**
 * Fetches the recording link from the server.
 *
 * @param {string} url - The base url.
 * @param {string} recordingSessionId - The ID of the recording session to find.
 * @param {string} region - The meeting region.
 * @param {string} tenant - The meeting tenant.
 * @returns {Promise<any>}
 */
export declare function getRecordingLink(url: string, recordingSessionId: string, region: string, tenant: string): Promise<any>;
/**
 * Selector used for determining if recording is saved on dropbox.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {string}
 */
export declare function isSavingRecordingOnDropbox(state: IReduxState): boolean;
/**
 * Selector used for determining disable state for the meeting highlight button.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {string}
 */
export declare function isHighlightMeetingMomentDisabled(state: IReduxState): boolean;
/**
 * Returns the recording session status that is to be shown in a label. E.g. If
 * there is a session with the status OFF and one with PENDING, then the PENDING
 * one will be shown, because that is likely more important for the user to see.
 *
 * @param {Object} state - The redux state to search in.
 * @param {string} mode - The recording mode to get status for.
 * @returns {string|undefined}
 */
export declare function getSessionStatusToShow(state: IReduxState, mode: string): string | undefined;
/**
 * Check if local recording is supported.
 *
 * @returns {boolean} - Whether local recording is supported or not.
 */
export declare function supportsLocalRecording(): any;
/**
 * Returns true if there is a cloud recording running.
 *
 * @param {IReduxState} state - The redux state to search in.
 * @returns {boolean}
 */
export declare function isCloudRecordingRunning(state: IReduxState): boolean;
/**
 * Returns true if there is a recording session running.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {boolean}
 */
export declare function isRecordingRunning(state: IReduxState): boolean;
/**
 * Returns true if the participant can stop recording.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {boolean}
 */
export declare function canStopRecording(state: IReduxState): boolean;
/**
 * Returns whether the transcription should start automatically when recording starts.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {boolean}
 */
export declare function shouldAutoTranscribeOnRecord(state: IReduxState): boolean;
/**
 * Returns whether the recording should be shared.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {boolean}
 */
export declare function isRecordingSharingEnabled(state: IReduxState): boolean;
/**
 * Returns the recording button props.
 *
 * @param {Object} state - The redux state to search in.
 *
 * @returns {{
 *    disabled: boolean,
 *    tooltip: string,
 *    visible: boolean
 * }}
 */
export declare function getRecordButtonProps(state: IReduxState): {
    disabled: boolean;
    tooltip: string;
    visible: boolean | undefined;
};
/**
 * Returns the resource id.
 *
 * @param {Object | string} recorder - A participant or it's resource.
 * @returns {string|undefined}
 */
export declare function getResourceId(recorder: string | {
    getId: Function;
}): any;
/**
 * Sends a meeting highlight to backend.
 *
 * @param  {Object} state - Redux state.
 * @returns {boolean} - True if sent, false otherwise.
 */
export declare function sendMeetingHighlight(state: IReduxState): Promise<boolean>;
/**
 * Whether a remote participant is recording locally or not.
 *
 * @param {Object} state - Redux state.
 * @returns {boolean}
 */
export declare function isRemoteParticipantRecordingLocally(state: IReduxState): boolean;
/**
 * Unregisters the audio files based on locale.
 *
 * @param {Dispatch<any>} dispatch - The redux dispatch function.
 * @returns {void}
 */
export declare function unregisterRecordingAudioFiles(dispatch: IStore['dispatch']): void;
/**
 * Registers the audio files based on locale.
 *
 * @param {Dispatch<any>} dispatch - The redux dispatch function.
 * @param {boolean|undefined} shouldUnregister - Whether the sounds should be unregistered.
 * @returns {void}
 */
export declare function registerRecordingAudioFiles(dispatch: IStore['dispatch'], shouldUnregister?: boolean): void;
