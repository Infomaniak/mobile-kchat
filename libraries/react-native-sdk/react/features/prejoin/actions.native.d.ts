import { IStore } from '../app/types';
/**
 * Action used to start the conference.
 *
 * @param {Object} options - The config options that override the default ones (if any).
 * @param {boolean} _ignoreJoiningInProgress - If true we won't check the joiningInProgress flag.
 * @returns {Function}
 */
export declare function joinConference(options?: Object, _ignoreJoiningInProgress?: boolean): (_dispatch: IStore['dispatch'], _getState: IStore['getState']) => Promise<void>;
