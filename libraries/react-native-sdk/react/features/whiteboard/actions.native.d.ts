import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Restricts the whiteboard usage.
 *
 * @param {boolean} shouldCloseWhiteboard - Whether to dismiss the whiteboard.
 * @returns {Function}
 */
export declare const restrictWhiteboard: (shouldCloseWhiteboard?: boolean) => (dispatch: IStore['dispatch']) => void;
