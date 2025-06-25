"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/app/actionTypes");
const actionTypes_2 = require("../base/conference/actionTypes");
const functions_1 = require("../base/conference/functions");
const actionTypes_3 = require("../base/connection/actionTypes");
const actions_1 = require("../base/dialog/actions");
const functions_2 = require("../base/dialog/functions");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const constants_1 = require("../base/media/constants");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const functions_any_1 = require("../base/tracks/functions.any");
const uri_1 = require("../base/util/uri");
const actions_2 = require("../settings/actions");
const actionTypes_4 = require("./actionTypes");
const actions_3 = require("./actions");
const components_1 = require("./components");
const functions_3 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Middleware that captures connection or conference failed errors and controls
 * {@link WaitForOwnerDialog} and {@link LoginDialog}.
 *
 * FIXME Some of the complexity was introduced by the lack of dialog stacking.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_4.CANCEL_LOGIN: {
            const { dispatch, getState } = store;
            const state = getState();
            const { thenableWithCancel } = state['features/authentication'];
            thenableWithCancel?.cancel();
            // The LoginDialog can be opened on top of "wait for owner". The app
            // should navigate only if LoginDialog was open without the
            // WaitForOwnerDialog.
            if (!(0, functions_2.isDialogOpen)(store, components_1.WaitForOwnerDialog)) {
                if (_isWaitingForOwner(store)) {
                    // Instead of hiding show the new one.
                    const result = next(action);
                    dispatch((0, actions_3.openWaitForOwnerDialog)());
                    return result;
                }
                dispatch((0, actions_3.hideLoginDialog)());
                const { authRequired, conference } = state['features/base/conference'];
                const { passwordRequired } = state['features/base/connection'];
                // Only end the meeting if we are not already inside and trying to upgrade.
                // NOTE: Despite it's confusing name, `passwordRequired` implies an XMPP
                // connection auth error.
                if ((passwordRequired || authRequired) && !conference) {
                    dispatch((0, actions_3.redirectToDefaultLocation)());
                }
            }
            break;
        }
        case actionTypes_2.CONFERENCE_FAILED: {
            const { error } = action;
            // XXX The feature authentication affords recovery from
            // CONFERENCE_FAILED caused by
            // JitsiConferenceErrors.AUTHENTICATION_REQUIRED.
            let recoverable;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_lobbyJid, lobbyWaitingForHost] = error.params;
            if (error.name === lib_jitsi_meet_1.JitsiConferenceErrors.AUTHENTICATION_REQUIRED
                || (error.name === lib_jitsi_meet_1.JitsiConferenceErrors.MEMBERS_ONLY_ERROR && lobbyWaitingForHost)) {
                if (typeof error.recoverable === 'undefined') {
                    error.recoverable = true;
                }
                recoverable = error.recoverable;
            }
            if (recoverable) {
                store.dispatch((0, actions_3.waitForOwner)());
            }
            else {
                store.dispatch((0, actions_3.stopWaitForOwner)());
            }
            break;
        }
        case actionTypes_2.CONFERENCE_JOINED: {
            const { dispatch, getState } = store;
            const state = getState();
            const config = state['features/base/config'];
            if ((0, functions_3.isTokenAuthEnabled)(config)
                && config.tokenAuthUrlAutoRedirect
                && state['features/base/jwt'].jwt) {
                // auto redirect is turned on and we have succesfully logged in
                // let's mark that
                dispatch((0, actions_3.setTokenAuthUrlSuccess)(true));
            }
            if (_isWaitingForOwner(store)) {
                store.dispatch((0, actions_3.stopWaitForOwner)());
            }
            store.dispatch((0, actions_3.hideLoginDialog)());
            break;
        }
        case actionTypes_2.CONFERENCE_LEFT:
            store.dispatch((0, actions_3.stopWaitForOwner)());
            break;
        case actionTypes_3.CONNECTION_ESTABLISHED:
            store.dispatch((0, actions_3.hideLoginDialog)());
            break;
        case actionTypes_3.CONNECTION_FAILED: {
            const { error } = action;
            const state = store.getState();
            const { jwt } = state['features/base/jwt'];
            if (error
                && error.name === lib_jitsi_meet_1.JitsiConnectionErrors.PASSWORD_REQUIRED
                && typeof error.recoverable === 'undefined'
                && !jwt) {
                error.recoverable = true;
                _handleLogin(store);
            }
            break;
        }
        case actionTypes_4.LOGIN: {
            _handleLogin(store);
            break;
        }
        case actionTypes_4.LOGOUT: {
            _handleLogout(store);
            break;
        }
        case actionTypes_1.APP_WILL_NAVIGATE: {
            const { dispatch, getState } = store;
            const state = getState();
            const config = state['features/base/config'];
            const room = state['features/base/conference'].room;
            if ((0, functions_1.isRoomValid)(room)
                && config.tokenAuthUrl && config.tokenAuthUrlAutoRedirect
                && state['features/authentication'].tokenAuthUrlSuccessful
                && !state['features/base/jwt'].jwt) {
                // if we have auto redirect enabled, and we have previously logged in successfully
                // we will redirect to the auth url to get the token and login again
                // we want to mark token auth success to false as if login is unsuccessful
                // the participant can join anonymously and not go in login loop
                dispatch((0, actions_3.setTokenAuthUrlSuccess)(false));
            }
            break;
        }
        case actionTypes_4.STOP_WAIT_FOR_OWNER:
            _clearExistingWaitForOwnerTimeout(store);
            store.dispatch((0, actions_1.hideDialog)(components_1.WaitForOwnerDialog));
            break;
        case actionTypes_4.UPGRADE_ROLE_FINISHED: {
            const { error, progress } = action;
            if (!error && progress === 1) {
                store.dispatch((0, actions_3.hideLoginDialog)());
            }
            break;
        }
        case actionTypes_4.WAIT_FOR_OWNER: {
            _clearExistingWaitForOwnerTimeout(store);
            const { handler, timeoutMs } = action;
            action.waitForOwnerTimeoutID = setTimeout(handler, timeoutMs);
            // The WAIT_FOR_OWNER action is cyclic, and we don't want to hide the
            // login dialog every few seconds.
            (0, functions_2.isDialogOpen)(store, components_1.LoginDialog)
                || store.dispatch((0, actions_3.openWaitForOwnerDialog)());
            break;
        }
    }
    return next(action);
});
/**
 * Will clear the wait for conference owner timeout handler if any is currently
 * set.
 *
 * @param {Object} store - The redux store.
 * @returns {void}
 */
function _clearExistingWaitForOwnerTimeout({ getState }) {
    const { waitForOwnerTimeoutID } = getState()['features/authentication'];
    waitForOwnerTimeoutID && clearTimeout(waitForOwnerTimeoutID);
}
/**
 * Checks if the cyclic "wait for conference owner" task is currently scheduled.
 *
 * @param {Object} store - The redux store.
 * @returns {boolean}
 */
function _isWaitingForOwner({ getState }) {
    return Boolean(getState()['features/authentication'].waitForOwnerTimeoutID);
}
/**
 * Handles login challenge. Opens login dialog or redirects to token auth URL.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @returns {void}
 */
function _handleLogin({ dispatch, getState }) {
    const state = getState();
    const config = state['features/base/config'];
    const room = state['features/base/conference'].room;
    const { locationURL = { href: '' } } = state['features/base/connection'];
    const { tenant } = (0, uri_1.parseURIString)(locationURL.href) || {};
    const { enabled: audioOnlyEnabled } = state['features/base/audio-only'];
    const audioMuted = (0, functions_any_1.isLocalTrackMuted)(state['features/base/tracks'], constants_1.MEDIA_TYPE.AUDIO);
    const videoMuted = (0, functions_any_1.isLocalTrackMuted)(state['features/base/tracks'], constants_1.MEDIA_TYPE.VIDEO);
    if (!room) {
        logger_1.default.warn('Cannot handle login, room is undefined!');
        return;
    }
    if (!(0, functions_3.isTokenAuthEnabled)(config)) {
        dispatch((0, actions_3.openLoginDialog)());
        return;
    }
    (0, functions_3.getTokenAuthUrl)(config, locationURL, {
        audioMuted,
        audioOnlyEnabled,
        skipPrejoin: true,
        videoMuted
    }, room, tenant)
        .then((tokenAuthServiceUrl) => {
        if (!tokenAuthServiceUrl) {
            logger_1.default.warn('Cannot handle login, token service URL is not set');
            return;
        }
        return dispatch((0, actions_3.openTokenAuthUrl)(tokenAuthServiceUrl));
    });
}
/**
 * Handles logout challenge. Opens logout dialog and hangs up the conference.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {string} logoutUrl - The url for logging out.
 * @returns {void}
 */
function _handleLogout({ dispatch, getState }) {
    const state = getState();
    const { conference } = state['features/base/conference'];
    if (!conference) {
        return;
    }
    dispatch((0, actions_2.openLogoutDialog)());
}
