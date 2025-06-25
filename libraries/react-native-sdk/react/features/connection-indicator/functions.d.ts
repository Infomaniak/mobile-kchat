import { ITrack } from '../base/tracks/types';
/**
 * Checks if the passed track's streaming status is active.
 *
 * @param {Object} videoTrack - Track reference.
 * @returns {boolean} - Is streaming status active.
 */
export declare function isTrackStreamingStatusActive(videoTrack?: ITrack): boolean;
/**
 * Checks if the passed track's streaming status is inactive.
 *
 * @param {Object} videoTrack - Track reference.
 * @returns {boolean} - Is streaming status inactive.
 */
export declare function isTrackStreamingStatusInactive(videoTrack?: ITrack): boolean;
/**
 * Checks if the passed track's streaming status is interrupted.
 *
 * @param {Object} videoTrack - Track reference.
 * @returns {boolean} - Is streaming status interrupted.
 */
export declare function isTrackStreamingStatusInterrupted(videoTrack?: ITrack): boolean;
