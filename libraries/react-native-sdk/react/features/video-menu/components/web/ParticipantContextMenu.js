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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../av-moderation/functions");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const utils_1 = require("../../../base/environment/utils");
const constants_1 = require("../../../base/media/constants");
const constants_2 = require("../../../base/participants/constants");
const functions_2 = require("../../../base/participants/functions");
const functions_any_1 = require("../../../base/tracks/functions.any");
const ContextMenu_1 = __importDefault(require("../../../base/ui/components/web/ContextMenu"));
const ContextMenuItemGroup_1 = __importDefault(require("../../../base/ui/components/web/ContextMenuItemGroup"));
const functions_3 = require("../../../breakout-rooms/functions");
const functions_4 = require("../../../e2ee/functions");
const actions_web_1 = require("../../../filmstrip/actions.web");
const functions_web_1 = require("../../../filmstrip/functions.web");
const constants_3 = require("../../../participants-pane/constants");
const functions_5 = require("../../../participants-pane/functions");
const actions_1 = require("../../../remote-control/actions");
const functions_web_2 = require("../../../toolbox/functions.web");
const types_1 = require("../../../toolbox/types");
const functions_6 = require("../../../visitors/functions");
const constants_4 = require("../../constants");
const AskToUnmuteButton_1 = __importDefault(require("./AskToUnmuteButton"));
const ConnectionStatusButton_1 = __importDefault(require("./ConnectionStatusButton"));
const CustomOptionButton_1 = __importDefault(require("./CustomOptionButton"));
const DemoteToVisitorButton_1 = __importDefault(require("./DemoteToVisitorButton"));
const GrantModeratorButton_1 = __importDefault(require("./GrantModeratorButton"));
const KickButton_1 = __importDefault(require("./KickButton"));
const MuteButton_1 = __importDefault(require("./MuteButton"));
const MuteEveryoneElseButton_1 = __importDefault(require("./MuteEveryoneElseButton"));
const MuteEveryoneElsesVideoButton_1 = __importDefault(require("./MuteEveryoneElsesVideoButton"));
const MuteVideoButton_1 = __importDefault(require("./MuteVideoButton"));
const PrivateMessageMenuButton_1 = __importDefault(require("./PrivateMessageMenuButton"));
const RemoteControlButton_1 = __importStar(require("./RemoteControlButton"));
const SendToRoomButton_1 = __importDefault(require("./SendToRoomButton"));
const TogglePinToStageButton_1 = __importDefault(require("./TogglePinToStageButton"));
const VerifyParticipantButton_1 = __importDefault(require("./VerifyParticipantButton"));
const VolumeSlider_1 = __importDefault(require("./VolumeSlider"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        text: {
            color: theme.palette.text02,
            padding: '10px 16px',
            height: '40px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box'
        }
    };
});
const ParticipantContextMenu = ({ className, closeDrawer, drawerParticipant, offsetTarget, onEnter, onLeave, onSelect, participant, remoteControlState, thumbnailMenu }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const { classes: styles } = useStyles();
    const localParticipant = (0, react_redux_1.useSelector)(functions_2.getLocalParticipant);
    const _isModerator = Boolean(localParticipant?.role === constants_2.PARTICIPANT_ROLE.MODERATOR);
    const _isVideoForceMuted = (0, react_redux_1.useSelector)(state => (0, functions_5.isForceMuted)(participant, constants_1.MEDIA_TYPE.VIDEO, state));
    const _isAudioMuted = (0, react_redux_1.useSelector)((state) => (0, functions_any_1.isParticipantAudioMuted)(participant, state));
    const _isVideoMuted = (0, react_redux_1.useSelector)((state) => (0, functions_any_1.isParticipantVideoMuted)(participant, state));
    const _overflowDrawer = (0, react_redux_1.useSelector)(functions_web_2.showOverflowDrawer);
    const { remoteVideoMenu = {}, disableRemoteMute, startSilent, customParticipantMenuButtons } = (0, react_redux_1.useSelector)((state) => state['features/base/config']);
    const visitorsMode = (0, react_redux_1.useSelector)((state) => (0, functions_6.iAmVisitor)(state));
    const visitorsSupported = (0, react_redux_1.useSelector)((state) => state['features/visitors'].supported);
    const { disableDemote, disableKick, disableGrantModerator, disablePrivateChat } = remoteVideoMenu;
    const { participantsVolume } = (0, react_redux_1.useSelector)((state) => state['features/filmstrip']);
    const _volume = (participant?.local ?? true ? undefined
        : participant?.id ? participantsVolume[participant?.id] : undefined) ?? 1;
    const isBreakoutRoom = (0, react_redux_1.useSelector)(functions_3.isInBreakoutRoom);
    const isModerationSupported = (0, react_redux_1.useSelector)((state) => (0, functions_1.isSupported)()(state));
    const stageFilmstrip = (0, react_redux_1.useSelector)(functions_web_1.isStageFilmstripAvailable);
    const shouldDisplayVerification = (0, react_redux_1.useSelector)((state) => (0, functions_4.displayVerification)(state, participant?.id));
    const buttonsWithNotifyClick = (0, react_redux_1.useSelector)(functions_web_2.getParticipantMenuButtonsWithNotifyClick);
    const _currentRoomId = (0, react_redux_1.useSelector)(functions_3.getCurrentRoomId);
    const _rooms = Object.values((0, react_redux_1.useSelector)(functions_3.getBreakoutRooms));
    const _onVolumeChange = (0, react_1.useCallback)(value => {
        dispatch((0, actions_web_1.setVolume)(participant.id, value));
    }, [actions_web_1.setVolume, dispatch]);
    const _getCurrentParticipantId = (0, react_1.useCallback)(() => {
        const drawer = _overflowDrawer && !thumbnailMenu;
        return (drawer ? drawerParticipant?.participantID : participant?.id) ?? '';
    }, [thumbnailMenu, _overflowDrawer, drawerParticipant, participant]);
    const notifyClick = (0, react_1.useCallback)((buttonKey) => {
        const notifyMode = buttonsWithNotifyClick?.get(buttonKey);
        if (!notifyMode) {
            return;
        }
        APP.API.notifyParticipantMenuButtonClicked(buttonKey, _getCurrentParticipantId(), notifyMode === types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY);
    }, [buttonsWithNotifyClick, _getCurrentParticipantId]);
    const onBreakoutRoomButtonClick = (0, react_1.useCallback)(() => {
        onSelect(true);
    }, [onSelect]);
    const isClickedFromParticipantPane = (0, react_1.useMemo)(() => !_overflowDrawer && !thumbnailMenu, [_overflowDrawer, thumbnailMenu]);
    const quickActionButtonType = (0, react_redux_1.useSelector)((state) => (0, functions_5.getQuickActionButtonType)(participant, _isAudioMuted, _isVideoMuted, state));
    const buttons = [];
    const buttons2 = [];
    const showVolumeSlider = !startSilent
        && !(0, utils_1.isIosMobileBrowser)()
        && (_overflowDrawer || thumbnailMenu)
        && typeof _volume === 'number'
        && !isNaN(_volume);
    const getButtonProps = (0, react_1.useCallback)((key) => {
        const notifyMode = buttonsWithNotifyClick?.get(key);
        const shouldNotifyClick = typeof notifyMode !== 'undefined';
        return {
            key,
            notifyMode,
            notifyClick: shouldNotifyClick ? () => notifyClick(key) : undefined,
            participantID: _getCurrentParticipantId()
        };
    }, [_getCurrentParticipantId, buttonsWithNotifyClick, notifyClick]);
    if (_isModerator) {
        if (isModerationSupported) {
            if (_isAudioMuted
                && !(isClickedFromParticipantPane && quickActionButtonType === constants_3.QUICK_ACTION_BUTTON.ASK_TO_UNMUTE)) {
                buttons.push(react_1.default.createElement(AskToUnmuteButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.ASK_UNMUTE), buttonType: constants_1.MEDIA_TYPE.AUDIO }));
            }
            if (_isVideoForceMuted
                && !(isClickedFromParticipantPane && quickActionButtonType === constants_3.QUICK_ACTION_BUTTON.ALLOW_VIDEO)) {
                buttons.push(react_1.default.createElement(AskToUnmuteButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.ALLOW_VIDEO), buttonType: constants_1.MEDIA_TYPE.VIDEO }));
            }
        }
        if (!disableRemoteMute) {
            if (!(isClickedFromParticipantPane && quickActionButtonType === constants_3.QUICK_ACTION_BUTTON.MUTE)) {
                buttons.push(react_1.default.createElement(MuteButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.MUTE) }));
            }
            buttons.push(react_1.default.createElement(MuteEveryoneElseButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.MUTE_OTHERS) }));
            if (!(isClickedFromParticipantPane && quickActionButtonType === constants_3.QUICK_ACTION_BUTTON.STOP_VIDEO)) {
                buttons.push(react_1.default.createElement(MuteVideoButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.MUTE_VIDEO) }));
            }
            buttons.push(react_1.default.createElement(MuteEveryoneElsesVideoButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.MUTE_OTHERS_VIDEO) }));
        }
        if (!disableGrantModerator && !isBreakoutRoom) {
            buttons2.push(react_1.default.createElement(GrantModeratorButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.GRANT_MODERATOR) }));
        }
        if (!disableDemote && visitorsSupported && _isModerator) {
            buttons2.push(react_1.default.createElement(DemoteToVisitorButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.DEMOTE) }));
        }
        if (!disableKick) {
            buttons2.push(react_1.default.createElement(KickButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.KICK) }));
        }
        if (shouldDisplayVerification) {
            buttons2.push(react_1.default.createElement(VerifyParticipantButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.VERIFY) }));
        }
    }
    if (stageFilmstrip) {
        buttons2.push(react_1.default.createElement(TogglePinToStageButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.PIN_TO_STAGE) }));
    }
    if (!disablePrivateChat && !visitorsMode) {
        buttons2.push(react_1.default.createElement(PrivateMessageMenuButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.PRIVATE_MESSAGE) }));
    }
    if (thumbnailMenu && (0, utils_1.isMobileBrowser)()) {
        buttons2.push(react_1.default.createElement(ConnectionStatusButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.CONN_STATUS) }));
    }
    if (thumbnailMenu && remoteControlState) {
        const onRemoteControlToggle = (0, react_1.useCallback)(() => {
            if (remoteControlState === RemoteControlButton_1.REMOTE_CONTROL_MENU_STATES.STARTED) {
                dispatch((0, actions_1.stopController)(true));
            }
            else if (remoteControlState === RemoteControlButton_1.REMOTE_CONTROL_MENU_STATES.NOT_STARTED) {
                dispatch((0, actions_1.requestRemoteControl)(_getCurrentParticipantId()));
            }
        }, [dispatch, remoteControlState, actions_1.stopController, actions_1.requestRemoteControl]);
        buttons2.push(react_1.default.createElement(RemoteControlButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.REMOTE_CONTROL), onClick: onRemoteControlToggle, remoteControlState: remoteControlState }));
    }
    if (customParticipantMenuButtons) {
        customParticipantMenuButtons.forEach(({ icon, id, text }) => {
            buttons2.push(react_1.default.createElement(CustomOptionButton_1.default, { icon: icon, key: id, 
                // eslint-disable-next-line react/jsx-no-bind
                onClick: () => notifyClick(id), text: text }));
        });
    }
    const breakoutRoomsButtons = [];
    if (!thumbnailMenu && _isModerator) {
        _rooms.forEach(room => {
            if (room.id !== _currentRoomId) {
                breakoutRoomsButtons.push(react_1.default.createElement(SendToRoomButton_1.default, { ...getButtonProps(constants_4.PARTICIPANT_MENU_BUTTONS.SEND_PARTICIPANT_TO_ROOM), key: room.id, onClick: onBreakoutRoomButtonClick, room: room }));
            }
        });
    }
    return (react_1.default.createElement(ContextMenu_1.default, { className: className, entity: participant, hidden: thumbnailMenu ? false : undefined, inDrawer: thumbnailMenu && _overflowDrawer, isDrawerOpen: Boolean(drawerParticipant), offsetTarget: offsetTarget, onClick: onSelect, onDrawerClose: thumbnailMenu ? onSelect : closeDrawer, onMouseEnter: onEnter, onMouseLeave: onLeave },
        !thumbnailMenu && _overflowDrawer && drawerParticipant && react_1.default.createElement(ContextMenuItemGroup_1.default, { actions: [{
                    accessibilityLabel: drawerParticipant.displayName,
                    customIcon: react_1.default.createElement(Avatar_1.default, { participantId: drawerParticipant.participantID, size: 20 }),
                    text: drawerParticipant.displayName
                }] }),
        buttons.length > 0 && (react_1.default.createElement(ContextMenuItemGroup_1.default, null, buttons)),
        react_1.default.createElement(ContextMenuItemGroup_1.default, null, buttons2),
        showVolumeSlider && (react_1.default.createElement(ContextMenuItemGroup_1.default, null,
            react_1.default.createElement(VolumeSlider_1.default, { initialValue: _volume, key: 'volume-slider', onChange: _onVolumeChange }))),
        breakoutRoomsButtons.length > 0 && (react_1.default.createElement(ContextMenuItemGroup_1.default, null,
            react_1.default.createElement("div", { className: styles.text }, t('breakoutRooms.actions.sendToBreakoutRoom')),
            breakoutRoomsButtons))));
};
exports.default = ParticipantContextMenu;
