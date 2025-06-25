/// <reference types="react" />
import { IStore } from '../app/types';
import { IJitsiConference } from '../base/conference/reducer';
/**
 * Initiates authenticating and upgrading the role of the local participant to
 * moderator which will allow to create and join a new conference on an XMPP
 * password + guest access configuration. Refer to {@link LoginDialog} for more
 * info.
 *
 * @param {string} id - The XMPP user's ID (e.g. {@code user@domain.com}).
 * @param {string} password - The XMPP user's password.
 * @param {JitsiConference} conference - The conference for which the local
 * participant's role will be upgraded.
 * @returns {Function}
 */
export declare function authenticateAndUpgradeRole(id: string, password: string, conference: IJitsiConference): (dispatch: IStore['dispatch']) => any;
/**
 * Hides an authentication dialog where the local participant
 * should authenticate.
 *
 * @returns {Function}
 */
export declare function hideLoginDialog(): {
    type: string;
    component: import("react").ComponentType<any> | undefined;
};
/**
 * Login.
 *
 * @returns {{
*     type: LOGIN
* }}
*/
export declare function login(): {
    type: string;
};
/**
* Logout.
*
* @returns {{
*     type: LOGOUT
* }}
*/
export declare function logout(): {
    type: string;
};
/**
 * Opens {@link WaitForOnwerDialog}.
 *
 * @protected
 * @returns {Action}
 */
export declare function openWaitForOwnerDialog(): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
/**
 * Stops waiting for the conference owner.
 *
 * @returns {{
 *     type: STOP_WAIT_FOR_OWNER
 * }}
 */
export declare function stopWaitForOwner(): {
    type: string;
};
/**
 * Called when Jicofo rejects to create the room for anonymous user. Will
 * start the process of "waiting for the owner" by periodically trying to join
 * the room every five seconds.
 *
 * @returns {Function}
 */
export declare function waitForOwner(): (dispatch: IStore['dispatch']) => {
    type: string;
    handler: () => void;
    timeoutMs: number;
};
/**
 * Opens {@link LoginDialog} which will ask to enter username and password
 * for the current conference.
 *
 * @protected
 * @returns {Action}
 */
export declare function openLoginDialog(): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
/**
 * Updates the config with new options.
 *
 * @param {boolean} value - The new value.
 * @returns {Function}
 */
export declare function setTokenAuthUrlSuccess(value: boolean): {
    type: string;
    value: boolean;
};
