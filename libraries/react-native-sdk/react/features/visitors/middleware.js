"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const react_redux_1 = require("react-redux");
const actionTypes_1 = require("../base/conference/actionTypes");
const actions_1 = require("../base/connection/actions");
const actions_any_1 = require("../base/connection/actions.any");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const actions_2 = require("../base/participants/actions");
const functions_1 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const constants_any_1 = require("../base/ui/constants.any");
const actions_3 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const actions_4 = require("../participants-pane/actions");
const actions_5 = require("./actions");
const functions_2 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
MiddlewareRegistry_1.default.register(({ dispatch, getState }) => next => action => {
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOIN_IN_PROGRESS: {
            const { conference } = action;
            conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.PROPERTIES_CHANGED, (properties) => {
                const visitorCount = Number(properties?.['visitor-count']);
                if (!isNaN(visitorCount) && getState()['features/visitors'].count !== visitorCount) {
                    dispatch((0, actions_5.updateVisitorsCount)(visitorCount));
                }
            });
            break;
        }
        case actionTypes_1.CONFERENCE_JOINED: {
            const { conference } = action;
            if (getState()['features/visitors'].iAmVisitor) {
                const { demoteActorDisplayName } = getState()['features/visitors'];
                dispatch((0, actions_5.setVisitorDemoteActor)(undefined));
                const notificationParams = {
                    titleKey: 'visitors.notification.title',
                    descriptionKey: 'visitors.notification.description'
                };
                if (demoteActorDisplayName) {
                    notificationParams.descriptionKey = 'visitors.notification.demoteDescription';
                    notificationParams.descriptionArguments = {
                        actor: demoteActorDisplayName
                    };
                }
                // check for demote actor and update notification
                dispatch((0, actions_3.showNotification)(notificationParams, constants_1.NOTIFICATION_TIMEOUT_TYPE.STICKY));
            }
            else {
                dispatch((0, actions_5.setVisitorsSupported)(conference.isVisitorsSupported()));
                conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.VISITORS_SUPPORTED_CHANGED, (value) => {
                    dispatch((0, actions_5.setVisitorsSupported)(value));
                });
            }
            conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.VISITORS_MESSAGE, (msg) => {
                if (msg.action === 'demote-request') {
                    // we need it before the disconnect
                    const participantById = (0, functions_1.getParticipantById)(getState, msg.actor);
                    const localParticipant = (0, functions_1.getLocalParticipant)(getState);
                    if (localParticipant && localParticipant.id === msg.id) {
                        // handle demote
                        dispatch((0, actions_any_1.disconnect)(true))
                            .then(() => dispatch((0, actions_1.setPreferVisitor)(true)))
                            .then(() => {
                            // we need to set the name, so we can use it later in the notification
                            if (participantById) {
                                dispatch((0, actions_5.setVisitorDemoteActor)(participantById.name));
                            }
                            return dispatch((0, actions_1.connect)());
                        });
                    }
                }
                else if (msg.action === 'promotion-request') {
                    const request = {
                        from: msg.from,
                        nick: msg.nick
                    };
                    if (msg.on) {
                        dispatch((0, actions_5.promotionRequestReceived)(request));
                    }
                    else {
                        dispatch((0, actions_5.clearPromotionRequest)(request));
                    }
                    _handlePromotionNotification({
                        dispatch,
                        getState
                    });
                }
                else {
                    logger_1.default.error('Unknown action:', msg.action);
                }
            });
            conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.VISITORS_REJECTION, () => {
                dispatch((0, actions_2.raiseHand)(false));
            });
            break;
        }
        case actionTypes_1.ENDPOINT_MESSAGE_RECEIVED: {
            const { data } = action;
            if (data?.action === 'promotion-response' && data.approved) {
                const request = (0, functions_2.getPromotionRequests)(getState())
                    .find(r => r.from === data.id);
                request && dispatch((0, actions_5.clearPromotionRequest)(request));
            }
            break;
        }
    }
    return next(action);
});
/**
 * Function to handle the promotion notification.
 *
 * @param {Object} store - The Redux store.
 * @returns {void}
 */
function _handlePromotionNotification({ dispatch, getState }) {
    const requests = (0, functions_2.getPromotionRequests)(getState());
    if (requests.length === 0) {
        dispatch((0, actions_3.hideNotification)(constants_1.VISITORS_PROMOTION_NOTIFICATION_ID));
        return;
    }
    let notificationTitle;
    let customActionNameKey;
    let customActionHandler;
    let customActionType;
    let descriptionKey;
    let icon;
    if (requests.length === 1) {
        const firstRequest = requests[0];
        descriptionKey = 'notify.participantWantsToJoin';
        notificationTitle = firstRequest.nick;
        icon = constants_1.NOTIFICATION_ICON.PARTICIPANT;
        customActionNameKey = ['participantsPane.actions.admit', 'participantsPane.actions.reject'];
        customActionType = [constants_any_1.BUTTON_TYPES.PRIMARY, constants_any_1.BUTTON_TYPES.DESTRUCTIVE];
        customActionHandler = [() => (0, react_redux_1.batch)(() => {
                dispatch((0, actions_3.hideNotification)(constants_1.VISITORS_PROMOTION_NOTIFICATION_ID));
                dispatch((0, actions_5.approveRequest)(firstRequest));
            }),
            () => (0, react_redux_1.batch)(() => {
                dispatch((0, actions_3.hideNotification)(constants_1.VISITORS_PROMOTION_NOTIFICATION_ID));
                dispatch((0, actions_5.denyRequest)(firstRequest));
            })];
    }
    else {
        descriptionKey = 'notify.participantsWantToJoin';
        notificationTitle = i18next_1.default.t('notify.waitingParticipants', {
            waitingParticipants: requests.length
        });
        icon = constants_1.NOTIFICATION_ICON.PARTICIPANTS;
        customActionNameKey = ['notify.viewVisitors'];
        customActionType = [constants_any_1.BUTTON_TYPES.PRIMARY];
        customActionHandler = [() => (0, react_redux_1.batch)(() => {
                dispatch((0, actions_3.hideNotification)(constants_1.VISITORS_PROMOTION_NOTIFICATION_ID));
                dispatch((0, actions_4.open)());
            })];
    }
    dispatch((0, actions_3.showNotification)({
        title: notificationTitle,
        descriptionKey,
        uid: constants_1.VISITORS_PROMOTION_NOTIFICATION_ID,
        customActionNameKey,
        customActionType,
        customActionHandler,
        icon
    }, constants_1.NOTIFICATION_TIMEOUT_TYPE.STICKY));
}
