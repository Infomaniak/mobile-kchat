import { IReduxState } from '../app/types';
import { IStateful } from '../base/app/types';
import ScreenshotCaptureSummary from './ScreenshotCaptureSummary';
/**
 * Creates a new instance of ScreenshotCapture.
 *
 * @param {Object | Function} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {Promise<ScreenshotCapture>}
 */
export declare function createScreenshotCaptureSummary(stateful: IStateful): Promise<never> | ScreenshotCaptureSummary;
/**
 * Checks if the screenshot capture is enabled based on the config.
 *
 * @param {Object} state - Redux state.
 * @param {boolean} checkSharing - Whether to check if screensharing is on.
 * @param {boolean} checkRecording - Whether to check is recording is on.
 * @returns {boolean}
 */
export declare function isScreenshotCaptureEnabled(state: IReduxState, checkSharing?: boolean, checkRecording?: boolean): boolean;
