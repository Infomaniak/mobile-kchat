"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/app/actionTypes");
const actionTypes_2 = require("../base/conference/actionTypes");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const actions_1 = require("../base/media/actions");
const constants_1 = require("../base/media/constants");
const actions_2 = require("../base/participants/actions");
const functions_1 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_3 = require("../base/sounds/actions");
const actions_4 = require("../notifications/actions");
const constants_2 = require("../notifications/constants");
const functions_2 = require("../participants-pane/functions");
const functions_any_1 = require("../toolbox/functions.any");
const actions_5 = require("./actions");
const constants_3 = require("./constants");
const sounds_1 = require("./sounds");
MiddlewareRegistry_1.default.register(store => next => action => {
    const result = next(action);
    const { dispatch, getState } = store;
    const { conference } = action;
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            dispatch((0, actions_3.registerSound)(constants_3.TALK_WHILE_MUTED_SOUND_ID, sounds_1.TALK_WHILE_MUTED_SOUND_FILE));
            break;
        case actionTypes_1.APP_WILL_UNMOUNT:
            dispatch((0, actions_3.unregisterSound)(constants_3.TALK_WHILE_MUTED_SOUND_ID));
            break;
        case actionTypes_2.CONFERENCE_JOINED: {
            conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.TRACK_MUTE_CHANGED, (track) => {
                const { currentNotificationUid } = getState()['features/talk-while-muted'];
                if (currentNotificationUid && track.isAudioTrack() && track.isLocal() && !track.isMuted()) {
                    dispatch((0, actions_4.hideNotification)(currentNotificationUid));
                    dispatch((0, actions_5.setCurrentNotificationUid)());
                }
            });
            conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.TALK_WHILE_MUTED, async () => {
                const state = getState();
                const local = (0, functions_1.getLocalParticipant)(state);
                // Display the talk while muted notification only when the audio button is not disabled.
                if (!(0, functions_any_1.isAudioMuteButtonDisabled)(state)) {
                    const forceMuted = (0, functions_2.isForceMuted)(local, constants_1.MEDIA_TYPE.AUDIO, state);
                    const notification = await dispatch((0, actions_4.showNotification)({
                        titleKey: 'toolbar.talkWhileMutedPopup',
                        customActionNameKey: [forceMuted ? 'notify.raiseHandAction' : 'notify.unmute'],
                        customActionHandler: [() => dispatch(forceMuted ? (0, actions_2.raiseHand)(true) : (0, actions_1.setAudioMuted)(false))]
                    }, constants_2.NOTIFICATION_TIMEOUT_TYPE.LONG));
                    const { soundsTalkWhileMuted } = getState()['features/base/settings'];
                    if (soundsTalkWhileMuted) {
                        dispatch((0, actions_3.playSound)(constants_3.TALK_WHILE_MUTED_SOUND_ID));
                    }
                    if (notification) {
                        // we store the last start muted notification id that we showed,
                        // so we can hide it when unmuted mic is detected
                        dispatch((0, actions_5.setCurrentNotificationUid)(notification.uid));
                    }
                }
            });
            break;
        }
    }
    return result;
});
