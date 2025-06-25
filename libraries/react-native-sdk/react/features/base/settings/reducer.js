"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error
const js_utils_1 = require("@jitsi/js-utils");
const lodash_1 = __importDefault(require("lodash"));
const actionTypes_1 = require("../app/actionTypes");
const PersistenceRegistry_1 = __importDefault(require("../redux/PersistenceRegistry"));
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const helpers_1 = require("../util/helpers");
const actionTypes_2 = require("./actionTypes");
/**
 * The default/initial redux state of the feature {@code base/settings}.
 *
 * @type Object
 */
const DEFAULT_STATE = {
    audioOutputDeviceId: undefined,
    avatarURL: undefined,
    cameraDeviceId: undefined,
    disableCallIntegration: undefined,
    disableCrashReporting: undefined,
    disableP2P: undefined,
    disableSelfView: false,
    displayName: undefined,
    email: undefined,
    localFlipX: true,
    maxStageParticipants: 1,
    micDeviceId: undefined,
    serverURL: undefined,
    hideShareAudioHelper: false,
    soundsIncomingMessage: true,
    soundsParticipantJoined: true,
    soundsParticipantKnocking: true,
    soundsParticipantLeft: true,
    soundsTalkWhileMuted: true,
    soundsReactions: true,
    startAudioOnly: false,
    startCarMode: false,
    startWithAudioMuted: false,
    startWithVideoMuted: false,
    userSelectedAudioOutputDeviceId: undefined,
    userSelectedCameraDeviceId: undefined,
    userSelectedMicDeviceId: undefined,
    userSelectedAudioOutputDeviceLabel: undefined,
    userSelectedCameraDeviceLabel: undefined,
    userSelectedNotifications: {
        'notify.chatMessages': true
    },
    userSelectedMicDeviceLabel: undefined,
    userSelectedSkipPrejoin: undefined
};
const STORE_NAME = 'features/base/settings';
/**
 * Sets up the persistence of the feature {@code base/settings}.
 */
const filterSubtree = {};
// start with the default state
Object.keys(DEFAULT_STATE).forEach(key => {
    const key1 = key;
    // @ts-ignore
    filterSubtree[key1] = true;
});
// we want to filter these props, to not be stored as they represent
// what is currently opened/used as devices
// @ts-ignore
filterSubtree.audioOutputDeviceId = false;
filterSubtree.cameraDeviceId = false;
filterSubtree.micDeviceId = false;
PersistenceRegistry_1.default.register(STORE_NAME, filterSubtree, DEFAULT_STATE);
ReducerRegistry_1.default.register(STORE_NAME, (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            return _initSettings(state);
        case actionTypes_2.SETTINGS_UPDATED:
            return {
                ...state,
                ...action.settings
            };
    }
    return state;
});
/**
 * Inits the settings object based on what information we have available.
 * Info taken into consideration:
 *   - Old Settings.js style data.
 *
 * @private
 * @param {ISettingsState} featureState - The current state of the feature.
 * @returns {Object}
 */
function _initSettings(featureState) {
    let settings = featureState;
    // Old Settings.js values
    // FIXME: jibri uses old settings.js local storage values to set its display
    // name and email. Provide another way for jibri to set these values, update
    // jibri, and remove the old settings.js values.
    const savedDisplayName = js_utils_1.jitsiLocalStorage.getItem('displayname');
    const savedEmail = js_utils_1.jitsiLocalStorage.getItem('email');
    // The helper _.escape will convert null to an empty strings. The empty
    // string will be saved in settings. On app re-load, because an empty string
    // is a defined value, it will override any value found in local storage.
    // The workaround is sidestepping _.escape when the value is not set in
    // local storage.
    const displayName = savedDisplayName === null ? undefined : lodash_1.default.escape(savedDisplayName);
    const email = savedEmail === null ? undefined : lodash_1.default.escape(savedEmail);
    settings = (0, helpers_1.assignIfDefined)({
        displayName,
        email
    }, settings);
    return settings;
}
