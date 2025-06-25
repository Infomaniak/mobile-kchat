import { IStore } from '../app/types';
import { IInvitee } from './types';
/**
 * Creates a (redux) action to signal that a click/tap has been performed on
 * {@link InviteButton} and that the execution flow for adding/inviting people
 * to the current conference/meeting is to begin.
 *
 * @returns {{
 *     type: BEGIN_ADD_PEOPLE
 * }}
 */
export declare function beginAddPeople(): {
    type: string;
};
/**
 * Creates a (redux) action to signal that the {@code AddPeopleDialog}
 * should close.
 *
 * @returns {{
 *     type: HIDE_ADD_PEOPLE_DIALOG
 * }}
 */
export declare function hideAddPeopleDialog(): {
    type: string;
};
/**
 * Invites (i.e. Sends invites to) an array of invitees (which may be a
 * combination of users, rooms, phone numbers, and video rooms.
 *
 * @param  {Array<Object>} invitees - The recipients to send invites to.
 * @param  {Array<Object>} showCalleeInfo - Indicates whether the
 * {@code CalleeInfo} should be displayed or not.
 * @returns {Promise<Array<Object>>} A {@code Promise} resolving with an array
 * of invitees who were not invited (i.e. Invites were not sent to them).
 */
export declare function invite(invitees: IInvitee[], showCalleeInfo?: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<IInvitee[]>;
/**
 * Sends AJAX requests for dial-in numbers and conference ID.
 *
 * @returns {Function}
 */
export declare function updateDialInNumbers(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sets the visibility of {@code CalleeInfo}.
 *
 * @param {boolean|undefined} [calleeInfoVisible] - If {@code CalleeInfo} is
 * to be displayed/visible, then {@code true}; otherwise, {@code false} or
 * {@code undefined}.
 * @param {Object|undefined} [initialCalleeInfo] - Callee information.
 * @returns {{
 *     type: SET_CALLEE_INFO_VISIBLE,
 *     calleeInfoVisible: (boolean|undefined),
 *     initialCalleeInfo
 * }}
 */
export declare function setCalleeInfoVisible(calleeInfoVisible: boolean, initialCalleeInfo?: Object): {
    type: string;
    calleeInfoVisible: boolean;
    initialCalleeInfo: Object | undefined;
};
/**
 * Adds pending invite request.
 *
 * @param {Object} request - The request.
 * @returns {{
 *     type: ADD_PENDING_INVITE_REQUEST,
 *     request: Object
 * }}
 */
export declare function addPendingInviteRequest(request: {
    callback: Function;
    invitees: Array<Object>;
}): {
    type: string;
    request: {
        callback: Function;
        invitees: Array<Object>;
    };
};
/**
 * Removes all pending invite requests.
 *
 * @returns {{
 *     type: REMOVE_PENDING_INVITE_REQUEST
 * }}
 */
export declare function removePendingInviteRequests(): {
    type: string;
};
