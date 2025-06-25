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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoSettingsVisibility = exports.getAudioSettingsVisibility = exports.getNotificationsTabProps = exports.getProfileTabProps = exports.getModeratorTabProps = exports.getMoreTabProps = exports.getNotificationsMap = exports.normalizeUserInputURL = exports.isServerURLChangeEnabled = void 0;
const functions_any_1 = require("../base/config/functions.any");
const constants_1 = require("../base/flags/constants");
const functions_1 = require("../base/flags/functions");
const i18next_1 = __importStar(require("../base/i18n/i18next"));
const functions_2 = require("../base/participants/functions");
const functions_3 = require("../base/redux/functions");
const functions_any_2 = require("../base/settings/functions.any");
const uri_1 = require("../base/util/uri");
const functions_4 = require("../filmstrip/functions");
const functions_5 = require("../follow-me/functions");
const functions_6 = require("../prejoin/functions");
const functions_any_3 = require("../reactions/functions.any");
const functions_7 = require("../visitors/functions");
const functions_8 = require("./functions");
/**
 * Returns true if user is allowed to change Server URL.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {boolean} True to indicate that user can change Server URL, false otherwise.
 */
function isServerURLChangeEnabled(stateful) {
    const state = (0, functions_3.toState)(stateful);
    return (0, functions_1.getFeatureFlag)(state, constants_1.SERVER_URL_CHANGE_ENABLED, true);
}
exports.isServerURLChangeEnabled = isServerURLChangeEnabled;
/**
 * Normalizes a URL entered by the user.
 * FIXME: Consider adding this to base/util/uri.
 *
 * @param {string} url - The URL to validate.
 * @returns {string|null} - The normalized URL, or null if the URL is invalid.
 */
function normalizeUserInputURL(url) {
    /* eslint-disable no-param-reassign */
    if (url) {
        url = url.replace(/\s/g, '').toLowerCase();
        const urlRegExp = new RegExp('^(\\w+://)?(.+)$');
        const urlComponents = urlRegExp.exec(url);
        if (urlComponents && !urlComponents[1]?.startsWith('http')) {
            url = `https://${urlComponents[2]}`;
        }
        const parsedURI = (0, uri_1.parseStandardURIString)(url);
        if (!parsedURI.host) {
            return null;
        }
        return parsedURI.toString();
    }
    return url;
    /* eslint-enable no-param-reassign */
}
exports.normalizeUserInputURL = normalizeUserInputURL;
/**
 * Returns the notification types and their user selected configuration.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {Object} - The section of notifications to be configured.
 */
function getNotificationsMap(stateful) {
    const state = (0, functions_3.toState)(stateful);
    const { notifications } = state['features/base/config'];
    const { userSelectedNotifications } = state['features/base/settings'];
    if (!userSelectedNotifications) {
        return {};
    }
    return Object.keys(userSelectedNotifications)
        .filter(key => !notifications || notifications.includes(key))
        .reduce((notificationsMap, key) => {
        return {
            ...notificationsMap,
            [key]: userSelectedNotifications[key]
        };
    }, {});
}
exports.getNotificationsMap = getNotificationsMap;
/**
 * Returns the properties for the "More" tab from settings dialog from Redux
 * state.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {Object} - The properties for the "More" tab from settings dialog.
 */
function getMoreTabProps(stateful) {
    const state = (0, functions_3.toState)(stateful);
    const stageFilmstripEnabled = (0, functions_4.isStageFilmstripEnabled)(state);
    const language = i18next_1.default.language || i18next_1.DEFAULT_LANGUAGE;
    const configuredTabs = interfaceConfig.SETTINGS_SECTIONS || [];
    // when self view is controlled by the config we hide the settings
    const { disableSelfView, disableSelfViewSettings } = state['features/base/config'];
    return {
        currentLanguage: language,
        disableHideSelfView: disableSelfViewSettings || disableSelfView,
        hideSelfView: (0, functions_any_2.getHideSelfView)(state),
        iAmVisitor: (0, functions_7.iAmVisitor)(state),
        languages: i18next_1.LANGUAGES,
        maxStageParticipants: state['features/base/settings'].maxStageParticipants,
        showLanguageSettings: configuredTabs.includes('language'),
        showPrejoinPage: !state['features/base/settings'].userSelectedSkipPrejoin,
        showPrejoinSettings: (0, functions_6.isPrejoinEnabledInConfig)(state),
        stageFilmstripEnabled
    };
}
exports.getMoreTabProps = getMoreTabProps;
/**
 * Returns the properties for the "More" tab from settings dialog from Redux
 * state.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {Object} - The properties for the "More" tab from settings dialog.
 */
function getModeratorTabProps(stateful) {
    const state = (0, functions_3.toState)(stateful);
    const { conference, followMeEnabled, startAudioMutedPolicy, startVideoMutedPolicy, startReactionsMuted } = state['features/base/conference'];
    const { disableReactionsModeration } = state['features/base/config'];
    const followMeActive = (0, functions_5.isFollowMeActive)(state);
    const showModeratorSettings = (0, functions_8.shouldShowModeratorSettings)(state);
    // The settings sections to display.
    return {
        showModeratorSettings: Boolean(conference && showModeratorSettings),
        disableReactionsModeration: Boolean(disableReactionsModeration),
        followMeActive: Boolean(conference && followMeActive),
        followMeEnabled: Boolean(conference && followMeEnabled),
        startReactionsMuted: Boolean(conference && startReactionsMuted),
        startAudioMuted: Boolean(conference && startAudioMutedPolicy),
        startVideoMuted: Boolean(conference && startVideoMutedPolicy)
    };
}
exports.getModeratorTabProps = getModeratorTabProps;
/**
 * Returns the properties for the "Profile" tab from settings dialog from Redux
 * state.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {Object} - The properties for the "Profile" tab from settings
 * dialog.
 */
function getProfileTabProps(stateful) {
    const state = (0, functions_3.toState)(stateful);
    const { authEnabled, authLogin, conference } = state['features/base/conference'];
    const config = state['features/base/config'];
    let { hideEmailInSettings } = config;
    const localParticipant = (0, functions_2.getLocalParticipant)(state);
    if (config.gravatar?.disabled
        || (localParticipant?.avatarURL && localParticipant?.avatarURL.length > 0)) {
        hideEmailInSettings = true;
    }
    return {
        authEnabled: Boolean(conference && authEnabled),
        authLogin,
        displayName: localParticipant?.name,
        email: localParticipant?.email,
        hideEmailInSettings,
        id: localParticipant?.id,
        readOnlyName: (0, functions_any_1.isNameReadOnly)(state)
    };
}
exports.getProfileTabProps = getProfileTabProps;
/**
 * Returns the properties for the "Sounds" tab from settings dialog from Redux
 * state.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {boolean} showSoundsSettings - Whether to show the sound settings or not.
 * @returns {Object} - The properties for the "Sounds" tab from settings
 * dialog.
 */
function getNotificationsTabProps(stateful, showSoundsSettings) {
    const state = (0, functions_3.toState)(stateful);
    const { soundsIncomingMessage, soundsParticipantJoined, soundsParticipantKnocking, soundsParticipantLeft, soundsTalkWhileMuted, soundsReactions } = state['features/base/settings'];
    const enableReactions = (0, functions_any_3.isReactionsEnabled)(state);
    const moderatorMutedSoundsReactions = state['features/base/conference'].startReactionsMuted ?? false;
    const enabledNotifications = getNotificationsMap(stateful);
    return {
        disabledSounds: state['features/base/config'].disabledSounds || [],
        enabledNotifications,
        showNotificationsSettings: Object.keys(enabledNotifications).length > 0,
        soundsIncomingMessage,
        soundsParticipantJoined,
        soundsParticipantKnocking,
        soundsParticipantLeft,
        soundsTalkWhileMuted,
        soundsReactions,
        enableReactions,
        moderatorMutedSoundsReactions,
        showSoundsSettings
    };
}
exports.getNotificationsTabProps = getNotificationsTabProps;
/**
 * Returns the visibility state of the audio settings.
 *
 * @param {Object} state - The state of the application.
 * @returns {boolean}
 */
function getAudioSettingsVisibility(state) {
    return state['features/settings'].audioSettingsVisible;
}
exports.getAudioSettingsVisibility = getAudioSettingsVisibility;
/**
 * Returns the visibility state of the video settings.
 *
 * @param {Object} state - The state of the application.
 * @returns {boolean}
 */
function getVideoSettingsVisibility(state) {
    return state['features/settings'].videoSettingsVisible;
}
exports.getVideoSettingsVisibility = getVideoSettingsVisibility;
