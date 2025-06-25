"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const stack_1 = require("@react-navigation/stack");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const LobbyChatScreen_1 = __importDefault(require("../../../../../lobby/components/native/LobbyChatScreen"));
const LobbyScreen_1 = __importDefault(require("../../../../../lobby/components/native/LobbyScreen"));
const routes_1 = require("../../../routes");
const screenOptions_1 = require("../../../screenOptions");
const LobbyNavigationContainerRef_1 = require("../LobbyNavigationContainerRef");
const LobbyStack = (0, stack_1.createStackNavigator)();
const LobbyNavigationContainer = () => {
    const { isLobbyChatActive } = (0, react_redux_1.useSelector)((state) => state['features/chat']);
    return (<native_1.NavigationContainer independent={true} ref={LobbyNavigationContainerRef_1.lobbyNavigationContainerRef} 
    // @ts-ignore
    theme={screenOptions_1.navigationContainerTheme}>
            <LobbyStack.Navigator screenOptions={{
            presentation: 'modal'
        }}>
                <LobbyStack.Screen component={LobbyScreen_1.default} name={routes_1.screen.lobby.main} options={screenOptions_1.lobbyScreenOptions}/>
                {isLobbyChatActive
            && <LobbyStack.Screen component={LobbyChatScreen_1.default} name={routes_1.screen.lobby.chat} options={screenOptions_1.lobbyChatScreenOptions}/>}
            </LobbyStack.Navigator>
        </native_1.NavigationContainer>);
};
exports.default = LobbyNavigationContainer;
