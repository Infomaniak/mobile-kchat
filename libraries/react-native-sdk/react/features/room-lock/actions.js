"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockRoom = exports._openPasswordRequiredPrompt = exports.endRoomLockRequest = exports._cancelPasswordRequiredPrompt = void 0;
const actions_1 = require("../app/actions");
const actions_2 = require("../base/conference/actions");
const constants_1 = require("../base/conference/constants");
const actions_3 = require("../base/dialog/actions");
const security_dialog_1 = require("../security/components/security-dialog");
const PasswordRequiredPrompt_1 = __importDefault(require("./components/PasswordRequiredPrompt"));
/**
 * Cancels a prompt for a password to join a specific conference/room.
 *
 * @param {JitsiConference} conference - The {@code JitsiConference} requesting
 * the password to join.
 * @protected
 * @returns {Function}
 */
function _cancelPasswordRequiredPrompt(conference) {
    return (dispatch, getState) => {
        if (typeof APP !== 'undefined') {
            // when we are redirecting the library should handle any
            // unload and clean of the connection.
            APP.API.notifyReadyToClose();
            dispatch((0, actions_1.maybeRedirectToWelcomePage)());
            return;
        }
        // Canceling PasswordRequiredPrompt is to navigate the app/user to
        // WelcomePage. In other words, the canceling invalidates the
        // locationURL. Make sure that the canceling indeed has the intent to
        // invalidate the locationURL.
        const state = getState();
        if (conference === state['features/base/conference'].passwordRequired
            && conference[constants_1.JITSI_CONFERENCE_URL_KEY]
                === state['features/base/connection'].locationURL) {
            // XXX The error associated with CONFERENCE_FAILED was marked as
            // recoverable by the feature room-lock and, consequently,
            // recoverable-aware features such as mobile's external-api did not
            // deliver the CONFERENCE_FAILED to the SDK clients/consumers. Since
            // the app/user is going to nativate to WelcomePage, the SDK
            // clients/consumers need an event.
            dispatch((0, actions_2.conferenceLeft)(conference));
            dispatch((0, actions_1.appNavigate)(undefined));
        }
    };
}
exports._cancelPasswordRequiredPrompt = _cancelPasswordRequiredPrompt;
/**
 * Ends a (user) request to lock a specific conference/room.
 *
 * @param {JitsiConference} conference - The JitsiConference to lock.
 * @param {string|undefined} password - The password with which the specified
 * conference is to be locked or undefined to cancel the (user) request to lock
 * the specified conference.
 * @returns {Function}
 */
function endRoomLockRequest(conference, password) {
    return (dispatch) => {
        const setPassword_ = password
            ? dispatch((0, actions_2.setPassword)(conference, conference.lock, password))
            : Promise.resolve();
        const endRoomLockRequest_ = () => dispatch((0, actions_3.hideDialog)(security_dialog_1.SecurityDialog));
        setPassword_.then(endRoomLockRequest_, endRoomLockRequest_);
    };
}
exports.endRoomLockRequest = endRoomLockRequest;
/**
 * Begins a prompt for a password to join a specific conference/room.
 *
 * @param {JitsiConference} conference - The {@code JitsiConference}
 * requesting the password to join.
 * @protected
 * @returns {{
 *     type: OPEN_DIALOG,
 *     component: Component,
 *     props: PropTypes
 * }}
 */
function _openPasswordRequiredPrompt(conference) {
    return (0, actions_3.openDialog)(PasswordRequiredPrompt_1.default, { conference });
}
exports._openPasswordRequiredPrompt = _openPasswordRequiredPrompt;
/**
 * Unlocks the current jitsi conference.
 *
 * @returns {Function}
 */
function unlockRoom() {
    return (dispatch, getState) => {
        const { conference } = getState()['features/base/conference'];
        return dispatch((0, actions_2.setPassword)(conference, conference?.lock, ''));
    };
}
exports.unlockRoom = unlockRoom;
