"use strict";
/* eslint-disable lines-around-comment */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const material_top_tabs_1 = require("@react-navigation/material-top-tabs");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../../../base/modal/components/functions");
const actions_native_1 = require("../../../../../chat/actions.native");
// @ts-ignore
const Chat_1 = __importDefault(require("../../../../../chat/components/native/Chat"));
const actions_1 = require("../../../../../polls/actions");
const PollsPane_1 = __importDefault(require("../../../../../polls/components/native/PollsPane"));
const routes_1 = require("../../../routes");
const screenOptions_1 = require("../../../screenOptions");
const ChatTab = (0, material_top_tabs_1.createMaterialTopTabNavigator)();
const ChatAndPolls = () => {
    const clientHeight = (0, react_redux_1.useSelector)(functions_1.getClientHeight);
    const clientWidth = (0, react_redux_1.useSelector)(functions_1.getClientWidth);
    const dispatch = (0, react_redux_1.useDispatch)();
    const { isPollsTabFocused } = (0, react_redux_1.useSelector)((state) => state['features/chat']);
    const initialRouteName = isPollsTabFocused
        ? routes_1.screen.conference.chatandpolls.tab.polls
        : routes_1.screen.conference.chatandpolls.tab.chat;
    return (
    // @ts-ignore
    <ChatTab.Navigator backBehavior='none' initialLayout={{
            height: clientHeight,
            width: clientWidth
        }} initialRouteName={initialRouteName} screenOptions={screenOptions_1.chatTabBarOptions}>
            <ChatTab.Screen component={Chat_1.default} listeners={{
            tabPress: () => {
                dispatch((0, actions_native_1.setIsPollsTabFocused)(false));
            }
        }} name={routes_1.screen.conference.chatandpolls.tab.chat}/>
            <ChatTab.Screen component={PollsPane_1.default} listeners={{
            tabPress: () => {
                dispatch((0, actions_native_1.setIsPollsTabFocused)(true));
                dispatch(actions_1.resetNbUnreadPollsMessages);
            }
        }} name={routes_1.screen.conference.chatandpolls.tab.polls}/>
        </ChatTab.Navigator>);
};
exports.default = ChatAndPolls;
