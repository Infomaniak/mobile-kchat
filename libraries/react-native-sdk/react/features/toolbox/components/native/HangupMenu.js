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
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const actions_1 = require("../../../app/actions");
const ColorSchemeRegistry_1 = __importDefault(require("../../../base/color-scheme/ColorSchemeRegistry"));
const actions_2 = require("../../../base/conference/actions");
const actions_3 = require("../../../base/dialog/actions");
const BottomSheet_1 = __importDefault(require("../../../base/dialog/components/native/BottomSheet"));
const constants_1 = require("../../../base/participants/constants");
const functions_2 = require("../../../base/participants/functions");
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const constants_native_1 = require("../../../base/ui/constants.native");
const actions_4 = require("../../../breakout-rooms/actions");
const functions_3 = require("../../../breakout-rooms/functions");
/**
 * Menu presenting options to leave a room or meeting and to end meeting.
 *
 * @returns {JSX.Element} - The hangup menu.
 */
function HangupMenu() {
    const dispatch = (0, react_redux_1.useDispatch)();
    const _styles = (0, react_redux_1.useSelector)((state) => ColorSchemeRegistry_1.default.get(state, 'Toolbox'));
    const inBreakoutRoom = (0, react_redux_1.useSelector)(functions_3.isInBreakoutRoom);
    const isModerator = (0, react_redux_1.useSelector)((state) => (0, functions_2.getLocalParticipant)(state)?.role === constants_1.PARTICIPANT_ROLE.MODERATOR);
    const { DESTRUCTIVE, SECONDARY } = constants_native_1.BUTTON_TYPES;
    const handleEndConference = (0, react_1.useCallback)(() => {
        dispatch((0, actions_3.hideSheet)());
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('endmeeting'));
        dispatch((0, actions_2.endConference)());
    }, [actions_3.hideSheet]);
    const handleLeaveConference = (0, react_1.useCallback)(() => {
        dispatch((0, actions_3.hideSheet)());
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('hangup'));
        dispatch((0, actions_1.appNavigate)(undefined));
    }, [actions_3.hideSheet]);
    const handleLeaveBreakoutRoom = (0, react_1.useCallback)(() => {
        dispatch((0, actions_3.hideSheet)());
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createBreakoutRoomsEvent)('leave'));
        dispatch((0, actions_4.moveToRoom)());
    }, [actions_3.hideSheet]);
    return (<BottomSheet_1.default>
            <react_native_1.View style={_styles.hangupMenuContainer}>
                {isModerator && <Button_1.default accessibilityLabel='toolbar.endConference' labelKey='toolbar.endConference' onClick={handleEndConference} style={_styles.hangupButton} type={DESTRUCTIVE}/>}
                <Button_1.default accessibilityLabel='toolbar.leaveConference' labelKey='toolbar.leaveConference' onClick={handleLeaveConference} style={_styles.hangupButton} type={SECONDARY}/>
                {inBreakoutRoom && <Button_1.default accessibilityLabel='breakoutRooms.actions.leaveBreakoutRoom' labelKey='breakoutRooms.actions.leaveBreakoutRoom' onClick={handleLeaveBreakoutRoom} style={_styles.hangupButton} type={SECONDARY}/>}
            </react_native_1.View>
        </BottomSheet_1.default>);
}
exports.default = HangupMenu;
