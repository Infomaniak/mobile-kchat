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
const bottom_tabs_1 = require("@react-navigation/bottom-tabs");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const CalendarList_native_1 = __importDefault(require("../../../../../calendar-sync/components/CalendarList.native"));
const functions_native_1 = require("../../../../../calendar-sync/functions.native");
const RecentList_native_1 = __importDefault(require("../../../../../recent-list/components/RecentList.native"));
const constants_1 = require("../../../../../welcome/constants");
const routes_1 = require("../../../routes");
const SettingsNavigationContainer_1 = __importDefault(require("../../settings/components/SettingsNavigationContainer"));
const WelcomePage = (0, bottom_tabs_1.createBottomTabNavigator)();
const WelcomePageTabs = ({ disabled, onListContainerPress, onSettingsScreenFocused }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const RecentListScreen = (0, react_1.useCallback)(() => (<RecentList_native_1.default disabled={disabled} onListContainerPress={onListContainerPress}/>), []);
    const calendarEnabled = (0, react_redux_1.useSelector)(functions_native_1.isCalendarEnabled);
    const CalendarListScreen = (0, react_1.useCallback)(() => (<CalendarList_native_1.default disabled={disabled}/>), []);
    const SettingsScreen = (0, react_1.useCallback)(() => (<SettingsNavigationContainer_1.default isInWelcomePage={true}/>), []);
    return (<WelcomePage.Navigator backBehavior={'none'} screenOptions={{
            ...constants_1.tabBarOptions,
            headerShown: false
        }}>
            <WelcomePage.Screen listeners={{
            tabPress: () => {
                onSettingsScreenFocused(false);
            }
        }} name={routes_1.screen.welcome.tabs.recent} options={{
            ...constants_1.recentListTabBarOptions,
            title: t('welcomepage.recentList')
        }}>
                {RecentListScreen}
            </WelcomePage.Screen>
            {calendarEnabled
            && <WelcomePage.Screen listeners={{
                    tabPress: () => {
                        onSettingsScreenFocused(false);
                    }
                }} name={routes_1.screen.welcome.tabs.calendar} options={{
                    ...constants_1.calendarListTabBarOptions,
                    title: t('welcomepage.calendar')
                }}>
                {CalendarListScreen}
            </WelcomePage.Screen>}
            <WelcomePage.Screen listeners={{
            tabPress: () => {
                onSettingsScreenFocused(true);
            }
        }} name={routes_1.screen.settings.main} options={{
            ...constants_1.settingsTabBarOptions,
            title: t('welcomepage.settings')
        }}>
                {SettingsScreen}
            </WelcomePage.Screen>
        </WelcomePage.Navigator>);
};
exports.default = WelcomePageTabs;
