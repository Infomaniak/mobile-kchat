import { IStore } from '../../app/types';
export * from './actions.any';
/**
 * Signals that the local participant is ending screensharing or beginning the screensharing flow.
 *
 * @param {boolean} enabled - The state to toggle screen sharing to.
 * @param {boolean} _ignore1 - Ignored.
 * @param {any} _ignore2 - Ignored.
 * @returns {Function}
 */
export declare function toggleScreensharing(enabled: boolean, _ignore1?: boolean, _ignore2?: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
