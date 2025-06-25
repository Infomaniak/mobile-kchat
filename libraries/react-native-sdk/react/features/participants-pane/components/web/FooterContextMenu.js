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
exports.FooterContextMenu = void 0;
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const actions_1 = require("../../../av-moderation/actions");
const functions_1 = require("../../../av-moderation/functions");
const actions_2 = require("../../../base/dialog/actions");
const svg_1 = require("../../../base/icons/svg");
const constants_1 = require("../../../base/media/constants");
const functions_2 = require("../../../base/participants/functions");
const functions_web_1 = require("../../../base/styles/functions.web");
const ContextMenu_1 = __importDefault(require("../../../base/ui/components/web/ContextMenu"));
const ContextMenuItemGroup_1 = __importDefault(require("../../../base/ui/components/web/ContextMenuItemGroup"));
const functions_3 = require("../../../breakout-rooms/functions");
const actions_web_1 = require("../../../settings/actions.web");
const constants_2 = require("../../../settings/constants");
const functions_web_2 = require("../../../settings/functions.web");
const MuteEveryonesVideoDialog_1 = __importDefault(require("../../../video-menu/components/web/MuteEveryonesVideoDialog"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        contextMenu: {
            bottom: 'auto',
            margin: '0',
            right: 0,
            top: '-8px',
            transform: 'translateY(-100%)',
            width: '283px'
        },
        text: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            color: theme.palette.text02,
            padding: '10px 16px',
            height: '40px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box'
        },
        indentedLabel: {
            '& > span': {
                marginLeft: '36px'
            }
        }
    };
});
const FooterContextMenu = ({ isOpen, onDrawerClose, onMouseLeave }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const isModerationSupported = (0, react_redux_1.useSelector)((state) => (0, functions_1.isSupported)()(state));
    const allModerators = (0, react_redux_1.useSelector)(functions_2.isEveryoneModerator);
    const isModeratorSettingsTabEnabled = (0, react_redux_1.useSelector)(functions_web_2.shouldShowModeratorSettings);
    const participantCount = (0, react_redux_1.useSelector)(functions_2.getParticipantCount);
    const isAudioModerationEnabled = (0, react_redux_1.useSelector)((0, functions_1.isEnabled)(constants_1.MEDIA_TYPE.AUDIO));
    const isVideoModerationEnabled = (0, react_redux_1.useSelector)((0, functions_1.isEnabled)(constants_1.MEDIA_TYPE.VIDEO));
    const isBreakoutRoom = (0, react_redux_1.useSelector)(functions_3.isInBreakoutRoom);
    const { t } = (0, react_i18next_1.useTranslation)();
    const disableAudioModeration = (0, react_1.useCallback)(() => dispatch((0, actions_1.requestDisableAudioModeration)()), [dispatch]);
    const disableVideoModeration = (0, react_1.useCallback)(() => dispatch((0, actions_1.requestDisableVideoModeration)()), [dispatch]);
    const enableAudioModeration = (0, react_1.useCallback)(() => dispatch((0, actions_1.requestEnableAudioModeration)()), [dispatch]);
    const enableVideoModeration = (0, react_1.useCallback)(() => dispatch((0, actions_1.requestEnableVideoModeration)()), [dispatch]);
    const { classes } = useStyles();
    const muteAllVideo = (0, react_1.useCallback)(() => dispatch((0, actions_2.openDialog)(MuteEveryonesVideoDialog_1.default)), [dispatch]);
    const openModeratorSettings = () => dispatch((0, actions_web_1.openSettingsDialog)(constants_2.SETTINGS_TABS.MODERATOR));
    const actions = [
        {
            accessibilityLabel: t('participantsPane.actions.audioModeration'),
            className: isAudioModerationEnabled ? classes.indentedLabel : '',
            id: isAudioModerationEnabled
                ? 'participants-pane-context-menu-stop-audio-moderation'
                : 'participants-pane-context-menu-start-audio-moderation',
            icon: !isAudioModerationEnabled && svg_1.IconCheck,
            onClick: isAudioModerationEnabled ? disableAudioModeration : enableAudioModeration,
            text: t('participantsPane.actions.audioModeration')
        }, {
            accessibilityLabel: t('participantsPane.actions.videoModeration'),
            className: isVideoModerationEnabled ? classes.indentedLabel : '',
            id: isVideoModerationEnabled
                ? 'participants-pane-context-menu-stop-video-moderation'
                : 'participants-pane-context-menu-start-video-moderation',
            icon: !isVideoModerationEnabled && svg_1.IconCheck,
            onClick: isVideoModerationEnabled ? disableVideoModeration : enableVideoModeration,
            text: t('participantsPane.actions.videoModeration')
        }
    ];
    return (react_1.default.createElement(ContextMenu_1.default, { activateFocusTrap: true, className: classes.contextMenu, hidden: !isOpen, isDrawerOpen: isOpen, onDrawerClose: onDrawerClose, onMouseLeave: onMouseLeave },
        react_1.default.createElement(ContextMenuItemGroup_1.default, { actions: [{
                    accessibilityLabel: t('participantsPane.actions.stopEveryonesVideo'),
                    id: 'participants-pane-context-menu-stop-video',
                    icon: svg_1.IconVideoOff,
                    onClick: muteAllVideo,
                    text: t('participantsPane.actions.stopEveryonesVideo')
                }] }),
        !isBreakoutRoom && isModerationSupported && (participantCount === 1 || !allModerators) && (react_1.default.createElement(ContextMenuItemGroup_1.default, { actions: actions },
            react_1.default.createElement("div", { className: classes.text },
                react_1.default.createElement("span", null, t('participantsPane.actions.allow'))))),
        isModeratorSettingsTabEnabled && (react_1.default.createElement(ContextMenuItemGroup_1.default, { actions: [{
                    accessibilityLabel: t('participantsPane.actions.moreModerationControls'),
                    id: 'participants-pane-open-moderation-control-settings',
                    icon: svg_1.IconDotsHorizontal,
                    onClick: openModeratorSettings,
                    text: t('participantsPane.actions.moreModerationControls')
                }] }))));
};
exports.FooterContextMenu = FooterContextMenu;
