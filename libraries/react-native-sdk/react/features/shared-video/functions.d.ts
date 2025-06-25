import { IStateful } from '../base/app/types';
/**
 * Checks if the status is one that is actually sharing the video - playing, pause or start.
 *
 * @param {string} status - The shared video status.
 * @returns {boolean}
 */
export declare function isSharingStatus(status: string): boolean;
/**
 * Returns true if there is a video being shared in the meeting.
 *
 * @param {Object | Function} stateful - The Redux state or a function that gets resolved to the Redux state.
 * @returns {boolean}
 */
export declare function isVideoPlaying(stateful: IStateful): boolean;
/**
 * Extracts a Youtube id or URL from the user input.
 *
 * @param {string} input - The user input.
 * @returns {string|undefined}
 */
export declare function extractYoutubeIdOrURL(input: string): string | undefined;
