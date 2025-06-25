import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Cancels the ongoing knocking and abandons the join flow.
 *
 * @returns {Function}
 */
export declare function cancelKnocking(): (dispatch: IStore['dispatch']) => void;
