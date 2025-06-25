"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/conference/actionTypes");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_1 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const actionTypes_2 = require("./actionTypes");
const logger_1 = __importDefault(require("./logger"));
/**
 * Middleware that captures conference video sip gw events and stores
 * the global sip gw availability in redux or show appropriate notification
 * for sip gw sessions.
 * Captures invitation actions that create sip gw sessions or display
 * appropriate error/warning notifications.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(({ dispatch }) => next => action => {
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOIN_IN_PROGRESS: {
            const { conference } = action;
            conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.VIDEO_SIP_GW_AVAILABILITY_CHANGED, (status) => dispatch(_availabilityChanged(status)));
            conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.VIDEO_SIP_GW_SESSION_STATE_CHANGED, (event) => {
                const toDispatch = _sessionStateChanged(event);
                // sessionStateChanged can decide there is nothing to dispatch
                if (toDispatch) {
                    dispatch(toDispatch);
                }
            });
            break;
        }
        case actionTypes_2.SIP_GW_INVITE_ROOMS:
            _inviteRooms(action.rooms, action.conference, dispatch);
            break;
    }
    return result;
});
/**
 * Signals that sip gw availability had changed.
 *
 * @param {string} status - The new status of the service.
 * @returns {{
 *     type: SIP_GW_AVAILABILITY_CHANGED,
 *     status: string
 * }}
 * @private
 */
function _availabilityChanged(status) {
    return {
        type: actionTypes_2.SIP_GW_AVAILABILITY_CHANGED,
        status
    };
}
/**
 * Processes the action from the actionType {@code SIP_GW_INVITE_ROOMS} by
 * inviting rooms into the conference or showing an error message.
 *
 * @param {Array} rooms - The conference rooms to invite.
 * @param {Object} conference - The JitsiConference to invite the rooms to.
 * @param {Function} dispatch - The redux dispatch function for emitting state
 * changes (queuing error notifications).
 * @private
 * @returns {void}
 */
function _inviteRooms(rooms, conference, dispatch) {
    for (const room of rooms) {
        const { id: sipAddress, name: displayName } = room;
        if (sipAddress && displayName) {
            const newSession = conference
                .createVideoSIPGWSession(sipAddress, displayName);
            if (newSession instanceof Error) {
                const e = newSession;
                switch (e.message) {
                    case lib_jitsi_meet_1.JitsiSIPVideoGWStatus.ERROR_NO_CONNECTION: {
                        dispatch((0, actions_1.showErrorNotification)({
                            descriptionKey: 'videoSIPGW.errorInvite',
                            titleKey: 'videoSIPGW.errorInviteTitle'
                        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
                        return;
                    }
                    case lib_jitsi_meet_1.JitsiSIPVideoGWStatus.ERROR_SESSION_EXISTS: {
                        dispatch((0, actions_1.showWarningNotification)({
                            titleKey: 'videoSIPGW.errorAlreadyInvited',
                            titleArguments: { displayName }
                        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
                        return;
                    }
                }
                logger_1.default.error('Unknown error trying to create sip videogw session', e);
                return;
            }
            newSession.start();
        }
        else {
            logger_1.default.error(`No display name or sip number for ${JSON.stringify(room)}`);
        }
    }
}
/**
 * Signals that a session we created has a change in its status.
 *
 * @param {string} event - The event describing the session state change.
 * @returns {Object|null} - A notification action.
 * @private
 */
function _sessionStateChanged(event) {
    switch (event.newState) {
        case lib_jitsi_meet_1.JitsiSIPVideoGWStatus.STATE_PENDING: {
            return (0, actions_1.showNotification)({
                titleKey: 'videoSIPGW.pending',
                titleArguments: {
                    displayName: event.displayName
                }
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.SHORT);
        }
        case lib_jitsi_meet_1.JitsiSIPVideoGWStatus.STATE_FAILED: {
            return (0, actions_1.showErrorNotification)({
                titleKey: 'videoSIPGW.errorInviteFailedTitle',
                titleArguments: {
                    displayName: event.displayName
                },
                descriptionKey: 'videoSIPGW.errorInviteFailed'
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG);
        }
        case lib_jitsi_meet_1.JitsiSIPVideoGWStatus.STATE_OFF: {
            if (event.failureReason === lib_jitsi_meet_1.JitsiSIPVideoGWStatus.STATUS_BUSY) {
                return (0, actions_1.showErrorNotification)({
                    descriptionKey: 'videoSIPGW.busy',
                    titleKey: 'videoSIPGW.busyTitle'
                }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG);
            }
            else if (event.failureReason) {
                logger_1.default.error(`Unknown sip videogw error ${event.newState} ${event.failureReason}`);
            }
        }
    }
    // nothing to show
    return null;
}
