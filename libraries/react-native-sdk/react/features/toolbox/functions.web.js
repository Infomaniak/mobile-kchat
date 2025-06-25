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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParticipantMenuButtonsWithNotifyClick = exports.getAllToolboxButtons = exports.getToolbarTimeout = exports.isToolboxEnabled = exports.showOverflowMenu = exports.showOverflowDrawer = exports.isVideoMuteButtonDisabled = exports.isVideoSettingsButtonDisabled = exports.isDesktopShareButtonDisabled = exports.isAudioSettingsButtonDisabled = exports.isToolboxVisible = exports.isButtonEnabled = exports.getToolboxHeight = void 0;
const functions_1 = require("../base/devices/functions");
const constants_1 = require("../base/jwt/constants");
const functions_2 = require("../base/jwt/functions");
const types_1 = require("../base/media/types");
const ChatButton_1 = __importDefault(require("../chat/components/web/ChatButton"));
const EmbedMeetingButton_1 = __importDefault(require("../embed-meeting/components/EmbedMeetingButton"));
const SharedDocumentButton_web_1 = __importDefault(require("../etherpad/components/SharedDocumentButton.web"));
const FeedbackButton_web_1 = __importDefault(require("../feedback/components/FeedbackButton.web"));
const InviteButton_1 = __importDefault(require("../invite/components/add-people-dialog/web/InviteButton"));
const KeyboardShortcutsButton_1 = __importDefault(require("../keyboard-shortcuts/components/web/KeyboardShortcutsButton"));
const NoiseSuppressionButton_1 = __importDefault(require("../noise-suppression/components/NoiseSuppressionButton"));
const ParticipantsPaneButton_1 = __importDefault(require("../participants-pane/components/web/ParticipantsPaneButton"));
const RaiseHandContainerButtons_1 = __importDefault(require("../reactions/components/web/RaiseHandContainerButtons"));
const ReactionsMenuButton_1 = __importDefault(require("../reactions/components/web/ReactionsMenuButton"));
const LiveStreamButton_1 = __importDefault(require("../recording/components/LiveStream/web/LiveStreamButton"));
const RecordButton_1 = __importDefault(require("../recording/components/Recording/web/RecordButton"));
const ShareAudioButton_1 = __importDefault(require("../screen-share/components/web/ShareAudioButton"));
const functions_3 = require("../screen-share/functions");
const SecurityDialogButton_1 = __importDefault(require("../security/components/security-dialog/web/SecurityDialogButton"));
const SettingsButton_1 = __importDefault(require("../settings/components/web/SettingsButton"));
const SharedVideoButton_1 = __importDefault(require("../shared-video/components/web/SharedVideoButton"));
const SpeakerStatsButton_1 = __importDefault(require("../speaker-stats/components/web/SpeakerStatsButton"));
const ClosedCaptionButton_1 = __importDefault(require("../subtitles/components/web/ClosedCaptionButton"));
const TileViewButton_1 = __importDefault(require("../video-layout/components/TileViewButton"));
const VideoQualityButton_web_1 = __importDefault(require("../video-quality/components/VideoQualityButton.web"));
const VideoBackgroundButton_1 = __importDefault(require("../virtual-background/components/VideoBackgroundButton"));
const WhiteboardButton_1 = __importDefault(require("../whiteboard/components/web/WhiteboardButton"));
const functions_4 = require("../whiteboard/functions");
const DownloadButton_1 = __importDefault(require("./components/DownloadButton"));
const HelpButton_1 = __importDefault(require("./components/HelpButton"));
const AudioSettingsButton_1 = __importDefault(require("./components/web/AudioSettingsButton"));
const CustomOptionButton_1 = __importDefault(require("./components/web/CustomOptionButton"));
const FullscreenButton_1 = __importDefault(require("./components/web/FullscreenButton"));
const LinkToSalesforceButton_1 = __importDefault(require("./components/web/LinkToSalesforceButton"));
const ProfileButton_1 = __importDefault(require("./components/web/ProfileButton"));
const ShareDesktopButton_1 = __importDefault(require("./components/web/ShareDesktopButton"));
const ToggleCameraButton_1 = __importDefault(require("./components/web/ToggleCameraButton"));
const VideoSettingsButton_1 = __importDefault(require("./components/web/VideoSettingsButton"));
const constants_2 = require("./constants");
__exportStar(require("./functions.any"), exports);
/**
 * Helper for getting the height of the toolbox.
 *
 * @returns {number} The height of the toolbox.
 */
function getToolboxHeight() {
    const toolbox = document.getElementById('new-toolbox');
    return toolbox?.clientHeight || 0;
}
exports.getToolboxHeight = getToolboxHeight;
/**
 * Checks if the specified button is enabled.
 *
 * @param {string} buttonName - The name of the button. See {@link interfaceConfig}.
 * @param {Object|Array<string>} state - The redux state or the array with the enabled buttons.
 * @returns {boolean} - True if the button is enabled and false otherwise.
 */
function isButtonEnabled(buttonName, state) {
    const buttons = Array.isArray(state) ? state : state['features/toolbox'].toolbarButtons || [];
    return buttons.includes(buttonName);
}
exports.isButtonEnabled = isButtonEnabled;
/**
 * Indicates if the toolbox is visible or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean} - True to indicate that the toolbox is visible, false -
 * otherwise.
 */
function isToolboxVisible(state) {
    const { iAmRecorder, iAmSipGateway, toolbarConfig } = state['features/base/config'];
    const { alwaysVisible } = toolbarConfig || {};
    const { timeoutID, visible } = state['features/toolbox'];
    const { audioSettingsVisible, videoSettingsVisible } = state['features/settings'];
    const whiteboardVisible = (0, functions_4.isWhiteboardVisible)(state);
    return Boolean(!iAmRecorder && !iAmSipGateway
        && (timeoutID
            || visible
            || alwaysVisible
            || audioSettingsVisible
            || videoSettingsVisible
            || whiteboardVisible));
}
exports.isToolboxVisible = isToolboxVisible;
/**
 * Indicates if the audio settings button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
function isAudioSettingsButtonDisabled(state) {
    return !((0, functions_1.hasAvailableDevices)(state, 'audioInput')
        || (0, functions_1.hasAvailableDevices)(state, 'audioOutput'))
        || state['features/base/config'].startSilent;
}
exports.isAudioSettingsButtonDisabled = isAudioSettingsButtonDisabled;
/**
 * Indicates if the desktop share button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
function isDesktopShareButtonDisabled(state) {
    const { muted, unmuteBlocked } = state['features/base/media'].video;
    const videoOrShareInProgress = !muted || (0, functions_3.isScreenMediaShared)(state);
    const enabledInJwt = (0, functions_2.isJwtFeatureEnabled)(state, constants_1.MEET_FEATURES.SCREEN_SHARING, true, true);
    return !enabledInJwt || (unmuteBlocked && !videoOrShareInProgress);
}
exports.isDesktopShareButtonDisabled = isDesktopShareButtonDisabled;
/**
 * Indicates if the video settings button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
function isVideoSettingsButtonDisabled(state) {
    return !(0, functions_1.hasAvailableDevices)(state, 'videoInput');
}
exports.isVideoSettingsButtonDisabled = isVideoSettingsButtonDisabled;
/**
 * Indicates if the video mute button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
function isVideoMuteButtonDisabled(state) {
    const { muted, unmuteBlocked, gumPending } = state['features/base/media'].video;
    return !(0, functions_1.hasAvailableDevices)(state, 'videoInput')
        || (unmuteBlocked && Boolean(muted))
        || gumPending !== types_1.IGUMPendingState.NONE;
}
exports.isVideoMuteButtonDisabled = isVideoMuteButtonDisabled;
/**
 * If an overflow drawer should be displayed or not.
 * This is usually done for mobile devices or on narrow screens.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
function showOverflowDrawer(state) {
    return state['features/toolbox'].overflowDrawer;
}
exports.showOverflowDrawer = showOverflowDrawer;
/**
 * Returns true if the overflow menu button is displayed and false otherwise.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean} - True if the overflow menu button is displayed and false otherwise.
 */
function showOverflowMenu(state) {
    return state['features/toolbox'].overflowMenuVisible;
}
exports.showOverflowMenu = showOverflowMenu;
/**
 * Indicates whether the toolbox is enabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
function isToolboxEnabled(state) {
    return state['features/toolbox'].enabled;
}
exports.isToolboxEnabled = isToolboxEnabled;
/**
 * Returns the toolbar timeout from config or the default value.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {number} - Toolbar timeout in milliseconds.
 */
function getToolbarTimeout(state) {
    const { toolbarConfig } = state['features/base/config'];
    return toolbarConfig?.timeout || constants_2.TOOLBAR_TIMEOUT;
}
exports.getToolbarTimeout = getToolbarTimeout;
/**
    * Returns all buttons that could be rendered.
    *
    * @param {Object} _customToolbarButtons - An array containing custom buttons objects.
    * @returns {Object} The button maps mainMenuButtons and overflowMenuButtons.
    */
function getAllToolboxButtons(_customToolbarButtons) {
    const microphone = {
        key: 'microphone',
        Content: AudioSettingsButton_1.default,
        group: 0
    };
    const camera = {
        key: 'camera',
        Content: VideoSettingsButton_1.default,
        group: 0
    };
    const profile = {
        key: 'profile',
        Content: ProfileButton_1.default,
        group: 1
    };
    const chat = {
        key: 'chat',
        Content: ChatButton_1.default,
        group: 2
    };
    const desktop = {
        key: 'desktop',
        Content: ShareDesktopButton_1.default,
        group: 2
    };
    // In Narrow layout and mobile web we are using drawer for popups and that is why it is better to include
    // all forms of reactions in the overflow menu. Otherwise the toolbox will be hidden and the reactions popup
    // misaligned.
    const raisehand = {
        key: 'raisehand',
        Content: RaiseHandContainerButtons_1.default,
        group: 2
    };
    const reactions = {
        key: 'reactions',
        Content: ReactionsMenuButton_1.default,
        group: 2
    };
    const participants = {
        key: 'participants-pane',
        Content: ParticipantsPaneButton_1.default,
        group: 2
    };
    const invite = {
        key: 'invite',
        Content: InviteButton_1.default,
        group: 2
    };
    const tileview = {
        key: 'tileview',
        Content: TileViewButton_1.default,
        group: 2
    };
    const toggleCamera = {
        key: 'toggle-camera',
        Content: ToggleCameraButton_1.default,
        group: 2
    };
    const videoquality = {
        key: 'videoquality',
        Content: VideoQualityButton_web_1.default,
        group: 2
    };
    const fullscreen = {
        key: 'fullscreen',
        Content: FullscreenButton_1.default,
        group: 2
    };
    const security = {
        key: 'security',
        Content: SecurityDialogButton_1.default,
        group: 2
    };
    const closedcaptions = {
        key: 'closedcaptions',
        Content: ClosedCaptionButton_1.default,
        group: 2
    };
    const recording = {
        key: 'recording',
        Content: RecordButton_1.default,
        group: 2
    };
    const livestreaming = {
        key: 'livestreaming',
        Content: LiveStreamButton_1.default,
        group: 2
    };
    const linktosalesforce = {
        key: 'linktosalesforce',
        Content: LinkToSalesforceButton_1.default,
        group: 2
    };
    const sharedvideo = {
        key: 'sharedvideo',
        Content: SharedVideoButton_1.default,
        group: 3
    };
    const shareaudio = {
        key: 'shareaudio',
        Content: ShareAudioButton_1.default,
        group: 3
    };
    const noisesuppression = {
        key: 'noisesuppression',
        Content: NoiseSuppressionButton_1.default,
        group: 3
    };
    const whiteboard = {
        key: 'whiteboard',
        Content: WhiteboardButton_1.default,
        group: 3
    };
    const etherpad = {
        key: 'etherpad',
        Content: SharedDocumentButton_web_1.default,
        group: 3
    };
    const virtualBackground = {
        key: 'select-background',
        Content: VideoBackgroundButton_1.default,
        group: 3
    };
    const stats = {
        key: 'stats',
        Content: SpeakerStatsButton_1.default,
        group: 3
    };
    const settings = {
        key: 'settings',
        Content: SettingsButton_1.default,
        group: 4
    };
    const shortcuts = {
        key: 'shortcuts',
        Content: KeyboardShortcutsButton_1.default,
        group: 4
    };
    const embedmeeting = {
        key: 'embedmeeting',
        Content: EmbedMeetingButton_1.default,
        group: 4
    };
    const feedback = {
        key: 'feedback',
        Content: FeedbackButton_web_1.default,
        group: 4
    };
    const download = {
        key: 'download',
        Content: DownloadButton_1.default,
        group: 4
    };
    const help = {
        key: 'help',
        Content: HelpButton_1.default,
        group: 4
    };
    const customButtons = _customToolbarButtons?.reduce((prev, { backgroundColor, icon, id, text }) => {
        return {
            ...prev,
            [id]: {
                backgroundColor,
                key: id,
                Content: CustomOptionButton_1.default,
                group: 4,
                icon,
                text
            }
        };
    }, {});
    return {
        microphone,
        camera,
        profile,
        desktop,
        chat,
        raisehand,
        reactions,
        'participants-pane': participants,
        invite,
        tileview,
        'toggle-camera': toggleCamera,
        videoquality,
        fullscreen,
        security,
        closedcaptions,
        recording,
        livestreaming,
        linktosalesforce,
        sharedvideo,
        shareaudio,
        noisesuppression,
        whiteboard,
        etherpad,
        'select-background': virtualBackground,
        stats,
        settings,
        shortcuts,
        embedmeeting,
        feedback,
        download,
        help,
        ...customButtons
    };
}
exports.getAllToolboxButtons = getAllToolboxButtons;
/**
 * Returns the list of participant menu buttons that have that notify the api when clicked.
 *
 * @param {Object} state - The redux state.
 * @returns {Map<string, NOTIFY_CLICK_MODE>} - The list of participant menu buttons.
 */
function getParticipantMenuButtonsWithNotifyClick(state) {
    return state['features/toolbox'].participantMenuButtonsWithNotifyClick;
}
exports.getParticipantMenuButtonsWithNotifyClick = getParticipantMenuButtonsWithNotifyClick;
