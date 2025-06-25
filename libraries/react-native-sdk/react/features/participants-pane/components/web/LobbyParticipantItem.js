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
exports.LobbyParticipantItem = void 0;
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const svg_1 = require("../../../base/icons/svg");
const functions_1 = require("../../../base/participants/functions");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const ContextMenu_1 = __importDefault(require("../../../base/ui/components/web/ContextMenu"));
const ContextMenuItemGroup_1 = __importDefault(require("../../../base/ui/components/web/ContextMenuItemGroup"));
const constants_web_1 = require("../../../base/ui/constants.web");
const functions_2 = require("../../../lobby/functions");
const constants_1 = require("../../constants");
const hooks_1 = require("../../hooks");
const ParticipantItem_1 = __importDefault(require("./ParticipantItem"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        button: {
            marginRight: theme.spacing(2)
        },
        moreButton: {
            paddingRight: '6px',
            paddingLeft: '6px',
            marginRight: theme.spacing(2)
        },
        contextMenu: {
            position: 'fixed',
            top: 'auto',
            marginRight: '8px'
        }
    };
});
const LobbyParticipantItem = ({ overflowDrawer, participant: p, openDrawerForParticipant }) => {
    const { id } = p;
    const [admit, reject, chat] = (0, hooks_1.useLobbyActions)({ participantID: id });
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const { classes: styles } = useStyles();
    const showChat = (0, react_redux_1.useSelector)((0, functions_2.showLobbyChatButton)(p));
    const moreButtonRef = (0, react_1.useRef)();
    const openContextMenu = (0, react_1.useCallback)(() => setIsOpen(true), []);
    const closeContextMenu = (0, react_1.useCallback)(() => setIsOpen(false), []);
    const renderAdmitButton = () => (react_1.default.createElement(Button_1.default, { accessibilityLabel: `${t('participantsPane.actions.admit')} ${p.name}`, className: styles.button, labelKey: 'participantsPane.actions.admit', onClick: admit, size: 'small', testId: `admit-${id}` }));
    return (react_1.default.createElement(ParticipantItem_1.default, { actionsTrigger: constants_1.ACTION_TRIGGER.PERMANENT, audioMediaState: constants_1.MEDIA_STATE.NONE, displayName: p.name, local: p.local, openDrawerForParticipant: openDrawerForParticipant, overflowDrawer: overflowDrawer, participantID: id, raisedHand: (0, functions_1.hasRaisedHand)(p), videoMediaState: constants_1.MEDIA_STATE.NONE, youText: t('chat.you') }, showChat ? react_1.default.createElement(react_1.default.Fragment, null,
        renderAdmitButton(),
        react_1.default.createElement(Button_1.default, { accessibilityLabel: `${t('participantsPane.actions.moreModerationActions')} ${p.name}`, className: styles.moreButton, icon: svg_1.IconDotsHorizontal, onClick: openContextMenu, ref: moreButtonRef, size: 'small' }),
        react_1.default.createElement(ContextMenu_1.default, { className: styles.contextMenu, hidden: !isOpen, offsetTarget: moreButtonRef.current, onMouseLeave: closeContextMenu },
            react_1.default.createElement(ContextMenuItemGroup_1.default, { actions: [{
                        accessibilityLabel: `${t('lobby.chat')} ${p.name}`,
                        onClick: chat,
                        testId: `lobby-chat-${id}`,
                        icon: svg_1.IconMessage,
                        text: t('lobby.chat')
                    }] }),
            react_1.default.createElement(ContextMenuItemGroup_1.default, { actions: [{
                        accessibilityLabel: `${t('participantsPane.actions.reject')} ${p.name}`,
                        onClick: reject,
                        testId: `reject-${id}`,
                        icon: svg_1.IconUserDeleted,
                        text: t('participantsPane.actions.reject')
                    }] }))) : react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Button_1.default, { accessibilityLabel: `${t('participantsPane.actions.reject')} ${p.name}`, className: styles.button, labelKey: 'participantsPane.actions.reject', onClick: reject, size: 'small', testId: `reject-${id}`, type: constants_web_1.BUTTON_TYPES.DESTRUCTIVE }),
        renderAdmitButton())));
};
exports.LobbyParticipantItem = LobbyParticipantItem;
