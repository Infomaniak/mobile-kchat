"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/app/actionTypes");
const actionTypes_2 = require("../base/conference/actionTypes");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_1 = require("../base/sounds/actions");
const actions_2 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const actions_3 = require("./actions");
const constants_2 = require("./constants");
const sounds_1 = require("./sounds");
MiddlewareRegistry_1.default.register(store => next => action => {
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            store.dispatch((0, actions_1.registerSound)(constants_2.NOISY_AUDIO_INPUT_SOUND_ID, sounds_1.NOISY_AUDIO_INPUT_SOUND_FILE));
            break;
        case actionTypes_1.APP_WILL_UNMOUNT:
            store.dispatch((0, actions_1.unregisterSound)(constants_2.NOISY_AUDIO_INPUT_SOUND_ID));
            break;
        case actionTypes_2.CONFERENCE_JOINED: {
            const { dispatch, getState } = store;
            const { conference } = action;
            conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.TRACK_MUTE_CHANGED, (track) => {
                const { noisyAudioInputNotificationUid } = getState()['features/noise-detection'];
                // Hide the notification in case the user mutes the microphone
                if (noisyAudioInputNotificationUid && track.isAudioTrack() && track.isLocal() && track.isMuted()) {
                    dispatch((0, actions_2.hideNotification)(noisyAudioInputNotificationUid));
                    dispatch((0, actions_3.setNoisyAudioInputNotificationUid)());
                }
            });
            conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.NOISY_MIC, async () => {
                const notification = await dispatch((0, actions_2.showNotification)({
                    titleKey: 'toolbar.noisyAudioInputTitle',
                    descriptionKey: 'toolbar.noisyAudioInputDesc'
                }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
                dispatch((0, actions_1.playSound)(constants_2.NOISY_AUDIO_INPUT_SOUND_ID));
                if (notification) {
                    // we store the last notification id so we can hide it if the mic is muted
                    dispatch((0, actions_3.setNoisyAudioInputNotificationUid)(notification.uid));
                }
            });
            break;
        }
    }
    return result;
});
