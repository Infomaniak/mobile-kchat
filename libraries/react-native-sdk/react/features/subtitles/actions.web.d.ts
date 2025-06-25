import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Signals that the local user has toggled the LanguageSelector button.
 *
 * @returns {Function}
 */
export declare function toggleLanguageSelectorDialog(): (dispatch: IStore['dispatch']) => void;
