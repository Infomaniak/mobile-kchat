"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsNavigationContainerScreenOptions = exports.lobbyNavigationContainerScreenOptions = exports.conferenceNavigationContainerScreenOptions = exports.unsafeMeetingScreenOptions = exports.languageSelectScreenOptions = exports.profileSettingsScreenOptions = exports.preJoinScreenOptions = exports.whiteboardScreenOptions = exports.connectingScreenOptions = exports.settingsScreenOptions = exports.sharedDocumentScreenOptions = exports.gifsMenuOptions = exports.salesforceScreenOptions = exports.lobbyChatScreenOptions = exports.lobbyScreenOptions = exports.subtitlesScreenOptions = exports.recordingScreenOptions = exports.securityScreenOptions = exports.speakerStatsScreenOptions = exports.participantsScreenOptions = exports.liveStreamScreenOptions = exports.inviteScreenOptions = exports.dialInSummaryScreenOptions = exports.chatScreenOptions = exports.carmodeScreenOptions = exports.breakoutRoomsScreenOptions = exports.presentationScreenOptions = exports.chatTabBarOptions = exports.conferenceScreenOptions = exports.welcomeScreenOptions = exports.navigationContainerTheme = exports.fullScreenOptions = exports.modalPresentation = void 0;
const stack_1 = require("@react-navigation/stack");
const react_native_1 = require("react-native");
const BaseTheme_native_1 = __importDefault(require("../../base/ui/components/BaseTheme.native"));
const ConferenceNavigationContainerRef_1 = require("./components/conference/ConferenceNavigationContainerRef");
const LobbyNavigationContainerRef_1 = require("./components/lobby/LobbyNavigationContainerRef");
const functions_1 = require("./functions");
const rootNavigationContainerRef_1 = require("./rootNavigationContainerRef");
/**
 * Default modal transition for the current platform.
 */
exports.modalPresentation = react_native_1.Platform.select({
    ios: stack_1.TransitionPresets.ModalPresentationIOS,
    default: stack_1.TransitionPresets.DefaultTransition
});
/**
 * Screen options and transition types.
 */
exports.fullScreenOptions = {
    ...stack_1.TransitionPresets.ModalTransition,
    gestureEnabled: false,
    headerShown: false
};
/**
 * Navigation container theme.
 */
exports.navigationContainerTheme = {
    colors: {
        background: BaseTheme_native_1.default.palette.uiBackground
    }
};
/**
 * Screen options for welcome page.
 */
exports.welcomeScreenOptions = {
    ...stack_1.TransitionPresets.ModalTransition,
    gestureEnabled: false,
    headerShown: true,
    headerStyle: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01
    },
    headerTitleStyle: {
        color: BaseTheme_native_1.default.palette.text01
    }
};
/**
 * Screen options for conference.
 */
exports.conferenceScreenOptions = exports.fullScreenOptions;
/**
 * Tab bar options for chat screen.
 */
exports.chatTabBarOptions = {
    swipeEnabled: false,
    tabBarIndicatorStyle: {
        backgroundColor: BaseTheme_native_1.default.palette.link01Active
    },
    tabBarStyle: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        borderBottomColor: BaseTheme_native_1.default.palette.ui06,
        borderBottomWidth: 0.4
    }
};
/**
 * Screen options for presentation type modals.
 */
exports.presentationScreenOptions = {
    ...exports.modalPresentation,
    headerBackTitleVisible: false,
    headerLeft: () => (0, functions_1.screenHeaderCloseButton)(ConferenceNavigationContainerRef_1.goBack),
    headerStatusBarHeight: 0,
    headerStyle: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01
    },
    headerTitleStyle: {
        color: BaseTheme_native_1.default.palette.text01
    }
};
/**
 * Screen options for breakout rooms screen.
 */
exports.breakoutRoomsScreenOptions = exports.presentationScreenOptions;
/**
 * Screen options for car mode.
 */
exports.carmodeScreenOptions = exports.presentationScreenOptions;
/**
 * Screen options for chat.
 */
exports.chatScreenOptions = exports.presentationScreenOptions;
/**
 * Dial-IN Info screen options and transition types.
 */
exports.dialInSummaryScreenOptions = {
    ...exports.presentationScreenOptions,
    headerLeft: () => (0, functions_1.screenHeaderCloseButton)(rootNavigationContainerRef_1.goBack)
};
/**
 * Screen options for invite modal.
 */
exports.inviteScreenOptions = exports.presentationScreenOptions;
/**
 * Screen options for live stream modal.
 */
exports.liveStreamScreenOptions = exports.presentationScreenOptions;
/**
 * Screen options for participants modal.
 */
exports.participantsScreenOptions = exports.presentationScreenOptions;
/**
 * Screen options for speaker stats modal.
 */
exports.speakerStatsScreenOptions = exports.presentationScreenOptions;
/**
 * Screen options for security options modal.
 */
exports.securityScreenOptions = exports.presentationScreenOptions;
/**
 * Screen options for recording modal.
 */
exports.recordingScreenOptions = exports.presentationScreenOptions;
/**
 * Screen options for subtitles modal.
 */
exports.subtitlesScreenOptions = exports.presentationScreenOptions;
/**
 * Screen options for lobby modal.
 */
exports.lobbyScreenOptions = {
    ...exports.presentationScreenOptions,
    headerLeft: () => (0, functions_1.lobbyScreenHeaderCloseButton)()
};
/**
 * Screen options for lobby chat modal.
 */
exports.lobbyChatScreenOptions = {
    ...exports.presentationScreenOptions,
    headerLeft: () => (0, functions_1.screenHeaderCloseButton)(LobbyNavigationContainerRef_1.goBack)
};
/**
 * Screen options for salesforce link modal.
 */
exports.salesforceScreenOptions = exports.presentationScreenOptions;
/**
 * Screen options for GIPHY integration modal.
 */
exports.gifsMenuOptions = exports.presentationScreenOptions;
/**
 * Screen options for shared document.
 */
exports.sharedDocumentScreenOptions = exports.presentationScreenOptions;
/**
 * Screen options for settings modal.
 */
exports.settingsScreenOptions = exports.presentationScreenOptions;
/**
 * Screen options for connecting screen.
 */
exports.connectingScreenOptions = {
    gestureEnabled: false,
    headerShown: false
};
/**
 * Screen options for the whiteboard screen.
 */
exports.whiteboardScreenOptions = exports.presentationScreenOptions;
/**
 * Screen options for pre-join screen.
 */
exports.preJoinScreenOptions = {
    gestureEnabled: false,
    headerStyle: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01
    },
    headerTitleStyle: {
        color: BaseTheme_native_1.default.palette.text01
    }
};
/**
 * Screen options for profile setting.
 */
exports.profileSettingsScreenOptions = {
    headerStyle: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01
    },
    headerTitleStyle: {
        color: BaseTheme_native_1.default.palette.text01
    },
    headerBackTitleVisible: false
};
/**
 * Screen options for language select screen.
 */
exports.languageSelectScreenOptions = exports.profileSettingsScreenOptions;
/**
 * Screen options for pre-join screen.
 */
exports.unsafeMeetingScreenOptions = exports.preJoinScreenOptions;
/**
 * Screen options for conference navigation container screen.
 */
exports.conferenceNavigationContainerScreenOptions = {
    gestureEnabled: false,
    headerShown: false
};
/**
 * Screen options for lobby navigation container screen.
 */
exports.lobbyNavigationContainerScreenOptions = {
    gestureEnabled: false,
    headerShown: false
};
/**
 * Screen options for settings navigation container screen.
 */
exports.settingsNavigationContainerScreenOptions = {
    ...exports.modalPresentation,
    gestureEnabled: true,
    headerShown: false
};
