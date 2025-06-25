"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../base/conference/functions");
const actionTypes_1 = require("../base/participants/actionTypes");
const constants_1 = require("../base/participants/constants");
const functions_2 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actionTypes_2 = require("../participants-pane/actionTypes");
const actionTypes_3 = require("./actionTypes");
const actions_1 = require("./actions");
const constants_2 = require("./constants");
const functions_3 = require("./functions");
/**
 * Map of timers.
 *
 * @type {Map}
 */
const timers = new Map();
/**
 * Function that creates a timeout id for specific notification.
 *
 * @param {Object} notification - Notification for which we want to create a timeout.
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {void}
 */
const createTimeoutId = (notification, dispatch) => {
    const { timeout, uid } = notification;
    if (timeout) {
        const timerID = setTimeout(() => {
            dispatch((0, actions_1.hideNotification)(uid));
        }, timeout);
        timers.set(uid, timerID);
    }
};
/**
 * Returns notifications state.
 *
 * @param {Object} state - Global state.
 * @returns {Array<Object>} - Notifications state.
 */
const getNotifications = (state) => {
    const _visible = (0, functions_3.areThereNotifications)(state);
    const { notifications } = state['features/notifications'];
    return _visible ? notifications : [];
};
/**
 * Middleware that captures actions to display notifications.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    const { dispatch, getState } = store;
    const state = getState();
    switch (action.type) {
        case actionTypes_3.CLEAR_NOTIFICATIONS: {
            const _notifications = getNotifications(state);
            for (const notification of _notifications) {
                if (timers.has(notification.uid)) {
                    const timeout = timers.get(notification.uid);
                    clearTimeout(timeout);
                    timers.delete(notification.uid);
                }
            }
            timers.clear();
            break;
        }
        case actionTypes_3.SHOW_NOTIFICATION: {
            if (timers.has(action.uid)) {
                const timer = timers.get(action.uid);
                clearTimeout(timer);
                timers.delete(action.uid);
            }
            createTimeoutId(action, dispatch);
            break;
        }
        case actionTypes_3.HIDE_NOTIFICATION: {
            const timer = timers.get(action.uid);
            clearTimeout(timer);
            timers.delete(action.uid);
            break;
        }
        case actionTypes_1.PARTICIPANT_JOINED: {
            const result = next(action);
            const { participant: p } = action;
            const { conference } = state['features/base/conference'];
            // Do not display notifications for the virtual screenshare and whiteboard tiles.
            if (conference
                && !p.local
                && !(0, functions_2.isScreenShareParticipant)(p)
                && !(0, functions_2.isWhiteboardParticipant)(p)
                && !(0, functions_3.joinLeaveNotificationsDisabled)()
                && !p.isReplacing) {
                dispatch((0, actions_1.showParticipantJoinedNotification)((0, functions_2.getParticipantDisplayName)(state, p.id)));
            }
            return result;
        }
        case actionTypes_1.PARTICIPANT_LEFT: {
            if (!(0, functions_3.joinLeaveNotificationsDisabled)()) {
                const participant = (0, functions_2.getParticipantById)(store.getState(), action.participant.id);
                // Do not display notifications for the virtual screenshare tiles.
                if (participant
                    && !participant.local
                    && !(0, functions_2.isScreenShareParticipant)(participant)
                    && !(0, functions_2.isWhiteboardParticipant)(participant)
                    && !action.participant.isReplaced) {
                    dispatch((0, actions_1.showParticipantLeftNotification)((0, functions_2.getParticipantDisplayName)(state, participant.id)));
                }
            }
            return next(action);
        }
        case actionTypes_1.PARTICIPANT_UPDATED: {
            const { disableModeratorIndicator } = state['features/base/config'];
            if (disableModeratorIndicator) {
                return next(action);
            }
            const { id, role } = action.participant;
            const localParticipant = (0, functions_2.getLocalParticipant)(state);
            if (localParticipant?.id !== id) {
                return next(action);
            }
            const oldParticipant = (0, functions_2.getParticipantById)(state, id);
            const oldRole = oldParticipant?.role;
            if (oldRole && oldRole !== role && role === constants_1.PARTICIPANT_ROLE.MODERATOR) {
                store.dispatch((0, actions_1.showNotification)({
                    titleKey: 'notify.moderator'
                }, constants_2.NOTIFICATION_TIMEOUT_TYPE.SHORT));
            }
            return next(action);
        }
        case actionTypes_2.PARTICIPANTS_PANE_OPEN: {
            store.dispatch((0, actions_1.hideNotification)(constants_2.RAISE_HAND_NOTIFICATION_ID));
            break;
        }
    }
    return next(action);
});
/**
 * StateListenerRegistry provides a reliable way to detect the leaving of a
 * conference, where we need to clean up the notifications.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => (0, functions_1.getCurrentConference)(state), 
/* listener */ (conference, { dispatch }) => {
    if (!conference) {
        dispatch((0, actions_1.clearNotifications)());
    }
});
