import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Initializes keyboard shortcuts.
 *
 * @returns {Function}
*/
export declare const initKeyboardShortcuts: () => (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
