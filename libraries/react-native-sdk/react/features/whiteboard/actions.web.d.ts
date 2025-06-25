import { IStore } from '../app/types';
export * from './actions.any';
/**
 * API to toggle the whiteboard.
 *
 * @returns {Function}
 */
export declare function toggleWhiteboard(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Restricts the whiteboard usage.
 *
 * @param {boolean} shouldCloseWhiteboard - Whether to dismiss the whiteboard.
 * @returns {Function}
 */
export declare const restrictWhiteboard: (shouldCloseWhiteboard?: boolean) => (dispatch: IStore['dispatch']) => void;
