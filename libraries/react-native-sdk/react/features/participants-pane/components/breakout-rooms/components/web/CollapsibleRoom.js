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
exports.CollapsibleRoom = void 0;
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const Icon_1 = __importDefault(require("../../../../../base/icons/components/Icon"));
const svg_1 = require("../../../../../base/icons/svg");
const functions_1 = require("../../../../../base/participants/functions");
const functions_web_1 = require("../../../../../base/styles/functions.web");
const ListItem_1 = __importDefault(require("../../../../../base/ui/components/web/ListItem"));
const functions_web_2 = require("../../../../../toolbox/functions.web");
const constants_1 = require("../../../../constants");
const functions_2 = require("../../../../functions");
const ParticipantActionEllipsis_1 = __importDefault(require("../../../web/ParticipantActionEllipsis"));
const ParticipantItem_1 = __importDefault(require("../../../web/ParticipantItem"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            boxShadow: 'none'
        },
        roomName: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyLongBold)
        },
        arrowContainer: {
            backgroundColor: theme.palette.ui03,
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            marginRight: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none'
        }
    };
});
const CollapsibleRoom = ({ actionsTrigger = constants_1.ACTION_TRIGGER.HOVER, children, isHighlighted, onRaiseMenu, onLeave, participantContextEntity, raiseParticipantContextMenu, room, searchString, toggleParticipantMenu }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { classes: styles, cx } = useStyles();
    const [collapsed, setCollapsed] = (0, react_1.useState)(false);
    const toggleCollapsed = (0, react_1.useCallback)(() => {
        setCollapsed(!collapsed);
    }, [collapsed]);
    const raiseMenu = (0, react_1.useCallback)(target => {
        onRaiseMenu(target);
    }, [onRaiseMenu]);
    const { defaultRemoteDisplayName } = (0, react_redux_1.useSelector)((state) => state['features/base/config']);
    const overflowDrawer = (0, react_redux_1.useSelector)(functions_web_2.showOverflowDrawer);
    const moderator = (0, react_redux_1.useSelector)(functions_1.isLocalParticipantModerator);
    const arrow = (react_1.default.createElement("button", { "aria-label": collapsed ? t('breakoutRooms.hideParticipantList', 'Hide participant list')
            : t('breakoutRooms.showParticipantList', 'Show participant list'), className: styles.arrowContainer },
        react_1.default.createElement(Icon_1.default, { size: 14, src: collapsed ? svg_1.IconArrowDown : svg_1.IconArrowUp })));
    const roomName = (react_1.default.createElement("span", { className: styles.roomName }, `${room.name || t('breakoutRooms.mainRoom')} (${Object.keys(room?.participants
        || {}).length})`));
    const raiseParticipantMenu = (0, react_1.useCallback)(({ participantID, displayName }) => moderator
        && raiseParticipantContextMenu({
            room,
            jid: participantID,
            participantName: displayName
        }), [room, moderator]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ListItem_1.default, { actions: children, className: cx(styles.container, 'breakout-room-container'), defaultName: `${room.name || t('breakoutRooms.mainRoom')} (${Object.keys(room?.participants
                || {}).length})`, icon: arrow, isHighlighted: isHighlighted, onClick: toggleCollapsed, onLongPress: raiseMenu, onMouseLeave: onLeave, testId: room.id, textChildren: roomName, trigger: actionsTrigger }),
        !collapsed && room?.participants
            && Object.values(room?.participants || {}).map(p => (0, functions_2.participantMatchesSearch)(p, searchString) && (react_1.default.createElement(ParticipantItem_1.default, { actionsTrigger: constants_1.ACTION_TRIGGER.HOVER, displayName: p.displayName || defaultRemoteDisplayName, isHighlighted: participantContextEntity?.jid === p.jid, key: p.jid, local: false, openDrawerForParticipant: raiseParticipantMenu, overflowDrawer: overflowDrawer, participantID: p.jid }, !overflowDrawer && moderator && (react_1.default.createElement(ParticipantActionEllipsis_1.default, { accessibilityLabel: t('breakoutRoom.more'), onClick: toggleParticipantMenu({ room,
                    jid: p.jid,
                    participantName: p.displayName }) })))))));
};
exports.CollapsibleRoom = CollapsibleRoom;
