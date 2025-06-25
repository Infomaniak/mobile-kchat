import { IReduxState } from '../app/types';
/**
 * Control for invite others button enabling.
 *
 * @param {IReduxState} state - State object.
 * @returns {Object}
 */
export declare function getInviteOthersControl(state: IReduxState): {
    color: any;
    shareDialogVisible: boolean;
};
