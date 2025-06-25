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
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const functions_1 = require("../../../base/participants/functions");
const functions_2 = require("../../../base/redux/functions");
const functions_3 = require("../../functions");
const AddBreakoutRoomButton_1 = __importDefault(require("./AddBreakoutRoomButton"));
const AutoAssignButton_1 = __importDefault(require("./AutoAssignButton"));
const CollapsibleRoom_1 = require("./CollapsibleRoom");
const LeaveBreakoutRoomButton_1 = __importDefault(require("./LeaveBreakoutRoomButton"));
const styles_1 = __importDefault(require("./styles"));
const BreakoutRooms = () => {
    const currentRoomId = (0, react_redux_1.useSelector)(functions_3.getCurrentRoomId);
    const inBreakoutRoom = (0, react_redux_1.useSelector)(functions_3.isInBreakoutRoom);
    const isBreakoutRoomsSupported = (0, react_redux_1.useSelector)((state) => state['features/base/conference'].conference?.getBreakoutRooms()?.isSupported());
    const isLocalModerator = (0, react_redux_1.useSelector)(functions_1.isLocalParticipantModerator);
    const keyExtractor = (0, react_1.useCallback)((e, i) => i.toString(), []);
    const rooms = Object.values((0, react_redux_1.useSelector)(functions_3.getBreakoutRooms, functions_2.equals))
        .filter(room => room.id !== currentRoomId)
        .sort((p1, p2) => (p1?.name || '').localeCompare(p2?.name || ''));
    const showAddBreakoutRoom = (0, react_redux_1.useSelector)(functions_3.isAddBreakoutRoomButtonVisible);
    const showAutoAssign = (0, react_redux_1.useSelector)(functions_3.isAutoAssignParticipantsVisible);
    return (<JitsiScreen_1.default footerComponent={isLocalModerator && showAddBreakoutRoom
            ? AddBreakoutRoomButton_1.default : undefined} style={styles_1.default.breakoutRoomsContainer}>

            {/* Fixes warning regarding nested lists */}
            <react_native_1.FlatList 
    /* eslint-disable react/jsx-no-bind */
    ListHeaderComponent={() => (<>
                        {showAutoAssign && <AutoAssignButton_1.default />}
                        {inBreakoutRoom && <LeaveBreakoutRoomButton_1.default />}
                        {isBreakoutRoomsSupported
                && rooms.map(room => (<CollapsibleRoom_1.CollapsibleRoom key={room.id} room={room} roomId={room.id}/>))}
                    </>)} data={[]} keyExtractor={keyExtractor} renderItem={null} windowSize={2}/>
        </JitsiScreen_1.default>);
};
exports.default = BreakoutRooms;
