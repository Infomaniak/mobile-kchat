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
const react_redux_1 = require("react-redux");
const actions_native_1 = require("../../../authentication/actions.native");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const svg_1 = require("../../../base/icons/svg");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const functions_1 = require("../../../base/participants/functions");
const actions_1 = require("../../../base/settings/actions");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const Input_1 = __importDefault(require("../../../base/ui/components/native/Input"));
const constants_native_1 = require("../../../base/ui/constants.native");
const HeaderNavigationButton_1 = __importDefault(require("../../../mobile/navigation/components/HeaderNavigationButton"));
const SettingsNavigationContainerRef_1 = require("../../../mobile/navigation/components/settings/SettingsNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const FormSection_1 = __importDefault(require("./FormSection"));
const constants_1 = require("./constants");
const styles_1 = __importDefault(require("./styles"));
const ProfileView = ({ isInWelcomePage }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const navigation = (0, native_1.useNavigation)();
    const { displayName: reduxDisplayName, email: reduxEmail } = (0, react_redux_1.useSelector)((state) => state['features/base/settings']);
    const participant = (0, react_redux_1.useSelector)((state) => (0, functions_1.getLocalParticipant)(state));
    const { locationURL } = (0, react_redux_1.useSelector)((state) => state['features/base/connection']);
    const [displayName, setDisplayName] = (0, react_1.useState)(reduxDisplayName);
    const [email, setEmail] = (0, react_1.useState)(reduxEmail);
    const { authLogin: isAutenticated } = (0, react_redux_1.useSelector)((state) => state['features/base/conference']);
    const onDisplayNameChanged = (0, react_1.useCallback)(newDisplayName => {
        setDisplayName(newDisplayName);
    }, [setDisplayName]);
    const onEmailChanged = (0, react_1.useCallback)(newEmail => {
        setEmail(newEmail);
    }, [setEmail]);
    const onApplySettings = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.updateSettings)({
            displayName,
            email
        }));
        (0, SettingsNavigationContainerRef_1.navigate)(routes_1.screen.settings.main);
    }, [dispatch, actions_1.updateSettings, email, displayName]);
    const onLogin = (0, react_1.useCallback)(() => {
        dispatch((0, actions_native_1.login)());
    }, [dispatch]);
    const onLogout = (0, react_1.useCallback)(() => {
        dispatch((0, actions_native_1.logout)());
    }, [dispatch]);
    const headerLeft = () => (<HeaderNavigationButton_1.default color={BaseTheme_native_1.default.palette.link01} onPress={SettingsNavigationContainerRef_1.goBack} src={svg_1.IconArrowLeft} style={styles_1.default.backBtn} twoActions={true}/>);
    const headerRight = () => {
        if (isAutenticated) {
            return (<HeaderNavigationButton_1.default label={t('toolbar.logout')} onPress={onLogout} style={styles_1.default.logBtn} twoActions={true}/>);
        }
        return (<HeaderNavigationButton_1.default label={t('toolbar.login')} onPress={onLogin} style={styles_1.default.logBtn} twoActions={true}/>);
    };
    (0, react_1.useLayoutEffect)(() => {
        navigation.setOptions({
            headerLeft,
            headerRight: !isInWelcomePage
                && !locationURL?.hostname?.includes('8x8.vc')
                && headerRight
        });
    }, [navigation]);
    return (<JitsiScreen_1.default disableForcedKeyboardDismiss={true} 
    // @ts-ignore
    safeAreaInsets={[!isInWelcomePage && 'bottom', 'left', 'right'].filter(Boolean)} style={styles_1.default.settingsViewContainer}>
            <react_native_1.ScrollView bounces={isInWelcomePage} contentContainerStyle={styles_1.default.profileView}>
                <react_native_1.View>
                    <react_native_1.View style={styles_1.default.avatarContainer}>
                        <Avatar_1.default participantId={participant?.id} size={constants_1.AVATAR_SIZE}/>
                    </react_native_1.View>
                    <FormSection_1.default>
                        <Input_1.default customStyles={{ container: styles_1.default.customContainer }} label={t('settingsView.displayName')} onChange={onDisplayNameChanged} placeholder={t('settingsView.displayNamePlaceholderText')} textContentType={'name'} // iOS only
     value={displayName ?? ''}/>
                        <Input_1.default autoCapitalize='none' customStyles={{ container: styles_1.default.customContainer }} keyboardType={'email-address'} label={t('settingsView.email')} onChange={onEmailChanged} placeholder={t('settingsView.emailPlaceholderText')} textContentType={'emailAddress'} // iOS only
     value={email ?? ''}/>
                        <react_native_1.Text style={styles_1.default.gavatarMessageContainer}>
                            {t('settingsView.gavatarMessage')}
                        </react_native_1.Text>
                    </FormSection_1.default>
                </react_native_1.View>
                <Button_1.default accessibilityLabel={t('settingsView.apply')} labelKey={'settingsView.apply'} onClick={onApplySettings} style={styles_1.default.applyProfileSettingsButton} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>
            </react_native_1.ScrollView>
        </JitsiScreen_1.default>);
};
exports.default = ProfileView;
