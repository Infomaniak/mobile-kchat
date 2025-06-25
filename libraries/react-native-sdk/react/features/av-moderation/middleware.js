"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actionTypes_1 = require("../base/app/actionTypes");
const functions_1 = require("../base/conference/functions");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const constants_1 = require("../base/media/constants");
const actionTypes_2 = require("../base/participants/actionTypes");
const actions_1 = require("../base/participants/actions");
const functions_2 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actions_2 = require("../base/sounds/actions");
const actions_3 = require("../notifications/actions");
const constants_2 = require("../notifications/constants");
const actions_any_1 = require("../video-menu/actions.any");
const actionTypes_3 = require("./actionTypes");
const actions_4 = require("./actions");
const constants_3 = require("./constants");
const functions_3 = require("./functions");
const sounds_1 = require("./sounds");
MiddlewareRegistry_1.default.register(({ dispatch, getState }) => next => action => {
    const { type } = action;
    const { conference } = (0, functions_1.getConferenceState)(getState());
    switch (type) {
        case actionTypes_1.APP_WILL_MOUNT: {
            dispatch((0, actions_2.registerSound)(constants_3.ASKED_TO_UNMUTE_SOUND_ID, sounds_1.ASKED_TO_UNMUTE_FILE));
            break;
        }
        case actionTypes_1.APP_WILL_UNMOUNT: {
            dispatch((0, actions_2.unregisterSound)(constants_3.ASKED_TO_UNMUTE_SOUND_ID));
            break;
        }
        case actionTypes_3.LOCAL_PARTICIPANT_MODERATION_NOTIFICATION: {
            let descriptionKey;
            let titleKey;
            let uid = '';
            const localParticipant = (0, functions_2.getLocalParticipant)(getState);
            const raisedHand = (0, functions_2.hasRaisedHand)(localParticipant);
            switch (action.mediaType) {
                case constants_1.MEDIA_TYPE.AUDIO: {
                    titleKey = 'notify.moderationInEffectTitle';
                    uid = constants_3.AUDIO_MODERATION_NOTIFICATION_ID;
                    break;
                }
                case constants_1.MEDIA_TYPE.VIDEO: {
                    titleKey = 'notify.moderationInEffectVideoTitle';
                    uid = constants_3.VIDEO_MODERATION_NOTIFICATION_ID;
                    break;
                }
                case constants_1.MEDIA_TYPE.SCREENSHARE: {
                    titleKey = 'notify.moderationInEffectCSTitle';
                    uid = constants_3.CS_MODERATION_NOTIFICATION_ID;
                    break;
                }
            }
            dispatch((0, actions_3.showNotification)({
                customActionNameKey: ['notify.raiseHandAction'],
                customActionHandler: [() => (0, react_redux_1.batch)(() => {
                        !raisedHand && dispatch((0, actions_1.raiseHand)(true));
                        dispatch((0, actions_3.hideNotification)(uid));
                    })],
                descriptionKey,
                sticky: true,
                titleKey,
                uid
            }, constants_2.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
            break;
        }
        case actionTypes_3.REQUEST_DISABLE_AUDIO_MODERATION: {
            conference?.disableAVModeration(constants_1.MEDIA_TYPE.AUDIO);
            break;
        }
        case actionTypes_3.REQUEST_DISABLE_VIDEO_MODERATION: {
            conference?.disableAVModeration(constants_1.MEDIA_TYPE.VIDEO);
            break;
        }
        case actionTypes_3.REQUEST_ENABLE_AUDIO_MODERATION: {
            conference?.enableAVModeration(constants_1.MEDIA_TYPE.AUDIO);
            break;
        }
        case actionTypes_3.REQUEST_ENABLE_VIDEO_MODERATION: {
            conference?.enableAVModeration(constants_1.MEDIA_TYPE.VIDEO);
            break;
        }
        case actionTypes_2.PARTICIPANT_UPDATED: {
            const state = getState();
            const audioModerationEnabled = (0, functions_3.isEnabledFromState)(constants_1.MEDIA_TYPE.AUDIO, state);
            const participant = action.participant;
            if (participant && audioModerationEnabled) {
                if ((0, functions_2.isLocalParticipantModerator)(state)) {
                    // this is handled only by moderators
                    if ((0, functions_2.hasRaisedHand)(participant)) {
                        // if participant raises hand show notification
                        !(0, functions_3.isParticipantApproved)(participant.id, constants_1.MEDIA_TYPE.AUDIO)(state)
                            && dispatch((0, actions_4.participantPendingAudio)(participant));
                    }
                    else {
                        // if participant lowers hand hide notification
                        (0, functions_3.isParticipantPending)(participant, constants_1.MEDIA_TYPE.AUDIO)(state)
                            && dispatch((0, actions_4.dismissPendingAudioParticipant)(participant));
                    }
                }
                else if (participant.id === (0, functions_2.getLocalParticipant)(state)?.id
                    && /* the new role */ (0, functions_2.isParticipantModerator)(participant)) {
                    // this is the granted moderator case
                    (0, functions_2.getRemoteParticipants)(state).forEach(p => {
                        (0, functions_2.hasRaisedHand)(p) && !(0, functions_3.isParticipantApproved)(p.id, constants_1.MEDIA_TYPE.AUDIO)(state)
                            && dispatch((0, actions_4.participantPendingAudio)(p));
                    });
                }
            }
            break;
        }
        case actionTypes_3.ENABLE_MODERATION: {
            if (typeof APP !== 'undefined') {
                APP.API.notifyModerationChanged(action.mediaType, true);
            }
            break;
        }
        case actionTypes_3.DISABLE_MODERATION: {
            if (typeof APP !== 'undefined') {
                APP.API.notifyModerationChanged(action.mediaType, false);
            }
            break;
        }
        case actionTypes_3.LOCAL_PARTICIPANT_APPROVED: {
            if (typeof APP !== 'undefined') {
                const local = (0, functions_2.getLocalParticipant)(getState());
                APP.API.notifyParticipantApproved(local?.id, action.mediaType);
            }
            break;
        }
        case actionTypes_3.PARTICIPANT_APPROVED: {
            if (typeof APP !== 'undefined') {
                APP.API.notifyParticipantApproved(action.id, action.mediaType);
            }
            break;
        }
        case actionTypes_3.LOCAL_PARTICIPANT_REJECTED: {
            if (typeof APP !== 'undefined') {
                const local = (0, functions_2.getLocalParticipant)(getState());
                APP.API.notifyParticipantRejected(local?.id, action.mediaType);
            }
            break;
        }
        case actionTypes_3.PARTICIPANT_REJECTED: {
            if (typeof APP !== 'undefined') {
                APP.API.notifyParticipantRejected(action.id, action.mediaType);
            }
            break;
        }
    }
    return next(action);
});
/**
 * Registers a change handler for state['features/base/conference'].conference to
 * set the event listeners needed for the A/V moderation feature to operate.
 */
StateListenerRegistry_1.default.register(state => state['features/base/conference'].conference, (conference, { dispatch }, previousConference) => {
    if (conference && !previousConference) {
        // local participant is allowed to unmute
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.AV_MODERATION_APPROVED, ({ mediaType }) => {
            dispatch((0, actions_4.localParticipantApproved)(mediaType));
            // Audio & video moderation are both enabled at the same time.
            // Avoid displaying 2 different notifications.
            if (mediaType === constants_1.MEDIA_TYPE.AUDIO) {
                dispatch((0, actions_3.showNotification)({
                    titleKey: 'notify.hostAskedUnmute',
                    sticky: true,
                    customActionNameKey: ['notify.unmute'],
                    customActionHandler: [() => dispatch((0, actions_any_1.muteLocal)(false, constants_1.MEDIA_TYPE.AUDIO))],
                    uid: constants_3.ASKED_TO_UNMUTE_NOTIFICATION_ID
                }, constants_2.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
                dispatch((0, actions_2.playSound)(constants_3.ASKED_TO_UNMUTE_SOUND_ID));
            }
        });
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.AV_MODERATION_REJECTED, ({ mediaType }) => {
            dispatch((0, actions_4.localParticipantRejected)(mediaType));
        });
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.AV_MODERATION_CHANGED, ({ enabled, mediaType, actor }) => {
            enabled ? dispatch((0, actions_4.enableModeration)(mediaType, actor)) : dispatch((0, actions_4.disableModeration)(mediaType, actor));
        });
        // this is received by moderators
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.AV_MODERATION_PARTICIPANT_APPROVED, ({ participant, mediaType }) => {
            const { _id: id } = participant;
            (0, react_redux_1.batch)(() => {
                // store in the whitelist
                dispatch((0, actions_4.participantApproved)(id, mediaType));
                // remove from pending list
                dispatch((0, actions_4.dismissPendingParticipant)(id, mediaType));
            });
        });
        // this is received by moderators
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.AV_MODERATION_PARTICIPANT_REJECTED, ({ participant, mediaType }) => {
            const { _id: id } = participant;
            dispatch((0, actions_4.participantRejected)(id, mediaType));
        });
    }
});
