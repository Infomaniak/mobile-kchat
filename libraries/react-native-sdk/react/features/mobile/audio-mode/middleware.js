"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const actionTypes_1 = require("../../base/app/actionTypes");
const actionTypes_2 = require("../../base/audio-only/actionTypes");
const actionTypes_3 = require("../../base/conference/actionTypes");
const functions_1 = require("../../base/conference/functions");
const constants_1 = require("../../base/flags/constants");
const functions_2 = require("../../base/flags/functions");
const MiddlewareRegistry_1 = __importDefault(require("../../base/redux/MiddlewareRegistry"));
const actionTypes_4 = require("./actionTypes");
const logger_1 = __importDefault(require("./logger"));
const { AudioMode } = react_native_1.NativeModules;
const AudioModeEmitter = new react_native_1.NativeEventEmitter(AudioMode);
/**
 * Middleware that captures conference actions and sets the correct audio mode
 * based on the type of conference. Audio-only conferences don't use the speaker
 * by default, and video conferences do.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    /* eslint-disable no-fallthrough */
    switch (action.type) {
        case actionTypes_4._SET_AUDIOMODE_SUBSCRIPTIONS:
            _setSubscriptions(store);
            break;
        case actionTypes_1.APP_WILL_UNMOUNT: {
            store.dispatch({
                type: actionTypes_4._SET_AUDIOMODE_SUBSCRIPTIONS,
                subscriptions: undefined
            });
            break;
        }
        case actionTypes_1.APP_WILL_MOUNT:
            _appWillMount(store);
        case actionTypes_3.CONFERENCE_FAILED: // eslint-disable-line no-fallthrough
        case actionTypes_3.CONFERENCE_LEFT:
        /*
        * NOTE: We moved the audio mode setting from CONFERENCE_WILL_JOIN to
        * CONFERENCE_JOINED because in case of a locked room, the app goes
        * through CONFERENCE_FAILED state and gets to CONFERENCE_JOINED only
        * after a correct password, so we want to make sure we have the correct
        * audio mode set up when we finally get to the conf, but also make sure
        * that the app is in the right audio mode if the user leaves the
        * conference after the password prompt appears.
        */
        case actionTypes_3.CONFERENCE_JOINED:
        case actionTypes_2.SET_AUDIO_ONLY:
            return _updateAudioMode(store, next, action);
    }
    /* eslint-enable no-fallthrough */
    return next(action);
});
/**
 * Notifies this feature that the action {@link APP_WILL_MOUNT} is being
 * dispatched within a specific redux {@code store}.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @private
 * @returns {void}
 */
function _appWillMount(store) {
    const subscriptions = [
        AudioModeEmitter.addListener(AudioMode.DEVICE_CHANGE_EVENT, _onDevicesUpdate, store)
    ];
    store.dispatch({
        type: actionTypes_4._SET_AUDIOMODE_SUBSCRIPTIONS,
        subscriptions
    });
}
/**
 * Handles audio device changes. The list will be stored on the redux store.
 *
 * @param {Object} devices - The current list of devices.
 * @private
 * @returns {void}
 */
function _onDevicesUpdate(devices) {
    // @ts-ignore
    const { dispatch } = this; // eslint-disable-line @typescript-eslint/no-invalid-this
    dispatch({
        type: actionTypes_4._SET_AUDIOMODE_DEVICES,
        devices
    });
}
/**
 * Notifies this feature that the action
 * {@link _SET_AUDIOMODE_SUBSCRIPTIONS} is being dispatched within
 * a specific redux {@code store}.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @private
 * @returns {void}
 */
function _setSubscriptions({ getState }) {
    const { subscriptions } = getState()['features/mobile/audio-mode'];
    if (subscriptions) {
        for (const subscription of subscriptions) {
            subscription.remove();
        }
    }
}
/**
 * Updates the audio mode based on the current (redux) state.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} in the specified {@code store}.
 * @param {Action} action - The redux action which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {*} The value returned by {@code next(action)}.
 */
function _updateAudioMode({ getState }, next, action) {
    const result = next(action);
    const state = getState();
    const conference = (0, functions_1.getCurrentConference)(state);
    const { enabled: audioOnly } = state['features/base/audio-only'];
    let mode;
    if ((0, functions_2.getFeatureFlag)(state, constants_1.AUDIO_FOCUS_DISABLED, false)) {
        return result;
    }
    else if (conference) {
        mode = audioOnly ? AudioMode.AUDIO_CALL : AudioMode.VIDEO_CALL;
    }
    else {
        mode = AudioMode.DEFAULT;
    }
    AudioMode.setMode(mode).catch((err) => logger_1.default.error(`Failed to set audio mode ${String(mode)}: ${err}`));
    return result;
}
