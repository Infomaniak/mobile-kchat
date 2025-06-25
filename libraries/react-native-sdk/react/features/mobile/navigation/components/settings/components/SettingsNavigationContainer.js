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
const react_i18next_1 = require("react-i18next");
const LanguageSelectView_1 = __importDefault(require("../../../../../settings/components/native/LanguageSelectView"));
const ProfileView_1 = __importDefault(require("../../../../../settings/components/native/ProfileView"));
const SettingsView_1 = __importDefault(require("../../../../../settings/components/native/SettingsView"));
const routes_1 = require("../../../routes");
const screenOptions_1 = require("../../../screenOptions");
const SettingsNavigationContainerRef_1 = require("../SettingsNavigationContainerRef");
const SettingsStack = (0, stack_1.createStackNavigator)();
const SettingsNavigationContainer = ({ isInWelcomePage }) => {
    const baseSettingsScreenOptions = isInWelcomePage ? screenOptions_1.welcomeScreenOptions : screenOptions_1.settingsScreenOptions;
    const { t } = (0, react_i18next_1.useTranslation)();
    const SettingsScreen = (0, react_1.useCallback)(() => (<SettingsView_1.default isInWelcomePage={isInWelcomePage}/>), []);
    const ProfileScreen = (0, react_1.useCallback)(() => (<ProfileView_1.default isInWelcomePage={isInWelcomePage}/>), []);
    const LanguageSelectScreen = (0, react_1.useCallback)(() => (<LanguageSelectView_1.default isInWelcomePage={isInWelcomePage}/>), []);
    return (<native_1.NavigationContainer independent={true} ref={SettingsNavigationContainerRef_1.settingsNavigationContainerRef} theme={screenOptions_1.navigationContainerTheme}>
            <SettingsStack.Navigator initialRouteName={routes_1.screen.settings.main}>
                <SettingsStack.Screen name={routes_1.screen.settings.main} options={{
            ...baseSettingsScreenOptions,
            title: t('settings.title')
        }}>
                    {SettingsScreen}
                </SettingsStack.Screen>
                <SettingsStack.Screen component={ProfileScreen} name={routes_1.screen.settings.profile} options={{
            ...screenOptions_1.profileSettingsScreenOptions,
            title: t('settingsView.profileSection')
        }}/>
                <SettingsStack.Screen component={LanguageSelectScreen} name={routes_1.screen.settings.language} options={{
            ...screenOptions_1.languageSelectScreenOptions,
            title: t('settings.language')
        }}/>
            </SettingsStack.Navigator>
        </native_1.NavigationContainer>);
};
exports.default = SettingsNavigationContainer;
