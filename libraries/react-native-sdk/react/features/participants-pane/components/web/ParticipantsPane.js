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
const participantsPaneTheme_json_1 = __importDefault(require("../../../base/components/themes/participantsPaneTheme.json"));
const actions_1 = require("../../../base/dialog/actions");
const svg_1 = require("../../../base/icons/svg");
const functions_1 = require("../../../base/participants/functions");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const ClickableIcon_1 = __importDefault(require("../../../base/ui/components/web/ClickableIcon"));
const constants_web_1 = require("../../../base/ui/constants.web");
const functions_web_1 = require("../../../base/ui/functions.web");
const functions_2 = require("../../../breakout-rooms/functions");
const MuteEveryoneDialog_1 = __importDefault(require("../../../video-menu/components/web/MuteEveryoneDialog"));
const actions_web_1 = require("../../actions.web");
const functions_3 = require("../../functions");
const AddBreakoutRoomButton_1 = require("../breakout-rooms/components/web/AddBreakoutRoomButton");
const RoomList_1 = require("../breakout-rooms/components/web/RoomList");
const FooterContextMenu_1 = require("./FooterContextMenu");
const LobbyParticipants_1 = __importDefault(require("./LobbyParticipants"));
const MeetingParticipants_1 = __importDefault(require("./MeetingParticipants"));
const VisitorsList_1 = __importDefault(require("./VisitorsList"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        participantsPane: {
            backgroundColor: theme.palette.ui01,
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative',
            transition: 'width .16s ease-in-out',
            width: '315px',
            zIndex: 0,
            display: 'flex',
            flexDirection: 'column',
            fontWeight: 600,
            height: '100%',
            [['& > *:first-child', '& > *:last-child']]: {
                flexShrink: 0
            },
            '@media (max-width: 580px)': {
                height: '100dvh',
                position: 'fixed',
                left: 0,
                right: 0,
                top: 0,
                width: '100%'
            }
        },
        container: {
            boxSizing: 'border-box',
            flex: 1,
            overflowY: 'auto',
            position: 'relative',
            padding: `0 ${participantsPaneTheme_json_1.default.panePadding}px`,
            '&::-webkit-scrollbar': {
                display: 'none'
            }
        },
        closeButton: {
            alignItems: 'center',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center'
        },
        header: {
            alignItems: 'center',
            boxSizing: 'border-box',
            display: 'flex',
            height: '60px',
            padding: `0 ${participantsPaneTheme_json_1.default.panePadding}px`,
            justifyContent: 'flex-end'
        },
        antiCollapse: {
            fontSize: 0,
            '&:first-child': {
                display: 'none'
            },
            '&:first-child + *': {
                marginTop: 0
            }
        },
        footer: {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: `${theme.spacing(4)} ${participantsPaneTheme_json_1.default.panePadding}px`,
            '& > *:not(:last-child)': {
                marginRight: theme.spacing(3)
            }
        },
        footerMoreContainer: {
            position: 'relative'
        }
    };
});
const ParticipantsPane = () => {
    const { classes, cx } = useStyles();
    const paneOpen = (0, react_redux_1.useSelector)(functions_3.getParticipantsPaneOpen);
    const isBreakoutRoomsSupported = (0, react_redux_1.useSelector)((state) => state['features/base/conference'])
        .conference?.getBreakoutRooms()?.isSupported();
    const showAddRoomButton = (0, react_redux_1.useSelector)(functions_2.isAddBreakoutRoomButtonVisible);
    const showFooter = (0, react_redux_1.useSelector)(functions_1.isLocalParticipantModerator);
    const showMuteAllButton = (0, react_redux_1.useSelector)(functions_3.isMuteAllVisible);
    const showMoreActionsButton = (0, react_redux_1.useSelector)(functions_3.isMoreActionsVisible);
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [contextOpen, setContextOpen] = (0, react_1.useState)(false);
    const [searchString, setSearchString] = (0, react_1.useState)('');
    const onWindowClickListener = (0, react_1.useCallback)((e) => {
        if (contextOpen && !(0, functions_web_1.findAncestorByClass)(e.target, classes.footerMoreContainer)) {
            setContextOpen(false);
        }
    }, [contextOpen]);
    (0, react_1.useEffect)(() => {
        window.addEventListener('click', onWindowClickListener);
        return () => {
            window.removeEventListener('click', onWindowClickListener);
        };
    }, []);
    const onClosePane = (0, react_1.useCallback)(() => {
        dispatch((0, actions_web_1.close)());
    }, []);
    const onDrawerClose = (0, react_1.useCallback)(() => {
        setContextOpen(false);
    }, []);
    const onMuteAll = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.openDialog)(MuteEveryoneDialog_1.default));
    }, []);
    const onToggleContext = (0, react_1.useCallback)(() => {
        setContextOpen(open => !open);
    }, []);
    if (!paneOpen) {
        return null;
    }
    return (react_1.default.createElement("div", { className: cx('participants_pane', classes.participantsPane) },
        react_1.default.createElement("div", { className: classes.header },
            react_1.default.createElement(ClickableIcon_1.default, { accessibilityLabel: t('participantsPane.close', 'Close'), icon: svg_1.IconCloseLarge, onClick: onClosePane })),
        react_1.default.createElement("div", { className: classes.container },
            react_1.default.createElement(VisitorsList_1.default, null),
            react_1.default.createElement("br", { className: classes.antiCollapse }),
            react_1.default.createElement(LobbyParticipants_1.default, null),
            react_1.default.createElement("br", { className: classes.antiCollapse }),
            react_1.default.createElement(MeetingParticipants_1.default, { searchString: searchString, setSearchString: setSearchString }),
            isBreakoutRoomsSupported && react_1.default.createElement(RoomList_1.RoomList, { searchString: searchString }),
            showAddRoomButton && react_1.default.createElement(AddBreakoutRoomButton_1.AddBreakoutRoomButton, null)),
        showFooter && (react_1.default.createElement("div", { className: classes.footer },
            showMuteAllButton && (react_1.default.createElement(Button_1.default, { accessibilityLabel: t('participantsPane.actions.muteAll'), labelKey: 'participantsPane.actions.muteAll', onClick: onMuteAll, type: constants_web_1.BUTTON_TYPES.SECONDARY })),
            showMoreActionsButton && (react_1.default.createElement("div", { className: classes.footerMoreContainer },
                react_1.default.createElement(Button_1.default, { accessibilityLabel: t('participantsPane.actions.moreModerationActions'), icon: svg_1.IconDotsHorizontal, id: 'participants-pane-context-menu', onClick: onToggleContext, type: constants_web_1.BUTTON_TYPES.SECONDARY }),
                react_1.default.createElement(FooterContextMenu_1.FooterContextMenu, { isOpen: contextOpen, onDrawerClose: onDrawerClose, onMouseLeave: onToggleContext })))))));
};
exports.default = ParticipantsPane;
