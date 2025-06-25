"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dismissCalendarNotification = exports.notifyConferenceFailed = exports.notifyKickedOut = void 0;
const actions_1 = require("../base/dialog/actions");
const AlertDialog_1 = __importDefault(require("../base/dialog/components/native/AlertDialog"));
const functions_1 = require("../base/participants/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * Notify that we've been kicked out of the conference.
 *
 * @param {JitsiParticipant} participant - The {@link JitsiParticipant}
 * instance which initiated the kick event.
 * @param {?Function} submit - The function to execute after submiting the dialog.
 * @returns {Function}
 */
function notifyKickedOut(participant, submit) {
    return (dispatch, getState) => {
        if (!participant || participant?.isReplaced?.()) {
            submit?.();
            return;
        }
        dispatch((0, actions_1.openDialog)(AlertDialog_1.default, {
            contentKey: {
                key: 'dialog.kickTitle',
                params: {
                    participantDisplayName: (0, functions_1.getParticipantDisplayName)(getState, participant.getId())
                }
            },
            onSubmit: submit
        }));
    };
}
exports.notifyKickedOut = notifyKickedOut;
/**
 * Notify that we've been kicked out of the conference.
 *
 * @param {string} reasonKey - The translation key for the reason why the conference failed.
 * @param {?Function} submit - The function to execute after submiting the dialog.
 * @returns {Function}
 */
function notifyConferenceFailed(reasonKey, submit) {
    return (dispatch) => {
        if (!reasonKey) {
            submit?.();
            return;
        }
        // we have to push the opening of the dialog to the queue
        // so that we make sure it will be visible after the events
        // of conference destroyed are done
        setTimeout(() => dispatch((0, actions_1.openDialog)(AlertDialog_1.default, {
            contentKey: {
                key: reasonKey
            },
            params: {},
            onSubmit: () => {
                submit?.();
                dispatch((0, actions_1.hideDialog)(AlertDialog_1.default));
            }
        })));
    };
}
exports.notifyConferenceFailed = notifyConferenceFailed;
/**
 * Dismisses calendar notification about next or ongoing event.
 *
 * @returns {Object}
 */
function dismissCalendarNotification() {
    return {
        type: actionTypes_1.DISMISS_CALENDAR_NOTIFICATION
    };
}
exports.dismissCalendarNotification = dismissCalendarNotification;
