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
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const actions_1 = require("../../../base/dialog/actions");
const BottomSheet_1 = __importDefault(require("../../../base/dialog/components/native/BottomSheet"));
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const functions_2 = require("../../../base/participants/functions");
const styles_1 = __importDefault(require("../../../participants-pane/components/native/styles"));
const functions_3 = require("../../../participants-pane/functions");
const types_1 = require("../../../participants-pane/types");
const actions_2 = require("../../actions");
const functions_4 = require("../../functions");
const BreakoutRoomNamePrompt_1 = __importDefault(require("./BreakoutRoomNamePrompt"));
/**
 * An array with all possible breakout rooms actions.
 */
const ALL_ACTIONS = [types_1.BREAKOUT_CONTEXT_MENU_ACTIONS.JOIN, types_1.BREAKOUT_CONTEXT_MENU_ACTIONS.REMOVE, types_1.BREAKOUT_CONTEXT_MENU_ACTIONS.RENAME];
const BreakoutRoomContextMenu = ({ room, actions = ALL_ACTIONS }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const isLocalModerator = (0, react_redux_1.useSelector)(functions_2.isLocalParticipantModerator);
    const { hideJoinRoomButton } = (0, react_redux_1.useSelector)(functions_4.getBreakoutRoomsConfig);
    const _isBreakoutRoomRenameAllowed = (0, react_redux_1.useSelector)(functions_3.isBreakoutRoomRenameAllowed);
    const { t } = (0, react_i18next_1.useTranslation)();
    const onJoinRoom = (0, react_1.useCallback)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createBreakoutRoomsEvent)('join'));
        dispatch((0, actions_2.moveToRoom)(room.jid));
        dispatch((0, actions_1.hideSheet)());
    }, [dispatch, room]);
    const onRemoveBreakoutRoom = (0, react_1.useCallback)(() => {
        dispatch((0, actions_2.removeBreakoutRoom)(room.jid));
        dispatch((0, actions_1.hideSheet)());
    }, [dispatch, room]);
    const onRenameBreakoutRoom = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.openDialog)(BreakoutRoomNamePrompt_1.default, {
            breakoutRoomJid: room.jid,
            initialRoomName: room.name
        }));
        dispatch((0, actions_1.hideSheet)());
    }, [dispatch, room]);
    const onCloseBreakoutRoom = (0, react_1.useCallback)(() => {
        dispatch((0, actions_2.closeBreakoutRoom)(room.id));
        dispatch((0, actions_1.hideSheet)());
    }, [dispatch, room]);
    return (<BottomSheet_1.default addScrollViewPadding={false} showSlidingView={true}>
            {!hideJoinRoomButton && actions.includes(types_1.BREAKOUT_CONTEXT_MENU_ACTIONS.JOIN) && (<react_native_1.TouchableOpacity onPress={onJoinRoom} style={styles_1.default.contextMenuItem}>
                        <Icon_1.default size={24} src={svg_1.IconRingGroup}/>
                        <react_native_paper_1.Text style={styles_1.default.contextMenuItemText}>{t('breakoutRooms.actions.join')}</react_native_paper_1.Text>
                    </react_native_1.TouchableOpacity>)}
            {!room?.isMainRoom && actions.includes(types_1.BREAKOUT_CONTEXT_MENU_ACTIONS.RENAME) && _isBreakoutRoomRenameAllowed
            && <react_native_1.TouchableOpacity onPress={onRenameBreakoutRoom} style={styles_1.default.contextMenuItem}>
                    <Icon_1.default size={24} src={svg_1.IconEdit}/>
                    <react_native_paper_1.Text style={styles_1.default.contextMenuItemText}>{t('breakoutRooms.actions.rename')}</react_native_paper_1.Text>
                </react_native_1.TouchableOpacity>}
            {!room?.isMainRoom && isLocalModerator && actions.includes(types_1.BREAKOUT_CONTEXT_MENU_ACTIONS.REMOVE)
            && (room?.participants && Object.keys(room.participants).length > 0
                ? <react_native_1.TouchableOpacity onPress={onCloseBreakoutRoom} style={styles_1.default.contextMenuItem}>
                        <Icon_1.default size={24} src={svg_1.IconCloseLarge}/>
                        <react_native_paper_1.Text style={styles_1.default.contextMenuItemText}>{t('breakoutRooms.actions.close')}</react_native_paper_1.Text>
                    </react_native_1.TouchableOpacity>
                : <react_native_1.TouchableOpacity onPress={onRemoveBreakoutRoom} style={styles_1.default.contextMenuItem}>
                        <Icon_1.default size={24} src={svg_1.IconCloseLarge}/>
                        <react_native_paper_1.Text style={styles_1.default.contextMenuItemText}>{t('breakoutRooms.actions.remove')}</react_native_paper_1.Text>
                    </react_native_1.TouchableOpacity>)}
        </BottomSheet_1.default>);
};
exports.default = BreakoutRoomContextMenu;
