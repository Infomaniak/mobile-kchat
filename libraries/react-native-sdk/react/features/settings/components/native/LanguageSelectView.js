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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const i18next_1 = __importStar(require("../../../base/i18n/i18next"));
const svg_1 = require("../../../base/icons/svg");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const HeaderNavigationButton_1 = __importDefault(require("../../../mobile/navigation/components/HeaderNavigationButton"));
const SettingsNavigationContainerRef_1 = require("../../../mobile/navigation/components/settings/SettingsNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const styles_1 = __importDefault(require("./styles"));
const LanguageSelectView = ({ isInWelcomePage }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const navigation = (0, native_1.useNavigation)();
    const { language: currentLanguage = i18next_1.DEFAULT_LANGUAGE } = i18next_1.default;
    const setLanguage = (0, react_1.useCallback)(language => () => {
        i18next_1.default.changeLanguage(language);
        (0, SettingsNavigationContainerRef_1.navigate)(routes_1.screen.settings.main);
    }, [i18next_1.default]);
    const headerLeft = () => (<HeaderNavigationButton_1.default color={BaseTheme_native_1.default.palette.link01} onPress={SettingsNavigationContainerRef_1.goBack} src={svg_1.IconArrowLeft} style={styles_1.default.backBtn} twoActions={true}/>);
    (0, react_1.useLayoutEffect)(() => {
        navigation.setOptions({
            headerLeft
        });
    }, [navigation]);
    return (<JitsiScreen_1.default disableForcedKeyboardDismiss={true} 
    // @ts-ignore
    safeAreaInsets={[!isInWelcomePage && 'bottom', 'left', 'right'].filter(Boolean)} style={styles_1.default.settingsViewContainer}>
            <react_native_1.ScrollView bounces={isInWelcomePage} contentContainerStyle={styles_1.default.profileView}>
                {i18next_1.LANGUAGES.map(language => (<react_native_1.TouchableHighlight disabled={currentLanguage === language} key={language} onPress={setLanguage(language)}>
                            <react_native_1.View style={styles_1.default.languageOption}>
                                <react_native_1.Text style={[
                styles_1.default.text,
                styles_1.default.fieldLabelText,
                currentLanguage === language && styles_1.default.selectedLanguage
            ]}>
                                    {t(`languages:${language}`)}
                                </react_native_1.Text>
                            </react_native_1.View>
                        </react_native_1.TouchableHighlight>))}
            </react_native_1.ScrollView>
        </JitsiScreen_1.default>);
};
exports.default = LanguageSelectView;
