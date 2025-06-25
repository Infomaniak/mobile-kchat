import { IStore } from '../app/types';
/**
* Action that toggles the screenshot captures.
*
* @param {boolean} enabled - Bool that represents the intention to start/stop screenshot captures.
* @returns {Promise}
*/
export declare function toggleScreenshotCaptureSummary(enabled: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
