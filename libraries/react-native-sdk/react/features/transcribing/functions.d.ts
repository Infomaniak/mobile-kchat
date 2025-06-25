import { IReduxState } from '../app/types';
import { IConfig } from '../base/config/configType';
/**
 * Determine which language to use for transcribing.
 *
 * @param {*} config - Application config.
 * @returns {string}
 */
export declare function determineTranscriptionLanguage(config: IConfig): string | undefined;
/**
 * Returns whether there is transcribing.
 *
 * @param {IReduxState} state - The redux state to search in.
 * @returns {boolean}
 */
export declare function isTranscribing(state: IReduxState): boolean;
/**
 * Returns true if there is a recorder transcription session running.
 * NOTE: If only the subtitles are running this function will return false.
 *
 * @param {Object} state - The redux state to search in.
 * @returns {boolean}
 */
export declare function isRecorderTranscriptionsRunning(state: IReduxState): boolean;
/**
 * Checks whether the participant can start the transcription.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - True if the participant can start the transcription.
 */
export declare function canAddTranscriber(state: IReduxState): boolean;
