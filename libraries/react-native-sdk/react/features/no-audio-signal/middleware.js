"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const actionTypes_1 = require("../base/app/actionTypes");
const actionTypes_2 = require("../base/conference/actionTypes");
const actions_1 = require("../base/devices/actions");
const functions_1 = require("../base/devices/functions");
const lib_jitsi_meet_1 = __importStar(require("../base/lib-jitsi-meet"));
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_2 = require("../base/settings/actions");
const actions_3 = require("../base/sounds/actions");
const actions_4 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const actions_5 = require("./actions");
const DialInLink_1 = __importDefault(require("./components/DialInLink"));
const constants_2 = require("./constants");
const sounds_1 = require("./sounds");
MiddlewareRegistry_1.default.register(store => next => async (action) => {
    const result = next(action);
    const { dispatch } = store;
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            dispatch((0, actions_3.registerSound)(constants_2.NO_AUDIO_SIGNAL_SOUND_ID, sounds_1.NO_AUDIO_SIGNAL_SOUND_FILE));
            break;
        case actionTypes_1.APP_WILL_UNMOUNT:
            dispatch((0, actions_3.unregisterSound)(constants_2.NO_AUDIO_SIGNAL_SOUND_ID));
            break;
        case actionTypes_2.CONFERENCE_JOINED:
            _handleNoAudioSignalNotification(store, action);
            break;
    }
    return result;
});
/**
 * Handles the logic of displaying the no audio input detected notification as well as finding a valid device on the
 * system.
 *
 * @param {Store} store - The redux store in which the specified action is being dispatched.
 * @param {Action} action - The redux action {@code CONFERENCE_JOINED} which is being dispatched in the specified redux
 * store.
 * @private
 * @returns {void}
 */
async function _handleNoAudioSignalNotification({ dispatch, getState }, action) {
    const { conference } = action;
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.AUDIO_INPUT_STATE_CHANGE, (hasAudioInput) => {
        const { noAudioSignalNotificationUid } = getState()['features/no-audio-signal'];
        // In case the notification is displayed but the conference detected audio input signal we hide it.
        if (noAudioSignalNotificationUid && hasAudioInput) {
            dispatch((0, actions_4.hideNotification)(noAudioSignalNotificationUid));
            dispatch((0, actions_5.setNoAudioSignalNotificationUid)());
        }
    });
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.NO_AUDIO_INPUT, async () => {
        const { noSrcDataNotificationUid } = getState()['features/base/no-src-data'];
        // In case the 'no data detected from source' notification was already shown, we prevent the
        // no audio signal notification as it's redundant i.e. it's clear that the users microphone is
        // muted from system settings.
        if (noSrcDataNotificationUid) {
            return;
        }
        const activeDevice = await lib_jitsi_meet_1.default.getActiveAudioDevice();
        // In case there is a previous notification displayed just hide it.
        const { noAudioSignalNotificationUid } = getState()['features/no-audio-signal'];
        if (noAudioSignalNotificationUid) {
            dispatch((0, actions_4.hideNotification)(noAudioSignalNotificationUid));
            dispatch((0, actions_5.setNoAudioSignalNotificationUid)());
        }
        let descriptionKey = 'toolbar.noAudioSignalDesc';
        let customActionNameKey;
        let customActionHandler;
        // In case the detector picked up a device show a notification with a device suggestion
        if (activeDevice.deviceLabel !== '') {
            descriptionKey = 'toolbar.noAudioSignalDescSuggestion';
            // Preferably the label should be passed as an argument paired with a i18next string, however
            // at the point of the implementation the showNotification function only supports doing that for
            // the description.
            // TODO Add support for arguments to showNotification title and customAction strings.
            customActionNameKey = [`Switch to ${(0, functions_1.formatDeviceLabel)(activeDevice.deviceLabel)}`];
            customActionHandler = [() => {
                    // Select device callback
                    dispatch((0, actions_2.updateSettings)({
                        userSelectedMicDeviceId: activeDevice.deviceId,
                        userSelectedMicDeviceLabel: activeDevice.deviceLabel
                    }));
                    dispatch((0, actions_1.setAudioInputDevice)(activeDevice.deviceId));
                }];
        }
        const notification = await dispatch((0, actions_4.showNotification)({
            titleKey: 'toolbar.noAudioSignalTitle',
            description: react_1.default.createElement(DialInLink_1.default, null),
            descriptionKey,
            customActionNameKey,
            customActionHandler
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
        dispatch((0, actions_3.playSound)(constants_2.NO_AUDIO_SIGNAL_SOUND_ID));
        if (notification) {
            // Store the current notification uid so we can check for this state and hide it in case
            // a new track was added, thus changing the context of the notification
            dispatch((0, actions_5.setNoAudioSignalNotificationUid)(notification.uid));
        }
    });
}
