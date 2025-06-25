"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKeyboardShortcuts = void 0;
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const actions_1 = require("../base/dialog/actions");
const lib_jitsi_meet_1 = __importDefault(require("../base/lib-jitsi-meet"));
const actions_2 = require("../base/participants/actions");
const functions_2 = require("../base/participants/functions");
const actions_web_1 = require("../chat/actions.web");
const actions_3 = require("../gifs/actions");
const function_any_1 = require("../gifs/function.any");
const actions_any_1 = require("../keyboard-shortcuts/actions.any");
const actions_web_2 = require("../participants-pane/actions.web");
const functions_3 = require("../participants-pane/functions");
const actions_any_2 = require("../reactions/actions.any");
const actions_web_3 = require("../reactions/actions.web");
const constants_1 = require("../reactions/constants");
const functions_any_1 = require("../reactions/functions.any");
const actions_web_4 = require("../screen-share/actions.web");
const functions_4 = require("../screen-share/functions");
const SpeakerStats_1 = __importDefault(require("../speaker-stats/components/web/SpeakerStats"));
const functions_5 = require("../speaker-stats/functions");
const actions_any_3 = require("../video-layout/actions.any");
const functions_any_2 = require("../video-layout/functions.any");
const VideoQualityDialog_web_1 = __importDefault(require("../video-quality/components/VideoQualityDialog.web"));
const actions_web_5 = require("./actions.web");
const functions_web_1 = require("./functions.web");
const useKeyboardShortcuts = (toolbarButtons) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const _isSpeakerStatsDisabled = (0, react_redux_1.useSelector)(functions_5.isSpeakerStatsDisabled);
    const _isParticipantsPaneEnabled = (0, react_redux_1.useSelector)(functions_3.isParticipantsPaneEnabled);
    const _shouldDisplayReactionsButtons = (0, react_redux_1.useSelector)(functions_any_1.shouldDisplayReactionsButtons);
    const _toolbarButtons = (0, react_redux_1.useSelector)((state) => toolbarButtons || state['features/toolbox'].toolbarButtons);
    const chatOpen = (0, react_redux_1.useSelector)((state) => state['features/chat'].isOpen);
    const desktopSharingButtonDisabled = (0, react_redux_1.useSelector)(functions_web_1.isDesktopShareButtonDisabled);
    const desktopSharingEnabled = lib_jitsi_meet_1.default.isDesktopSharingEnabled();
    const fullScreen = (0, react_redux_1.useSelector)((state) => state['features/toolbox'].fullScreen);
    const gifsEnabled = (0, react_redux_1.useSelector)(function_any_1.isGifEnabled);
    const participantsPaneOpen = (0, react_redux_1.useSelector)(functions_3.getParticipantsPaneOpen);
    const raisedHand = (0, react_redux_1.useSelector)((state) => (0, functions_2.hasRaisedHand)((0, functions_2.getLocalParticipant)(state)));
    const screenSharing = (0, react_redux_1.useSelector)(functions_4.isScreenVideoShared);
    const tileViewEnabled = (0, react_redux_1.useSelector)(functions_any_2.shouldDisplayTileView);
    /**
     * Creates an analytics keyboard shortcut event and dispatches an action for
     * toggling the display of chat.
     *
     * @private
     * @returns {void}
     */
    function onToggleChat() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('toggle.chat', AnalyticsEvents_1.ACTION_SHORTCUT_TRIGGERED, {
            enable: !chatOpen
        }));
        // Checks if there was any text selected by the user.
        // Used for when we press simultaneously keys for copying
        // text messages from the chat board
        if (window.getSelection()?.toString() !== '') {
            return false;
        }
        dispatch((0, actions_web_1.toggleChat)());
    }
    /**
     * Creates an analytics keyboard shortcut event and dispatches an action for
     * toggling the display of the participants pane.
     *
     * @private
     * @returns {void}
     */
    function onToggleParticipantsPane() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('toggle.participants-pane', AnalyticsEvents_1.ACTION_SHORTCUT_TRIGGERED, {
            enable: !participantsPaneOpen
        }));
        if (participantsPaneOpen) {
            dispatch((0, actions_web_2.close)());
        }
        else {
            dispatch((0, actions_web_2.open)());
        }
    }
    /**
    * Creates an analytics keyboard shortcut event and dispatches an action for
    * toggling the display of Video Quality.
    *
    * @private
    * @returns {void}
    */
    function onToggleVideoQuality() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('video.quality'));
        dispatch((0, actions_1.toggleDialog)(VideoQualityDialog_web_1.default));
    }
    /**
     * Dispatches an action for toggling the tile view.
     *
     * @private
     * @returns {void}
     */
    function onToggleTileView() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('toggle.tileview', AnalyticsEvents_1.ACTION_SHORTCUT_TRIGGERED, {
            enable: !tileViewEnabled
        }));
        dispatch((0, actions_any_3.toggleTileView)());
    }
    /**
     * Creates an analytics keyboard shortcut event and dispatches an action for
     * toggling full screen mode.
     *
     * @private
     * @returns {void}
     */
    function onToggleFullScreen() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('toggle.fullscreen', AnalyticsEvents_1.ACTION_SHORTCUT_TRIGGERED, {
            enable: !fullScreen
        }));
        dispatch((0, actions_web_5.setFullScreen)(!fullScreen));
    }
    /**
     * Creates an analytics keyboard shortcut event and dispatches an action for
     * toggling raise hand.
     *
     * @private
     * @returns {void}
     */
    function onToggleRaiseHand() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('toggle.raise.hand', AnalyticsEvents_1.ACTION_SHORTCUT_TRIGGERED, { enable: !raisedHand }));
        dispatch((0, actions_2.raiseHand)(!raisedHand));
    }
    /**
     * Creates an analytics keyboard shortcut event and dispatches an action for
     * toggling screensharing.
     *
     * @private
     * @returns {void}
     */
    function onToggleScreenshare() {
        // Ignore the shortcut if the button is disabled.
        if (desktopSharingButtonDisabled) {
            return;
        }
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('toggle.screen.sharing', AnalyticsEvents_1.ACTION_SHORTCUT_TRIGGERED, {
            enable: !screenSharing
        }));
        if (desktopSharingEnabled && !desktopSharingButtonDisabled) {
            dispatch((0, actions_web_4.startScreenShareFlow)(!screenSharing));
        }
    }
    /**
     * Creates an analytics keyboard shortcut event and dispatches an action for
     * toggling speaker stats.
     *
     * @private
     * @returns {void}
     */
    function onSpeakerStats() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('speaker.stats'));
        dispatch((0, actions_1.toggleDialog)(SpeakerStats_1.default, {
            conference: APP.conference
        }));
    }
    (0, react_1.useEffect)(() => {
        const KEYBOARD_SHORTCUTS = [
            (0, functions_web_1.isButtonEnabled)('videoquality', _toolbarButtons) && {
                character: 'A',
                exec: onToggleVideoQuality,
                helpDescription: 'toolbar.callQuality'
            },
            (0, functions_web_1.isButtonEnabled)('chat', _toolbarButtons) && {
                character: 'C',
                exec: onToggleChat,
                helpDescription: 'keyboardShortcuts.toggleChat'
            },
            (0, functions_web_1.isButtonEnabled)('desktop', _toolbarButtons) && {
                character: 'D',
                exec: onToggleScreenshare,
                helpDescription: 'keyboardShortcuts.toggleScreensharing'
            },
            _isParticipantsPaneEnabled && (0, functions_web_1.isButtonEnabled)('participants-pane', _toolbarButtons) && {
                character: 'P',
                exec: onToggleParticipantsPane,
                helpDescription: 'keyboardShortcuts.toggleParticipantsPane'
            },
            (0, functions_web_1.isButtonEnabled)('raisehand', _toolbarButtons) && {
                character: 'R',
                exec: onToggleRaiseHand,
                helpDescription: 'keyboardShortcuts.raiseHand'
            },
            (0, functions_web_1.isButtonEnabled)('fullscreen', _toolbarButtons) && {
                character: 'S',
                exec: onToggleFullScreen,
                helpDescription: 'keyboardShortcuts.fullScreen'
            },
            (0, functions_web_1.isButtonEnabled)('tileview', _toolbarButtons) && {
                character: 'W',
                exec: onToggleTileView,
                helpDescription: 'toolbar.tileViewToggle'
            },
            !_isSpeakerStatsDisabled && (0, functions_web_1.isButtonEnabled)('stats', _toolbarButtons) && {
                character: 'T',
                exec: onSpeakerStats,
                helpDescription: 'keyboardShortcuts.showSpeakerStats'
            }
        ];
        KEYBOARD_SHORTCUTS.forEach(shortcut => {
            if (typeof shortcut === 'object') {
                dispatch((0, actions_any_1.registerShortcut)({
                    character: shortcut.character,
                    handler: shortcut.exec,
                    helpDescription: shortcut.helpDescription
                }));
            }
        });
        // If the buttons for sending reactions are not displayed we should disable the shortcuts too.
        if (_shouldDisplayReactionsButtons) {
            const REACTION_SHORTCUTS = Object.keys(constants_1.REACTIONS).map(key => {
                const onShortcutSendReaction = () => {
                    dispatch((0, actions_any_2.addReactionToBuffer)(key));
                    (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)(`reaction.${key}`));
                };
                return {
                    character: constants_1.REACTIONS[key].shortcutChar,
                    exec: onShortcutSendReaction,
                    helpDescription: `toolbar.reaction${key.charAt(0).toUpperCase()}${key.slice(1)}`,
                    altKey: true
                };
            });
            REACTION_SHORTCUTS.forEach(shortcut => {
                dispatch((0, actions_any_1.registerShortcut)({
                    alt: shortcut.altKey,
                    character: shortcut.character,
                    handler: shortcut.exec,
                    helpDescription: shortcut.helpDescription
                }));
            });
            if (gifsEnabled) {
                const onGifShortcut = () => {
                    (0, react_redux_1.batch)(() => {
                        dispatch((0, actions_web_3.toggleReactionsMenuVisibility)());
                        dispatch((0, actions_3.setGifMenuVisibility)(true));
                    });
                };
                dispatch((0, actions_any_1.registerShortcut)({
                    character: 'G',
                    handler: onGifShortcut,
                    helpDescription: 'keyboardShortcuts.giphyMenu'
                }));
            }
        }
        return () => {
            ['A', 'C', 'D', 'P', 'R', 'S', 'W', 'T', 'G'].forEach(letter => dispatch((0, actions_any_1.unregisterShortcut)(letter)));
            if (_shouldDisplayReactionsButtons) {
                Object.keys(constants_1.REACTIONS).map(key => constants_1.REACTIONS[key].shortcutChar)
                    .forEach(letter => dispatch((0, actions_any_1.unregisterShortcut)(letter, true)));
            }
        };
    }, [
        _shouldDisplayReactionsButtons,
        chatOpen,
        desktopSharingButtonDisabled,
        desktopSharingEnabled,
        fullScreen,
        gifsEnabled,
        participantsPaneOpen,
        raisedHand,
        screenSharing,
        tileViewEnabled
    ]);
};
exports.useKeyboardShortcuts = useKeyboardShortcuts;
