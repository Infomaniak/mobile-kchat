import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Starts the process for inviting people. Depending on the system config it
 * may use the system share sheet or the invite people dialog.
 *
 * @returns {Function}
 */
export declare function doInvitePeople(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
