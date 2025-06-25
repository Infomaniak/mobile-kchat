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
const native_1 = require("@react-navigation/native");
const stack_1 = require("@react-navigation/stack");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const DialInSummary_1 = __importDefault(require("../../../invite/components/dial-in-summary/native/DialInSummary"));
const Prejoin_1 = __importDefault(require("../../../prejoin/components/native/Prejoin"));
const UnsafeRoomWarning_1 = __importDefault(require("../../../prejoin/components/native/UnsafeRoomWarning"));
const functions_1 = require("../../../prejoin/functions");
// eslint-disable-next-line
// @ts-ignore
const WelcomePage_1 = __importDefault(require("../../../welcome/components/WelcomePage"));
const functions_2 = require("../../../welcome/functions");
const actionTypes_1 = require("../actionTypes");
const rootNavigationContainerRef_1 = require("../rootNavigationContainerRef");
const routes_1 = require("../routes");
const screenOptions_1 = require("../screenOptions");
const ConnectingPage_1 = __importDefault(require("./ConnectingPage"));
const ConferenceNavigationContainer_1 = __importDefault(require("./conference/components/ConferenceNavigationContainer"));
const RootStack = (0, stack_1.createStackNavigator)();
const RootNavigationContainer = ({ dispatch, isUnsafeRoomWarningAvailable, isWelcomePageAvailable }) => {
    const initialRouteName = isWelcomePageAvailable
        ? routes_1.screen.welcome.main : routes_1.screen.connecting;
    const onReady = (0, react_1.useCallback)(() => {
        dispatch({
            type: actionTypes_1._ROOT_NAVIGATION_READY,
            ready: true
        });
    }, [dispatch]);
    return (<native_1.NavigationContainer independent={true} onReady={onReady} ref={rootNavigationContainerRef_1.rootNavigationRef} theme={screenOptions_1.navigationContainerTheme}>
            <react_native_1.StatusBar animated={true} backgroundColor='transparent' barStyle={'light-content'} translucent={true}/>
            <RootStack.Navigator initialRouteName={initialRouteName}>
                {isWelcomePageAvailable
            && <>
                            <RootStack.Screen // @ts-ignore
             component={WelcomePage_1.default} name={routes_1.screen.welcome.main} options={screenOptions_1.welcomeScreenOptions}/>
                            <RootStack.Screen 
            // @ts-ignore
            component={DialInSummary_1.default} name={routes_1.screen.dialInSummary} options={screenOptions_1.dialInSummaryScreenOptions}/>
                        </>}
                <RootStack.Screen component={ConnectingPage_1.default} name={routes_1.screen.connecting} options={screenOptions_1.connectingScreenOptions}/>
                <RootStack.Screen component={Prejoin_1.default} name={routes_1.screen.preJoin} options={screenOptions_1.preJoinScreenOptions}/>
                {isUnsafeRoomWarningAvailable
            && <RootStack.Screen component={UnsafeRoomWarning_1.default} name={routes_1.screen.unsafeRoomWarning} options={screenOptions_1.unsafeMeetingScreenOptions}/>}
                <RootStack.Screen component={ConferenceNavigationContainer_1.default} name={routes_1.screen.conference.root} options={screenOptions_1.conferenceNavigationContainerScreenOptions}/>
            </RootStack.Navigator>
        </native_1.NavigationContainer>);
};
/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function mapStateToProps(state) {
    return {
        isUnsafeRoomWarningAvailable: (0, functions_1.isUnsafeRoomWarningEnabled)(state),
        isWelcomePageAvailable: (0, functions_2.isWelcomePageEnabled)(state)
    };
}
exports.default = (0, react_redux_1.connect)(mapStateToProps)(RootNavigationContainer);
