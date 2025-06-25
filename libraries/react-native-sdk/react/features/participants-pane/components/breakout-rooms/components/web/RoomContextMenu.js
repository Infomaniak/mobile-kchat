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
exports.RoomContextMenu = void 0;
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../../../analytics/functions");
const actions_1 = require("../../../../../base/dialog/actions");
const svg_1 = require("../../../../../base/icons/svg");
const functions_2 = require("../../../../../base/participants/functions");
const ContextMenu_1 = __importDefault(require("../../../../../base/ui/components/web/ContextMenu"));
const ContextMenuItemGroup_1 = __importDefault(require("../../../../../base/ui/components/web/ContextMenuItemGroup"));
const actions_2 = require("../../../../../breakout-rooms/actions");
const functions_web_1 = require("../../../../../toolbox/functions.web");
const functions_3 = require("../../../../functions");
const BreakoutRoomNamePrompt_1 = __importDefault(require("./BreakoutRoomNamePrompt"));
const RoomContextMenu = ({ entity: room, offsetTarget, onEnter, onLeave, onSelect }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const isLocalModerator = (0, react_redux_1.useSelector)(functions_2.isLocalParticipantModerator);
    const _isBreakoutRoomRenameAllowed = (0, react_redux_1.useSelector)(functions_3.isBreakoutRoomRenameAllowed);
    const _overflowDrawer = (0, react_redux_1.useSelector)(functions_web_1.showOverflowDrawer);
    const onJoinRoom = (0, react_1.useCallback)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createBreakoutRoomsEvent)('join'));
        dispatch((0, actions_2.moveToRoom)(room?.jid));
    }, [dispatch, room]);
    const onRemoveBreakoutRoom = (0, react_1.useCallback)(() => {
        dispatch((0, actions_2.removeBreakoutRoom)(room?.jid ?? ''));
    }, [dispatch, room]);
    const onRenameBreakoutRoom = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.openDialog)(BreakoutRoomNamePrompt_1.default, {
            breakoutRoomJid: room?.jid,
            initialRoomName: room?.name
        }));
    }, [dispatch, room]);
    const onCloseBreakoutRoom = (0, react_1.useCallback)(() => {
        dispatch((0, actions_2.closeBreakoutRoom)(room?.id ?? ''));
    }, [dispatch, room]);
    const isRoomEmpty = !(room?.participants && Object.keys(room.participants).length > 0);
    const actions = [
        _overflowDrawer ? {
            accessibilityLabel: t('breakoutRooms.actions.join'),
            icon: svg_1.IconRingGroup,
            onClick: onJoinRoom,
            text: t('breakoutRooms.actions.join')
        } : null,
        !room?.isMainRoom && _isBreakoutRoomRenameAllowed ? {
            accessibilityLabel: t('breakoutRooms.actions.rename'),
            icon: svg_1.IconEdit,
            id: `rename-room-${room?.id}`,
            onClick: onRenameBreakoutRoom,
            text: t('breakoutRooms.actions.rename')
        } : null,
        !room?.isMainRoom && isLocalModerator ? {
            accessibilityLabel: isRoomEmpty ? t('breakoutRooms.actions.remove') : t('breakoutRooms.actions.close'),
            icon: svg_1.IconCloseLarge,
            id: isRoomEmpty ? `remove-room-${room?.id}` : `close-room-${room?.id}`,
            onClick: isRoomEmpty ? onRemoveBreakoutRoom : onCloseBreakoutRoom,
            text: isRoomEmpty ? t('breakoutRooms.actions.remove') : t('breakoutRooms.actions.close')
        } : null
    ].filter(Boolean);
    const lowerMenu = (0, react_1.useCallback)(() => onSelect(true), []);
    return (react_1.default.createElement(ContextMenu_1.default, { activateFocusTrap: true, entity: room, isDrawerOpen: Boolean(room), offsetTarget: offsetTarget, onClick: lowerMenu, onDrawerClose: onSelect, onMouseEnter: onEnter, onMouseLeave: onLeave },
        react_1.default.createElement(ContextMenuItemGroup_1.default, { actions: actions })));
};
exports.RoomContextMenu = RoomContextMenu;
