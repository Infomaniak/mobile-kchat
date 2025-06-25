"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const react_redux_1 = require("react-redux");
const actionTypes_1 = require("../base/app/actionTypes");
const actionTypes_2 = require("../base/conference/actionTypes");
const actions_1 = require("../base/conference/actions");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const functions_1 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actions_2 = require("../base/sounds/actions");
const functions_2 = require("../base/testing/functions");
const constants_any_1 = require("../base/ui/constants.any");
const actions_3 = require("../chat/actions");
const actions_any_1 = require("../chat/actions.any");
const functions_any_1 = require("../conference/functions.any");
const actions_4 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const actions_5 = require("../participants-pane/actions");
const functions_3 = require("../participants-pane/functions");
const functions_4 = require("../prejoin/functions");
const actionTypes_3 = require("./actionTypes");
const actions_6 = require("./actions");
const actions_any_2 = require("./actions.any");
const constants_2 = require("./constants");
const functions_5 = require("./functions");
const sounds_1 = require("./sounds");
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            store.dispatch((0, actions_2.registerSound)(constants_2.KNOCKING_PARTICIPANT_SOUND_ID, sounds_1.KNOCKING_PARTICIPANT_FILE));
            break;
        case actionTypes_1.APP_WILL_UNMOUNT:
            store.dispatch((0, actions_2.unregisterSound)(constants_2.KNOCKING_PARTICIPANT_SOUND_ID));
            break;
        case actionTypes_2.CONFERENCE_FAILED:
            return _conferenceFailed(store, next, action);
        case actionTypes_2.CONFERENCE_JOINED:
            return _conferenceJoined(store, next, action);
        case actionTypes_2.ENDPOINT_MESSAGE_RECEIVED: {
            const { participant, data } = action;
            _maybeSendLobbyNotification(participant, data, store);
            break;
        }
        case actionTypes_3.KNOCKING_PARTICIPANT_ARRIVED_OR_UPDATED: {
            // We need the full update result to be in the store already
            const result = next(action);
            _findLoadableAvatarForKnockingParticipant(store, action.participant);
            _handleLobbyNotification(store);
            return result;
        }
        case actionTypes_3.KNOCKING_PARTICIPANT_LEFT: {
            // We need the full update result to be in the store already
            const result = next(action);
            _handleLobbyNotification(store);
            return result;
        }
    }
    return next(action);
});
/**
 * Registers a change handler for state['features/base/conference'].conference to
 * set the event listeners needed for the lobby feature to operate.
 */
StateListenerRegistry_1.default.register(state => state['features/base/conference'].conference, (conference, { dispatch, getState }, previousConference) => {
    if (conference && !previousConference) {
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.MEMBERS_ONLY_CHANGED, (enabled) => {
            dispatch((0, actions_6.setLobbyModeEnabled)(enabled));
            if (enabled) {
                dispatch((0, actions_6.setLobbyMessageListener)());
            }
        });
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.LOBBY_USER_JOINED, (id, name) => {
            const { soundsParticipantKnocking } = getState()['features/base/settings'];
            (0, react_redux_1.batch)(() => {
                dispatch((0, actions_6.participantIsKnockingOrUpdated)({
                    id,
                    name
                }));
                if (soundsParticipantKnocking) {
                    dispatch((0, actions_2.playSound)(constants_2.KNOCKING_PARTICIPANT_SOUND_ID));
                }
                const isParticipantsPaneVisible = (0, functions_3.getParticipantsPaneOpen)(getState());
                if (typeof APP !== 'undefined') {
                    APP.API.notifyKnockingParticipant({
                        id,
                        name
                    });
                }
                if (isParticipantsPaneVisible || navigator.product === 'ReactNative') {
                    return;
                }
                _handleLobbyNotification({
                    dispatch,
                    getState
                });
            });
        });
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.LOBBY_USER_UPDATED, (id, participant) => {
            dispatch((0, actions_6.participantIsKnockingOrUpdated)({
                ...participant,
                id
            }));
        });
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.LOBBY_USER_LEFT, (id) => {
            (0, react_redux_1.batch)(() => {
                dispatch((0, actions_6.knockingParticipantLeft)(id));
                dispatch((0, actions_any_1.removeLobbyChatParticipant)());
                dispatch((0, actions_any_2.updateLobbyParticipantOnLeave)(id));
            });
        });
    }
});
/**
 * Function to handle the lobby notification.
 *
 * @param {Object} store - The Redux store.
 * @returns {void}
 */
function _handleLobbyNotification(store) {
    const { dispatch, getState } = store;
    const knockingParticipants = (0, functions_5.getKnockingParticipants)(getState());
    if (knockingParticipants.length === 0) {
        dispatch((0, actions_4.hideNotification)(constants_1.LOBBY_NOTIFICATION_ID));
        return;
    }
    let notificationTitle;
    let customActionNameKey;
    let customActionHandler;
    let customActionType;
    let descriptionKey;
    let icon;
    if (knockingParticipants.length === 1) {
        const firstParticipant = knockingParticipants[0];
        const showChat = (0, functions_5.showLobbyChatButton)(firstParticipant)(getState());
        descriptionKey = 'notify.participantWantsToJoin';
        notificationTitle = firstParticipant.name;
        icon = constants_1.NOTIFICATION_ICON.PARTICIPANT;
        customActionNameKey = ['participantsPane.actions.admit', 'participantsPane.actions.reject'];
        customActionType = [constants_any_1.BUTTON_TYPES.PRIMARY, constants_any_1.BUTTON_TYPES.DESTRUCTIVE];
        customActionHandler = [() => (0, react_redux_1.batch)(() => {
                dispatch((0, actions_4.hideNotification)(constants_1.LOBBY_NOTIFICATION_ID));
                dispatch((0, actions_6.approveKnockingParticipant)(firstParticipant.id));
            }),
            () => (0, react_redux_1.batch)(() => {
                dispatch((0, actions_4.hideNotification)(constants_1.LOBBY_NOTIFICATION_ID));
                dispatch((0, actions_6.rejectKnockingParticipant)(firstParticipant.id));
            })];
        // This checks if lobby chat button is available
        // and, if so, it adds it to the customActionNameKey array
        if (showChat) {
            customActionNameKey.splice(1, 0, 'lobby.chat');
            customActionType.splice(1, 0, constants_any_1.BUTTON_TYPES.SECONDARY);
            customActionHandler.splice(1, 0, () => (0, react_redux_1.batch)(() => {
                dispatch((0, actions_any_1.handleLobbyChatInitialized)(firstParticipant.id));
                dispatch((0, actions_3.openChat)({}, (0, functions_any_1.arePollsDisabled)(getState())));
            }));
        }
    }
    else {
        descriptionKey = 'notify.participantsWantToJoin';
        notificationTitle = i18next_1.default.t('notify.waitingParticipants', {
            waitingParticipants: knockingParticipants.length
        });
        icon = constants_1.NOTIFICATION_ICON.PARTICIPANTS;
        customActionNameKey = ['notify.viewLobby'];
        customActionType = [constants_any_1.BUTTON_TYPES.PRIMARY];
        customActionHandler = [() => (0, react_redux_1.batch)(() => {
                dispatch((0, actions_4.hideNotification)(constants_1.LOBBY_NOTIFICATION_ID));
                dispatch((0, actions_5.open)());
            })];
    }
    dispatch((0, actions_4.showNotification)({
        title: notificationTitle,
        descriptionKey,
        uid: constants_1.LOBBY_NOTIFICATION_ID,
        customActionNameKey,
        customActionType,
        customActionHandler,
        icon
    }, constants_1.NOTIFICATION_TIMEOUT_TYPE.STICKY));
}
/**
 * Function to handle the conference failed event and navigate the user to the lobby screen
 * based on the failure reason.
 *
 * @param {Object} store - The Redux store.
 * @param {Function} next - The Redux next function.
 * @param {Object} action - The Redux action.
 * @returns {Object}
 */
function _conferenceFailed({ dispatch, getState }, next, action) {
    const { error } = action;
    const state = getState();
    const { membersOnly } = state['features/base/conference'];
    const nonFirstFailure = Boolean(membersOnly);
    const { isDisplayNameRequiredError } = state['features/lobby'];
    if (error.name === lib_jitsi_meet_1.JitsiConferenceErrors.MEMBERS_ONLY_ERROR) {
        if (typeof error.recoverable === 'undefined') {
            error.recoverable = true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_lobbyJid, lobbyWaitingForHost] = error.params;
        const result = next(action);
        dispatch((0, actions_6.openLobbyScreen)());
        // if there was an error about display name and pre-join is not enabled
        if ((0, functions_4.shouldAutoKnock)(state)
            || (isDisplayNameRequiredError && !(0, functions_4.isPrejoinEnabledInConfig)(state))
            || lobbyWaitingForHost) {
            dispatch((0, actions_6.startKnocking)());
        }
        // In case of wrong password we need to be in the right state if in the meantime someone allows us to join
        if (nonFirstFailure) {
            dispatch((0, actions_1.conferenceWillJoin)(membersOnly));
        }
        dispatch((0, actions_6.setPasswordJoinFailed)(nonFirstFailure));
        return result;
    }
    else if (error.name === lib_jitsi_meet_1.JitsiConferenceErrors.DISPLAY_NAME_REQUIRED) {
        const [isLobbyEnabled] = error.params;
        const result = next(action);
        // if the error is due to required display name because lobby is enabled for the room
        // if not showing the prejoin page then show lobby UI
        if (isLobbyEnabled && !(0, functions_4.isPrejoinPageVisible)(state)) {
            dispatch((0, actions_6.openLobbyScreen)());
        }
        return result;
    }
    dispatch((0, actions_6.hideLobbyScreen)());
    if (error.name === lib_jitsi_meet_1.JitsiConferenceErrors.CONFERENCE_ACCESS_DENIED) {
        dispatch((0, actions_4.showNotification)({
            appearance: constants_1.NOTIFICATION_TYPE.ERROR,
            hideErrorSupportLink: true,
            titleKey: 'lobby.joinRejectedTitle',
            descriptionKey: 'lobby.joinRejectedMessage'
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
    }
    return next(action);
}
/**
 * Handles cleanup of lobby state when a conference is joined.
 *
 * @param {Object} store - The Redux store.
 * @param {Function} next - The Redux next function.
 * @param {Object} action - The Redux action.
 * @returns {Object}
 */
function _conferenceJoined({ dispatch }, next, action) {
    dispatch((0, actions_6.hideLobbyScreen)());
    return next(action);
}
/**
 * Finds the loadable avatar URL and updates the participant accordingly.
 *
 * @param {Object} store - The Redux store.
 * @param {Object} participant - The knocking participant.
 * @returns {void}
 */
function _findLoadableAvatarForKnockingParticipant(store, { id }) {
    const { dispatch, getState } = store;
    const updatedParticipant = getState()['features/lobby'].knockingParticipants.find(p => p.id === id);
    const { disableThirdPartyRequests } = getState()['features/base/config'];
    if (!disableThirdPartyRequests && updatedParticipant && !updatedParticipant.loadableAvatarUrl) {
        (0, functions_1.getFirstLoadableAvatarUrl)(updatedParticipant, store).then((result) => {
            if (result) {
                const { isUsingCORS, src } = result;
                dispatch((0, actions_6.participantIsKnockingOrUpdated)({
                    loadableAvatarUrl: src,
                    id,
                    isUsingCORS
                }));
            }
        });
    }
}
/**
 * Check the endpoint message that arrived through the conference and
 * sends a lobby notification, if the message belongs to the feature.
 *
 * @param {Object} origin - The origin (initiator) of the message.
 * @param {Object} message - The actual message.
 * @param {Object} store - The Redux store.
 * @returns {void}
 */
function _maybeSendLobbyNotification(origin, message, { dispatch, getState }) {
    if (!origin?._id || message?.type !== 'lobby-notify') {
        return;
    }
    const notificationProps = {
        descriptionArguments: {
            originParticipantName: (0, functions_1.getParticipantDisplayName)(getState, origin._id),
            targetParticipantName: message.name
        },
        titleKey: 'lobby.notificationTitle'
    };
    switch (message.event) {
        case 'LOBBY-ENABLED':
            notificationProps.descriptionKey = `lobby.notificationLobby${message.value ? 'En' : 'Dis'}abled`;
            break;
        case 'LOBBY-ACCESS-GRANTED':
            notificationProps.descriptionKey = 'lobby.notificationLobbyAccessGranted';
            break;
        case 'LOBBY-ACCESS-DENIED':
            notificationProps.descriptionKey = 'lobby.notificationLobbyAccessDenied';
            break;
    }
    dispatch((0, actions_4.showNotification)(notificationProps, (0, functions_2.isTestModeEnabled)(getState()) ? constants_1.NOTIFICATION_TIMEOUT_TYPE.STICKY : constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
}
