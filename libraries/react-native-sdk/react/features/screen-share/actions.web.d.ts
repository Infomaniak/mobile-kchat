import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Updates the current known status of the shared video.
 *
 * @param {boolean} isSharingAudio - Is audio currently being shared or not.
 * @returns {{
 *     type: SET_SCREEN_AUDIO_SHARE_STATE,
 *     isSharingAudio: boolean
 * }}
 */
export declare function setScreenAudioShareState(isSharingAudio: boolean): {
    type: string;
    isSharingAudio: boolean;
};
/**
 * Updates the audio track associated with the screenshare.
 *
 * @param {JitsiLocalTrack} desktopAudioTrack - The audio track captured from the screenshare.
 * @returns {{
 *      type: SET_SCREENSHARE_TRACKS,
 *      desktopAudioTrack: JitsiTrack
 * }}
 */
export declare function setScreenshareAudioTrack(desktopAudioTrack: any): {
    type: string;
    desktopAudioTrack: any;
};
/**
 * Start the audio only screen sharing flow. Function will switch between off and on states depending on the context.
 *
 * @param {Object} state - The state of the application.
 * @returns {void}
 */
export declare function startAudioScreenShareFlow(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Start normal screen sharing flow.Function will switch between off and on states depending on the context, and if
 * not explicitly told otherwise.
 *
 * @param {boolean} enabled - Explicitly set the screen sharing state.
 * @returns {void}
 */
export declare function startScreenShareFlow(enabled: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
