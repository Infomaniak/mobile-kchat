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
exports.RoomList = void 0;
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const utils_1 = require("../../../../../base/environment/utils");
const functions_1 = require("../../../../../base/participants/functions");
const functions_2 = require("../../../../../base/redux/functions");
const useContextMenu_web_1 = __importDefault(require("../../../../../base/ui/hooks/useContextMenu.web"));
const functions_3 = require("../../../../../breakout-rooms/functions");
const AutoAssignButton_1 = require("./AutoAssignButton");
const CollapsibleRoom_1 = require("./CollapsibleRoom");
const JoinQuickActionButton_1 = __importDefault(require("./JoinQuickActionButton"));
const LeaveButton_1 = require("./LeaveButton");
const RoomActionEllipsis_1 = __importDefault(require("./RoomActionEllipsis"));
const RoomContextMenu_1 = require("./RoomContextMenu");
const RoomParticipantContextMenu_1 = require("./RoomParticipantContextMenu");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        topMargin: {
            marginTop: theme.spacing(3)
        }
    };
});
const RoomList = ({ searchString }) => {
    const { classes } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    const currentRoomId = (0, react_redux_1.useSelector)(functions_3.getCurrentRoomId);
    const rooms = Object.values((0, react_redux_1.useSelector)(functions_3.getBreakoutRooms, functions_2.equals))
        .filter((room) => room.id !== currentRoomId)
        .sort((p1, p2) => (p1?.name || '').localeCompare(p2?.name || ''));
    const inBreakoutRoom = (0, react_redux_1.useSelector)(functions_3.isInBreakoutRoom);
    const isLocalModerator = (0, react_redux_1.useSelector)(functions_1.isLocalParticipantModerator);
    const showAutoAssign = (0, react_redux_1.useSelector)(functions_3.isAutoAssignParticipantsVisible);
    const { hideJoinRoomButton } = (0, react_redux_1.useSelector)(functions_3.getBreakoutRoomsConfig);
    const [lowerMenu, raiseMenu, toggleMenu, menuEnter, menuLeave, raiseContext] = (0, useContextMenu_web_1.default)();
    const [lowerParticipantMenu, raiseParticipantMenu, toggleParticipantMenu, participantMenuEnter, participantMenuLeave, raiseParticipantContext] = (0, useContextMenu_web_1.default)();
    const onRaiseMenu = (0, react_1.useCallback)(room => (target) => raiseMenu(room, target), [raiseMenu]);
    // close the menu when the room vanishes
    (0, react_1.useEffect)(() => {
        if (raiseContext.entity && !rooms.some(r => r.id === raiseContext.entity?.id)) {
            lowerMenu();
        }
    }, [raiseContext, rooms, lowerMenu]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        inBreakoutRoom && react_1.default.createElement(LeaveButton_1.LeaveButton, { className: classes.topMargin }),
        showAutoAssign && react_1.default.createElement(AutoAssignButton_1.AutoAssignButton, { className: classes.topMargin }),
        react_1.default.createElement("div", { "aria-label": t('breakoutRooms.breakoutList', 'breakout list'), className: classes.topMargin, id: 'breakout-rooms-list', role: 'list' }, rooms.map(room => (react_1.default.createElement(react_1.default.Fragment, { key: room.id },
            react_1.default.createElement(CollapsibleRoom_1.CollapsibleRoom, { isHighlighted: true, onRaiseMenu: onRaiseMenu(room), participantContextEntity: raiseParticipantContext.entity, raiseParticipantContextMenu: raiseParticipantMenu, room: room, searchString: searchString, toggleParticipantMenu: toggleParticipantMenu }, !(0, utils_1.isMobileBrowser)() && react_1.default.createElement(react_1.default.Fragment, null,
                !hideJoinRoomButton && react_1.default.createElement(JoinQuickActionButton_1.default, { room: room }),
                isLocalModerator && !room.isMainRoom
                    && react_1.default.createElement(RoomActionEllipsis_1.default, { onClick: toggleMenu(room) }))))))),
        react_1.default.createElement(RoomContextMenu_1.RoomContextMenu, { onEnter: menuEnter, onLeave: menuLeave, onSelect: lowerMenu, ...raiseContext }),
        react_1.default.createElement(RoomParticipantContextMenu_1.RoomParticipantContextMenu, { onEnter: participantMenuEnter, onLeave: participantMenuLeave, onSelect: lowerParticipantMenu, ...raiseParticipantContext })));
};
exports.RoomList = RoomList;
