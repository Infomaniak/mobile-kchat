"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTokenAuthUrlSuccess = exports.openLoginDialog = exports.waitForOwner = exports.stopWaitForOwner = exports.openWaitForOwnerDialog = exports.logout = exports.login = exports.hideLoginDialog = exports.authenticateAndUpgradeRole = void 0;
const actions_1 = require("../base/conference/actions");
const actions_2 = require("../base/dialog/actions");
const actionTypes_1 = require("./actionTypes");
const components_1 = require("./components");
const logger_1 = __importDefault(require("./logger"));
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
function authenticateAndUpgradeRole(id, password, conference) {
    return (dispatch) => {
        const process = conference.authenticateAndUpgradeRole({
            id,
            password,
            onLoginSuccessful() {
                // When the login succeeds, the process has completed half
                // of its job (i.e. 0.5).
                return dispatch(_upgradeRoleFinished(process, 0.5));
            }
        });
        dispatch(_upgradeRoleStarted(process));
        process.then(
        /* onFulfilled */ () => dispatch(_upgradeRoleFinished(process, 1)), 
        /* onRejected */ (error) => {
            // The lack of an error signals a cancellation.
            if (error.authenticationError || error.connectionError) {
                logger_1.default.error('authenticateAndUpgradeRole failed', error);
            }
            dispatch(_upgradeRoleFinished(process, error));
        });
        return process;
    };
}
exports.authenticateAndUpgradeRole = authenticateAndUpgradeRole;
/**
 * Signals that the process of authenticating and upgrading the local
 * participant's role has finished either with success or with a specific error.
 *
 * @param {Object} thenableWithCancel - The process of authenticating and
 * upgrading the local participant's role.
 * @param {Object} progressOrError - If the value is a {@code number}, then the
 * process of authenticating and upgrading the local participant's role has
 * succeeded in one of its two/multiple steps; otherwise, it has failed with the
 * specified error. Refer to {@link JitsiConference#authenticateAndUpgradeRole}
 * in lib-jitsi-meet for the error details.
 * @private
 * @returns {{
 *     type: UPGRADE_ROLE_FINISHED,
 *     error: ?Object,
 *     progress: number
 * }}
 */
function _upgradeRoleFinished(thenableWithCancel, progressOrError) {
    let error;
    let progress;
    if (typeof progressOrError === 'number') {
        progress = progressOrError;
    }
    else {
        // Make the specified error object resemble an Error instance (to the
        // extent that jitsi-meet needs it).
        const { authenticationError, connectionError, ...other } = progressOrError;
        error = {
            name: authenticationError || connectionError,
            ...other
        };
        progress = 0;
    }
    return {
        type: actionTypes_1.UPGRADE_ROLE_FINISHED,
        error,
        progress,
        thenableWithCancel
    };
}
/**
 * Signals that a process of authenticating and upgrading the local
 * participant's role has started.
 *
 * @param {Object} thenableWithCancel - The process of authenticating and
 * upgrading the local participant's role.
 * @private
 * @returns {{
 *     type: UPGRADE_ROLE_STARTED,
 *     thenableWithCancel: Object
 * }}
 */
function _upgradeRoleStarted(thenableWithCancel) {
    return {
        type: actionTypes_1.UPGRADE_ROLE_STARTED,
        thenableWithCancel
    };
}
/**
 * Hides an authentication dialog where the local participant
 * should authenticate.
 *
 * @returns {Function}
 */
function hideLoginDialog() {
    return (0, actions_2.hideDialog)(components_1.LoginDialog);
}
exports.hideLoginDialog = hideLoginDialog;
/**
 * Login.
 *
 * @returns {{
*     type: LOGIN
* }}
*/
function login() {
    return {
        type: actionTypes_1.LOGIN
    };
}
exports.login = login;
/**
* Logout.
*
* @returns {{
*     type: LOGOUT
* }}
*/
function logout() {
    return {
        type: actionTypes_1.LOGOUT
    };
}
exports.logout = logout;
/**
 * Opens {@link WaitForOnwerDialog}.
 *
 * @protected
 * @returns {Action}
 */
function openWaitForOwnerDialog() {
    return (0, actions_2.openDialog)(components_1.WaitForOwnerDialog);
}
exports.openWaitForOwnerDialog = openWaitForOwnerDialog;
/**
 * Stops waiting for the conference owner.
 *
 * @returns {{
 *     type: STOP_WAIT_FOR_OWNER
 * }}
 */
function stopWaitForOwner() {
    return {
        type: actionTypes_1.STOP_WAIT_FOR_OWNER
    };
}
exports.stopWaitForOwner = stopWaitForOwner;
/**
 * Called when Jicofo rejects to create the room for anonymous user. Will
 * start the process of "waiting for the owner" by periodically trying to join
 * the room every five seconds.
 *
 * @returns {Function}
 */
function waitForOwner() {
    return (dispatch) => dispatch({
        type: actionTypes_1.WAIT_FOR_OWNER,
        handler: () => dispatch((0, actions_1.checkIfCanJoin)()),
        timeoutMs: 5000
    });
}
exports.waitForOwner = waitForOwner;
/**
 * Opens {@link LoginDialog} which will ask to enter username and password
 * for the current conference.
 *
 * @protected
 * @returns {Action}
 */
function openLoginDialog() {
    return (0, actions_2.openDialog)(components_1.LoginDialog);
}
exports.openLoginDialog = openLoginDialog;
/**
 * Updates the config with new options.
 *
 * @param {boolean} value - The new value.
 * @returns {Function}
 */
function setTokenAuthUrlSuccess(value) {
    return {
        type: actionTypes_1.SET_TOKEN_AUTH_URL_SUCCESS,
        value
    };
}
exports.setTokenAuthUrlSuccess = setTokenAuthUrlSuccess;
