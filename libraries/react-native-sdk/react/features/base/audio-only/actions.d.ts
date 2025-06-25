import { IStore } from '../../app/types';
/**
 * Sets the audio-only flag for the current JitsiConference.
 *
 * @param {boolean} audioOnly - True if the conference should be audio only; false, otherwise.
 * @returns {{
 *     type: SET_AUDIO_ONLY,
 *     audioOnly: boolean
 * }}
 */
export declare function setAudioOnly(audioOnly: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Toggles the audio-only flag for the current JitsiConference.
 *
 * @returns {Function}
 */
export declare function toggleAudioOnly(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
