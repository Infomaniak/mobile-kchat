"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const svg_1 = require("../../../base/icons/svg");
const DialogWithTabs_1 = __importDefault(require("../../../base/ui/components/web/DialogWithTabs"));
const functions_web_1 = require("../../../calendar-sync/functions.web");
const actions_web_1 = require("../../../device-selection/actions.web");
const AudioDevicesSelection_1 = __importDefault(require("../../../device-selection/components/AudioDevicesSelection"));
const VideoDeviceSelection_1 = __importDefault(require("../../../device-selection/components/VideoDeviceSelection"));
const functions_web_2 = require("../../../device-selection/functions.web");
const functions_1 = require("../../../virtual-background/functions");
const functions_2 = require("../../../visitors/functions");
const actions_1 = require("../../actions");
const constants_1 = require("../../constants");
const functions_3 = require("../../functions");
const CalendarTab_1 = __importDefault(require("./CalendarTab"));
const ModeratorTab_1 = __importDefault(require("./ModeratorTab"));
const MoreTab_1 = __importDefault(require("./MoreTab"));
const NotificationsTab_1 = __importDefault(require("./NotificationsTab"));
const ProfileTab_1 = __importDefault(require("./ProfileTab"));
const ShortcutsTab_1 = __importDefault(require("./ShortcutsTab"));
const VirtualBackgroundTab_1 = __importDefault(require("./VirtualBackgroundTab"));
const useStyles = (0, mui_1.makeStyles)()(() => {
    return {
        settingsDialog: {
            display: 'flex',
            width: '100%'
        }
    };
});
const SettingsDialog = ({ _tabs, defaultTab, dispatch }) => {
    const { classes } = useStyles();
    const correctDefaultTab = _tabs.find(tab => tab.name === defaultTab)?.name;
    const tabs = _tabs.map(tab => {
        return {
            ...tab,
            className: `settings-pane ${classes.settingsDialog}`,
            submit: (...args) => tab.submit
                && dispatch(tab.submit(...args))
        };
    });
    return (react_1.default.createElement(DialogWithTabs_1.default, { className: 'settings-dialog', defaultTab: correctDefaultTab, tabs: tabs, titleKey: 'settings.title' }));
};
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code ConnectedSettingsDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The props passed to the component.
 * @private
 * @returns {{
 *     tabs: Array<Object>
 * }}
 */
function _mapStateToProps(state, ownProps) {
    const { isDisplayedOnWelcomePage } = ownProps;
    const configuredTabs = interfaceConfig.SETTINGS_SECTIONS || [];
    // The settings sections to display.
    const showDeviceSettings = configuredTabs.includes('devices');
    const moreTabProps = (0, functions_3.getMoreTabProps)(state);
    const moderatorTabProps = (0, functions_3.getModeratorTabProps)(state);
    const { showModeratorSettings } = moderatorTabProps;
    const showMoreTab = configuredTabs.includes('more');
    const showProfileSettings = configuredTabs.includes('profile') && !state['features/base/config'].disableProfile;
    const showCalendarSettings = configuredTabs.includes('calendar') && (0, functions_web_1.isCalendarEnabled)(state);
    const showSoundsSettings = configuredTabs.includes('sounds');
    const enabledNotifications = (0, functions_3.getNotificationsMap)(state);
    const showNotificationsSettings = Object.keys(enabledNotifications).length > 0;
    const virtualBackgroundSupported = (0, functions_1.checkBlurSupport)();
    const enableVirtualBackground = (0, functions_1.checkVirtualBackgroundEnabled)(state);
    const tabs = [];
    const _iAmVisitor = (0, functions_2.iAmVisitor)(state);
    if (showDeviceSettings) {
        tabs.push({
            name: constants_1.SETTINGS_TABS.AUDIO,
            component: AudioDevicesSelection_1.default,
            labelKey: 'settings.audio',
            props: (0, functions_web_2.getAudioDeviceSelectionDialogProps)(state, isDisplayedOnWelcomePage),
            propsUpdateFunction: (tabState, newProps) => {
                // Ensure the device selection tab gets updated when new devices
                // are found by taking the new props and only preserving the
                // current user selected devices. If this were not done, the
                // tab would keep using a copy of the initial props it received,
                // leaving the device list to become stale.
                return {
                    ...newProps,
                    noiseSuppressionEnabled: tabState.noiseSuppressionEnabled,
                    selectedAudioInputId: tabState.selectedAudioInputId,
                    selectedAudioOutputId: tabState.selectedAudioOutputId
                };
            },
            submit: (newState) => (0, actions_web_1.submitAudioDeviceSelectionTab)(newState, isDisplayedOnWelcomePage),
            icon: svg_1.IconVolumeUp
        });
        !_iAmVisitor && tabs.push({
            name: constants_1.SETTINGS_TABS.VIDEO,
            component: VideoDeviceSelection_1.default,
            labelKey: 'settings.video',
            props: (0, functions_web_2.getVideoDeviceSelectionDialogProps)(state, isDisplayedOnWelcomePage),
            propsUpdateFunction: (tabState, newProps) => {
                // Ensure the device selection tab gets updated when new devices
                // are found by taking the new props and only preserving the
                // current user selected devices. If this were not done, the
                // tab would keep using a copy of the initial props it received,
                // leaving the device list to become stale.
                return {
                    ...newProps,
                    currentFramerate: tabState?.currentFramerate,
                    localFlipX: tabState.localFlipX,
                    selectedVideoInputId: tabState.selectedVideoInputId
                };
            },
            submit: (newState) => (0, actions_web_1.submitVideoDeviceSelectionTab)(newState, isDisplayedOnWelcomePage),
            icon: svg_1.IconVideo
        });
    }
    if (virtualBackgroundSupported && !_iAmVisitor && enableVirtualBackground) {
        tabs.push({
            name: constants_1.SETTINGS_TABS.VIRTUAL_BACKGROUND,
            component: VirtualBackgroundTab_1.default,
            labelKey: 'virtualBackground.title',
            props: (0, functions_3.getVirtualBackgroundTabProps)(state, isDisplayedOnWelcomePage),
            propsUpdateFunction: (tabState, newProps, tabStates) => {
                const videoTabState = tabStates[tabs.findIndex(tab => tab.name === constants_1.SETTINGS_TABS.VIDEO)];
                return {
                    ...newProps,
                    selectedVideoInputId: videoTabState?.selectedVideoInputId || newProps.selectedVideoInputId,
                    options: tabState.options
                };
            },
            submit: (newState) => (0, actions_1.submitVirtualBackgroundTab)(newState),
            cancel: () => {
                const { options } = (0, functions_3.getVirtualBackgroundTabProps)(state, isDisplayedOnWelcomePage);
                return (0, actions_1.submitVirtualBackgroundTab)({ options }, true);
            },
            icon: svg_1.IconImage
        });
    }
    if ((showSoundsSettings || showNotificationsSettings) && !_iAmVisitor) {
        tabs.push({
            name: constants_1.SETTINGS_TABS.NOTIFICATIONS,
            component: NotificationsTab_1.default,
            labelKey: 'settings.notifications',
            propsUpdateFunction: (tabState, newProps) => {
                return {
                    ...newProps,
                    enabledNotifications: tabState?.enabledNotifications || {},
                    soundsIncomingMessage: tabState?.soundsIncomingMessage,
                    soundsParticipantJoined: tabState?.soundsParticipantJoined,
                    soundsParticipantKnocking: tabState?.soundsParticipantKnocking,
                    soundsParticipantLeft: tabState?.soundsParticipantLeft,
                    soundsReactions: tabState?.soundsReactions,
                    soundsTalkWhileMuted: tabState?.soundsTalkWhileMuted
                };
            },
            props: (0, functions_3.getNotificationsTabProps)(state, showSoundsSettings),
            submit: actions_1.submitNotificationsTab,
            icon: svg_1.IconBell
        });
    }
    if (showModeratorSettings && !_iAmVisitor) {
        tabs.push({
            name: constants_1.SETTINGS_TABS.MODERATOR,
            component: ModeratorTab_1.default,
            labelKey: 'settings.moderator',
            props: moderatorTabProps,
            propsUpdateFunction: (tabState, newProps) => {
                // Updates tab props, keeping users selection
                return {
                    ...newProps,
                    followMeEnabled: tabState?.followMeEnabled,
                    startAudioMuted: tabState?.startAudioMuted,
                    startVideoMuted: tabState?.startVideoMuted,
                    startReactionsMuted: tabState?.startReactionsMuted
                };
            },
            submit: actions_1.submitModeratorTab,
            icon: svg_1.IconModerator
        });
    }
    if (showProfileSettings) {
        tabs.push({
            name: constants_1.SETTINGS_TABS.PROFILE,
            component: ProfileTab_1.default,
            labelKey: 'profile.title',
            props: (0, functions_3.getProfileTabProps)(state),
            submit: actions_1.submitProfileTab,
            icon: svg_1.IconUser
        });
    }
    if (showCalendarSettings && !_iAmVisitor) {
        tabs.push({
            name: constants_1.SETTINGS_TABS.CALENDAR,
            component: CalendarTab_1.default,
            labelKey: 'settings.calendar.title',
            icon: svg_1.IconCalendar
        });
    }
    !_iAmVisitor && tabs.push({
        name: constants_1.SETTINGS_TABS.SHORTCUTS,
        component: ShortcutsTab_1.default,
        labelKey: 'settings.shortcuts',
        props: (0, functions_3.getShortcutsTabProps)(state, isDisplayedOnWelcomePage),
        propsUpdateFunction: (tabState, newProps) => {
            // Updates tab props, keeping users selection
            return {
                ...newProps,
                keyboardShortcutsEnabled: tabState?.keyboardShortcutsEnabled
            };
        },
        submit: actions_1.submitShortcutsTab,
        icon: svg_1.IconShortcuts
    });
    if (showMoreTab && !_iAmVisitor) {
        tabs.push({
            name: constants_1.SETTINGS_TABS.MORE,
            component: MoreTab_1.default,
            labelKey: 'settings.more',
            props: moreTabProps,
            propsUpdateFunction: (tabState, newProps) => {
                // Updates tab props, keeping users selection
                return {
                    ...newProps,
                    currentLanguage: tabState?.currentLanguage,
                    hideSelfView: tabState?.hideSelfView,
                    showPrejoinPage: tabState?.showPrejoinPage,
                    maxStageParticipants: tabState?.maxStageParticipants
                };
            },
            submit: actions_1.submitMoreTab,
            icon: svg_1.IconGear
        });
    }
    return { _tabs: tabs };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(SettingsDialog);
