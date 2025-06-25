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
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/participants/functions");
const actions_native_1 = require("../../../participants-pane/actions.native");
const ParticipantItem_1 = __importDefault(require("../../../participants-pane/components/native/ParticipantItem"));
const BreakoutRoomParticipantItem = ({ item, room }) => {
    const { defaultRemoteDisplayName = '' } = (0, react_redux_1.useSelector)((state) => state['features/base/config']);
    const moderator = (0, react_redux_1.useSelector)(functions_1.isLocalParticipantModerator);
    const dispatch = (0, react_redux_1.useDispatch)();
    const onPress = (0, react_1.useCallback)(() => {
        if (moderator) {
            dispatch((0, actions_native_1.showRoomParticipantMenu)(room, item.jid, item.displayName));
        }
    }, [moderator, room, item]);
    return (<ParticipantItem_1.default displayName={item.displayName || defaultRemoteDisplayName} isModerator={(0, functions_1.isParticipantModerator)(item)} key={item.jid} onPress={onPress} participantID={item.jid}/>);
};
exports.default = BreakoutRoomParticipantItem;
