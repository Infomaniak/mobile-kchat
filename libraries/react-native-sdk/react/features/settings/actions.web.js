"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitVirtualBackgroundTab = exports.submitShortcutsTab = exports.toggleVideoSettings = exports.toggleAudioSettings = exports.submitNotificationsTab = exports.submitProfileTab = exports.submitModeratorTab = exports.submitMoreTab = exports.openSettingsDialog = exports.openLogoutDialog = void 0;
const react_redux_1 = require("react-redux");
const actions_web_1 = require("../authentication/actions.web");
const functions_1 = require("../authentication/functions");
const actions_1 = require("../base/conference/actions");
const actions_web_2 = require("../base/connection/actions.web");
const actions_2 = require("../base/dialog/actions");
const i18next_1 = __importDefault(require("../base/i18n/i18next"));
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const functions_2 = require("../base/participants/functions");
const actions_3 = require("../base/settings/actions");
const functions_web_1 = require("../base/tracks/functions.web");
const uri_1 = require("../base/util/uri");
const actions_web_3 = require("../keyboard-shortcuts/actions.web");
const actions_4 = require("../virtual-background/actions");
const logger_1 = __importDefault(require("../virtual-background/logger"));
const actionTypes_1 = require("./actionTypes");
const LogoutDialog_1 = __importDefault(require("./components/web/LogoutDialog"));
const SettingsDialog_1 = __importDefault(require("./components/web/SettingsDialog"));
const functions_web_2 = require("./functions.web");
/**
 * Opens {@code LogoutDialog}.
 *
 * @returns {Function}
 */
function openLogoutDialog() {
    return (dispatch, getState) => {
        const state = getState();
        const config = state['features/base/config'];
        const logoutUrl = config.tokenLogoutUrl;
        const { conference } = state['features/base/conference'];
        const { jwt } = state['features/base/jwt'];
        dispatch((0, actions_2.openDialog)(LogoutDialog_1.default, {
            onLogout() {
                if ((0, functions_1.isTokenAuthEnabled)(config) && config.tokenAuthUrlAutoRedirect && jwt) {
                    // user is logging out remove auto redirect indication
                    dispatch((0, actions_web_1.setTokenAuthUrlSuccess)(false));
                }
                if (logoutUrl && lib_jitsi_meet_1.browser.isElectron()) {
                    const url = (0, uri_1.appendURLHashParam)(logoutUrl, 'electron', 'true');
                    window.open(url, '_blank');
                    dispatch((0, actions_web_2.hangup)(true));
                }
                else {
                    if (logoutUrl) {
                        window.location.href = logoutUrl;
                        return;
                    }
                    conference?.room.xmpp.moderator.logout(() => dispatch((0, actions_web_2.hangup)(true)));
                }
            }
        }));
    };
}
exports.openLogoutDialog = openLogoutDialog;
/**
 * Opens {@code SettingsDialog}.
 *
 * @param {string} defaultTab - The tab in {@code SettingsDialog} that should be
 * displayed initially.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the device selection dialog is displayed on the
 * welcome page or not.
 * @returns {Function}
 */
function openSettingsDialog(defaultTab, isDisplayedOnWelcomePage) {
    return (0, actions_2.openDialog)(SettingsDialog_1.default, {
        defaultTab,
        isDisplayedOnWelcomePage
    });
}
exports.openSettingsDialog = openSettingsDialog;
/**
 * Sets the visibility of the audio settings.
 *
 * @param {boolean} value - The new value.
 * @returns {Function}
 */
function setAudioSettingsVisibility(value) {
    return {
        type: actionTypes_1.SET_AUDIO_SETTINGS_VISIBILITY,
        value
    };
}
/**
 * Sets the visibility of the video settings.
 *
 * @param {boolean} value - The new value.
 * @returns {Function}
 */
function setVideoSettingsVisibility(value) {
    return {
        type: actionTypes_1.SET_VIDEO_SETTINGS_VISIBILITY,
        value
    };
}
/**
 * Submits the settings from the "More" tab of the settings dialog.
 *
 * @param {Object} newState - The new settings.
 * @returns {Function}
 */
function submitMoreTab(newState) {
    return (dispatch, getState) => {
        const currentState = (0, functions_web_2.getMoreTabProps)(getState());
        const showPrejoinPage = newState.showPrejoinPage;
        if (showPrejoinPage !== currentState.showPrejoinPage) {
            dispatch((0, actions_3.updateSettings)({
                userSelectedSkipPrejoin: !showPrejoinPage
            }));
        }
        if (newState.maxStageParticipants !== currentState.maxStageParticipants) {
            dispatch((0, actions_3.updateSettings)({ maxStageParticipants: Number(newState.maxStageParticipants) }));
        }
        if (newState.hideSelfView !== currentState.hideSelfView) {
            dispatch((0, actions_3.updateSettings)({ disableSelfView: newState.hideSelfView }));
        }
        if (newState.currentLanguage !== currentState.currentLanguage) {
            i18next_1.default.changeLanguage(newState.currentLanguage);
        }
    };
}
exports.submitMoreTab = submitMoreTab;
/**
 * Submits the settings from the "Moderator" tab of the settings dialog.
 *
 * @param {Object} newState - The new settings.
 * @returns {Function}
 */
function submitModeratorTab(newState) {
    return (dispatch, getState) => {
        const currentState = (0, functions_web_2.getModeratorTabProps)(getState());
        if (newState.followMeEnabled !== currentState.followMeEnabled) {
            dispatch((0, actions_1.setFollowMe)(newState.followMeEnabled));
        }
        if (newState.startReactionsMuted !== currentState.startReactionsMuted) {
            (0, react_redux_1.batch)(() => {
                // updating settings we want to update and backend (notify the rest of the participants)
                dispatch((0, actions_1.setStartReactionsMuted)(newState.startReactionsMuted, true));
                dispatch((0, actions_3.updateSettings)({ soundsReactions: !newState.startReactionsMuted }));
            });
        }
        if (newState.startAudioMuted !== currentState.startAudioMuted
            || newState.startVideoMuted !== currentState.startVideoMuted) {
            dispatch((0, actions_1.setStartMutedPolicy)(newState.startAudioMuted, newState.startVideoMuted));
        }
    };
}
exports.submitModeratorTab = submitModeratorTab;
/**
 * Submits the settings from the "Profile" tab of the settings dialog.
 *
 * @param {Object} newState - The new settings.
 * @returns {Function}
 */
function submitProfileTab(newState) {
    return (dispatch, getState) => {
        const currentState = (0, functions_web_2.getProfileTabProps)(getState());
        if (newState.displayName !== currentState.displayName) {
            dispatch((0, actions_3.updateSettings)({ displayName: (0, functions_2.getNormalizedDisplayName)(newState.displayName) }));
        }
        if (newState.email !== currentState.email) {
            APP.conference.changeLocalEmail(newState.email);
        }
    };
}
exports.submitProfileTab = submitProfileTab;
/**
 * Submits the settings from the "Sounds" tab of the settings dialog.
 *
 * @param {Object} newState - The new settings.
 * @returns {Function}
 */
function submitNotificationsTab(newState) {
    return (dispatch, getState) => {
        const currentState = (0, functions_web_2.getNotificationsTabProps)(getState());
        const shouldNotUpdateReactionSounds = (0, functions_web_2.getModeratorTabProps)(getState()).startReactionsMuted;
        const shouldUpdate = (newState.soundsIncomingMessage !== currentState.soundsIncomingMessage)
            || (newState.soundsParticipantJoined !== currentState.soundsParticipantJoined)
            || (newState.soundsParticipantKnocking !== currentState.soundsParticipantKnocking)
            || (newState.soundsParticipantLeft !== currentState.soundsParticipantLeft)
            || (newState.soundsTalkWhileMuted !== currentState.soundsTalkWhileMuted)
            || (newState.soundsReactions !== currentState.soundsReactions);
        if (shouldUpdate) {
            const settingsToUpdate = {
                soundsIncomingMessage: newState.soundsIncomingMessage,
                soundsParticipantJoined: newState.soundsParticipantJoined,
                soundsParticipantKnocking: newState.soundsParticipantKnocking,
                soundsParticipantLeft: newState.soundsParticipantLeft,
                soundsTalkWhileMuted: newState.soundsTalkWhileMuted,
                soundsReactions: newState.soundsReactions
            };
            if (shouldNotUpdateReactionSounds) {
                delete settingsToUpdate.soundsReactions;
            }
            dispatch((0, actions_3.updateSettings)(settingsToUpdate));
        }
        const enabledNotifications = newState.enabledNotifications;
        if (enabledNotifications !== currentState.enabledNotifications) {
            dispatch((0, actions_3.updateSettings)({
                userSelectedNotifications: {
                    ...getState()['features/base/settings'].userSelectedNotifications,
                    ...enabledNotifications
                }
            }));
        }
    };
}
exports.submitNotificationsTab = submitNotificationsTab;
/**
 * Toggles the visibility of the audio settings.
 *
 * @returns {void}
 */
function toggleAudioSettings() {
    return (dispatch, getState) => {
        const value = getState()['features/settings'].audioSettingsVisible;
        dispatch(setAudioSettingsVisibility(!value));
    };
}
exports.toggleAudioSettings = toggleAudioSettings;
/**
 * Toggles the visibility of the video settings.
 *
 * @returns {void}
 */
function toggleVideoSettings() {
    return (dispatch, getState) => {
        const value = getState()['features/settings'].videoSettingsVisible;
        dispatch(setVideoSettingsVisibility(!value));
    };
}
exports.toggleVideoSettings = toggleVideoSettings;
/**
 * Submits the settings from the "Shortcuts" tab of the settings dialog.
 *
 * @param {Object} newState - The new settings.
 * @returns {Function}
 */
function submitShortcutsTab(newState) {
    return (dispatch, getState) => {
        const currentState = (0, functions_web_2.getShortcutsTabProps)(getState());
        if (newState.keyboardShortcutsEnabled !== currentState.keyboardShortcutsEnabled) {
            if (newState.keyboardShortcutsEnabled) {
                dispatch((0, actions_web_3.enableKeyboardShortcuts)());
            }
            else {
                dispatch((0, actions_web_3.disableKeyboardShortcuts)());
            }
        }
    };
}
exports.submitShortcutsTab = submitShortcutsTab;
/**
 * Submits the settings from the "Virtual Background" tab of the settings dialog.
 *
 * @param {Object} newState - The new settings.
 * @param {boolean} isCancel - Whether the change represents a cancel.
 * @returns {Function}
 */
function submitVirtualBackgroundTab(newState, isCancel = false) {
    return async (dispatch, getState) => {
        const state = getState();
        const track = (0, functions_web_1.getLocalVideoTrack)(state['features/base/tracks'])?.jitsiTrack;
        if (newState.options?.selectedThumbnail) {
            await dispatch((0, actions_4.toggleBackgroundEffect)(newState.options, track));
            if (!isCancel) {
                // Set x scale to default value.
                dispatch((0, actions_3.updateSettings)({
                    localFlipX: true
                }));
                logger_1.default.info(`Virtual background type: '${typeof newState.options.backgroundType === 'undefined'
                    ? 'none' : newState.options.backgroundType}' applied!`);
            }
        }
    };
}
exports.submitVirtualBackgroundTab = submitVirtualBackgroundTab;
