import { IStore } from '../app/types';
/**
 * Create an action for saving the conference logs.
 *
 * @returns {Function}
 */
export declare function saveLogs(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
