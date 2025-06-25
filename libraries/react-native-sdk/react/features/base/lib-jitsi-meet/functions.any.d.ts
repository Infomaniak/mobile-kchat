import { IStateful } from '../app/types';
import { ConnectionFailedError } from '../connection/types';
/**
 * Creates a {@link JitsiLocalTrack} model from the given device id.
 *
 * @param {string} type - The media type of track being created. Expected values
 * are "video" or "audio".
 * @param {string} deviceId - The id of the target media source.
 * @param {number} [timeout] - A timeout for the JitsiMeetJS.createLocalTracks function call.
 * @param {Object} additionalOptions - Extra options to be passed to lib-jitsi-meet's {@code createLocalTracks}.
 *
 * @returns {Promise<JitsiLocalTrack>}
 */
export declare function createLocalTrack(type: string, deviceId: string | null, timeout?: number | null, additionalOptions?: Object): any;
/**
 * Determines whether analytics is enabled in a specific redux {@code store}.
 *
 * @param {IStateful} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {boolean} If analytics is enabled, {@code true}; {@code false},
 * otherwise.
 */
export declare function isAnalyticsEnabled(stateful: IStateful): boolean;
/**
 * Determines whether a specific {@link JitsiConferenceErrors} instance
 * indicates a fatal {@link JitsiConference} error.
 *
 * FIXME Figure out the category of errors defined by the function and describe
 * that category. I've currently named the category fatal because it appears to
 * be used in the cases of unrecoverable errors that necessitate a reload.
 *
 * @param {Error|string} error - The {@code JitsiConferenceErrors} instance to
 * categorize/classify or an {@link Error}-like object.
 * @returns {boolean} If the specified {@code JitsiConferenceErrors} instance
 * indicates a fatal {@code JitsiConference} error, {@code true}; otherwise,
 * {@code false}.
 */
export declare function isFatalJitsiConferenceError(error: Error | string): boolean;
/**
 * Determines whether a specific {@link JitsiConnectionErrors} instance
 * indicates a fatal {@link JitsiConnection} error.
 *
 * FIXME Figure out the category of errors defined by the function and describe
 * that category. I've currently named the category fatal because it appears to
 * be used in the cases of unrecoverable errors that necessitate a reload.
 *
 * @param {Error|string} error - The {@code JitsiConnectionErrors} instance to
 * categorize/classify or an {@link Error}-like object.
 * @returns {boolean} If the specified {@code JitsiConnectionErrors} instance
 * indicates a fatal {@code JitsiConnection} error, {@code true}; otherwise,
 * {@code false}.
 */
export declare function isFatalJitsiConnectionError(error: Error | string | ConnectionFailedError): boolean;
