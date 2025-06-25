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
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/dialog/actions");
const CollapsibleList_1 = __importDefault(require("../../../participants-pane/components/native/CollapsibleList"));
const BreakoutRoomContextMenu_1 = __importDefault(require("./BreakoutRoomContextMenu"));
const BreakoutRoomParticipantItem_1 = __importDefault(require("./BreakoutRoomParticipantItem"));
/**
 * Returns a key for a passed item of the list.
 *
 * @param {Object} item - The participant.
 * @returns {string} - The user ID.
 */
function _keyExtractor(item) {
    return item.jid;
}
const CollapsibleRoom = ({ room, roomId }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const _openContextMenu = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.openSheet)(BreakoutRoomContextMenu_1.default, { room }));
    }, [room]);
    const roomParticipantsNr = Object.values(room.participants || {}).length;
    const title = `${room.name
        || t('breakoutRooms.mainRoom')} (${roomParticipantsNr})`;
    return (<CollapsibleList_1.default onLongPress={_openContextMenu} title={title}>
            <react_native_1.FlatList data={Object.values(room.participants || {})} keyExtractor={_keyExtractor} 
    /* @ts-ignore */
    listKey={roomId} 
    // eslint-disable-next-line react/jsx-no-bind, no-confusing-arrow
    renderItem={({ item: participant }) => (<BreakoutRoomParticipantItem_1.default item={participant} room={room}/>)} scrollEnabled={false} showsHorizontalScrollIndicator={false} windowSize={2}/>
        </CollapsibleList_1.default>);
};
exports.CollapsibleRoom = CollapsibleRoom;
