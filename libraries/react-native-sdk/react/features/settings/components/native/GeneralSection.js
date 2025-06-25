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
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const i18next_1 = __importStar(require("../../../base/i18n/i18next"));
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const actions_1 = require("../../../base/settings/actions");
const Switch_1 = __importDefault(require("../../../base/ui/components/native/Switch"));
const SettingsNavigationContainerRef_1 = require("../../../mobile/navigation/components/settings/SettingsNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const functions_1 = require("../../../prejoin/functions");
const FormRow_1 = __importDefault(require("./FormRow"));
const FormSection_1 = __importDefault(require("./FormSection"));
const styles_1 = __importDefault(require("./styles"));
const GeneralSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const { disableSelfView, userSelectedSkipPrejoin } = (0, react_redux_1.useSelector)((state) => state['features/base/settings']);
    const showPrejoinPage = !userSelectedSkipPrejoin;
    let showPrejoinSettings = (0, react_redux_1.useSelector)(functions_1.isPrejoinEnabledInConfig);
    const { language = i18next_1.DEFAULT_LANGUAGE } = i18next_1.default;
    const onSelfViewToggled = (0, react_1.useCallback)((enabled) => dispatch((0, actions_1.updateSettings)({ disableSelfView: enabled })), [dispatch, actions_1.updateSettings]);
    const onShowPejoinToggled = (0, react_1.useCallback)((enabled) => {
        dispatch((0, actions_1.updateSettings)({ userSelectedSkipPrejoin: !enabled }));
    }, [dispatch, actions_1.updateSettings]);
    const navigateToLanguageSelect = (0, react_1.useCallback)(() => {
        (0, SettingsNavigationContainerRef_1.navigate)(routes_1.screen.settings.language);
    }, [SettingsNavigationContainerRef_1.navigate, routes_1.screen]);
    // TODO:
    // Delete this line when prejoin skipping is available on mobile
    showPrejoinSettings = false;
    return (<FormSection_1.default>
            <FormRow_1.default label='videothumbnail.hideSelfView'>
                <Switch_1.default checked={Boolean(disableSelfView)} onChange={onSelfViewToggled}/>
            </FormRow_1.default>

            {showPrejoinSettings && <FormRow_1.default label='prejoin.showScreen'>
                <Switch_1.default checked={showPrejoinPage} onChange={onShowPejoinToggled}/>
            </FormRow_1.default>}

            <FormRow_1.default label='settings.language'>
                <react_native_1.View style={styles_1.default.languageButtonContainer}>
                    <react_native_1.TouchableHighlight onPress={navigateToLanguageSelect}>
                        <react_native_1.View style={styles_1.default.languageButton}>
                            <react_native_1.Text style={styles_1.default.languageText}>{t(`languages:${language}`)}</react_native_1.Text>
                            <Icon_1.default size={24} src={svg_1.IconArrowRight}/>
                        </react_native_1.View>
                    </react_native_1.TouchableHighlight>
                </react_native_1.View>
            </FormRow_1.default>
        </FormSection_1.default>);
};
exports.default = GeneralSection;
