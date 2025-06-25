"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/conference/actionTypes");
const actions_1 = require("../base/dialog/actions");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_2 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const actions_3 = require("./actions");
const PasswordRequiredPrompt_1 = __importDefault(require("./components/PasswordRequiredPrompt"));
const constants_2 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
/**
 * Middleware that captures conference failed and checks for password required
 * error and requests a dialog for user to enter password.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.CONFERENCE_FAILED:
            return _conferenceFailed(store, next, action);
        case actionTypes_1.CONFERENCE_JOINED:
            return _conferenceJoined(store, next, action);
        case actionTypes_1.LOCK_STATE_CHANGED: {
            const previousLockedState = store.getState()['features/base/conference'].locked;
            const result = next(action);
            const currentLockedState = store.getState()['features/base/conference'].locked;
            if (currentLockedState === constants_2.LOCKED_REMOTELY) {
                store.dispatch((0, actions_2.showNotification)({
                    titleKey: 'notify.passwordSetRemotely'
                }, constants_1.NOTIFICATION_TIMEOUT_TYPE.SHORT));
            }
            else if (previousLockedState === constants_2.LOCKED_REMOTELY && !currentLockedState) {
                store.dispatch((0, actions_2.showNotification)({
                    titleKey: 'notify.passwordRemovedRemotely'
                }, constants_1.NOTIFICATION_TIMEOUT_TYPE.SHORT));
            }
            return result;
        }
        case actionTypes_1.SET_PASSWORD_FAILED:
            return _setPasswordFailed(store, next, action);
    }
    return next(action);
});
/**
 * Handles cleanup of lock prompt state when a conference is joined.
 *
 * @param {Store} store - The redux store in which the specified action is being
 * dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified action to the specified store.
 * @param {Action} action - The redux action {@code CONFERENCE_JOINED} which
 * specifies the details associated with joining the conference.
 * @private
 * @returns {*}
 */
function _conferenceJoined({ dispatch }, next, action) {
    dispatch((0, actions_1.hideDialog)(PasswordRequiredPrompt_1.default));
    return next(action);
}
/**
 * Handles errors that occur when a conference fails.
 *
 * @param {Store} store - The redux store in which the specified action is being
 * dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified action to the specified store.
 * @param {Action} action - The redux action {@code CONFERENCE_FAILED} which
 * specifies the details associated with the error and the failed conference.
 * @private
 * @returns {*}
 */
function _conferenceFailed({ dispatch }, next, action) {
    const { conference, error } = action;
    if (conference && error.name === lib_jitsi_meet_1.JitsiConferenceErrors.PASSWORD_REQUIRED) {
        // XXX The feature room-lock affords recovery after CONFERENCE_FAILED
        // caused by JitsiConferenceErrors.PASSWORD_REQUIRED.
        if (typeof error.recoverable === 'undefined') {
            error.recoverable = true;
        }
        if (error.recoverable) {
            dispatch((0, actions_3._openPasswordRequiredPrompt)(conference));
        }
    }
    else {
        dispatch((0, actions_1.hideDialog)(PasswordRequiredPrompt_1.default));
    }
    return next(action);
}
/**
 * Handles errors that occur when a password fails to be set.
 *
 * @param {Store} store - The redux store in which the specified action is being
 * dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified action to the specified store.
 * @param {Action} action - The redux action {@code SET_PASSWORD_ERROR} which
 * has the error type that should be handled.
 * @private
 * @returns {*}
 */
function _setPasswordFailed(store, next, action) {
    if (typeof APP !== 'undefined') {
        // TODO Remove this logic when displaying of error messages on web is
        // handled through react/redux.
        const { error } = action;
        let descriptionKey;
        let titleKey;
        if (error === lib_jitsi_meet_1.JitsiConferenceErrors.PASSWORD_NOT_SUPPORTED) {
            logger_1.default.warn('room passwords not supported');
            descriptionKey = 'dialog.passwordNotSupported';
            titleKey = 'dialog.passwordNotSupportedTitle';
        }
        else {
            logger_1.default.warn('setting password failed', error);
            descriptionKey = 'dialog.lockMessage';
            titleKey = 'dialog.lockTitle';
        }
        APP.store.dispatch((0, actions_2.showErrorNotification)({
            descriptionKey,
            titleKey
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
    }
    return next(action);
}
