"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const functions_1 = require("../../../base/participants/functions");
const SettingsNavigationContainerRef_1 = require("../../../mobile/navigation/components/settings/SettingsNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const functions_native_1 = require("../../functions.native");
const AdvancedSection_1 = __importDefault(require("./AdvancedSection"));
const ConferenceSection_1 = __importDefault(require("./ConferenceSection"));
const GeneralSection_1 = __importDefault(require("./GeneralSection"));
const LinksSection_1 = __importDefault(require("./LinksSection"));
const ModeratorSection_1 = __importDefault(require("./ModeratorSection"));
const NotificationsSection_1 = __importDefault(require("./NotificationsSection"));
const constants_1 = require("./constants");
const styles_1 = __importDefault(require("./styles"));
const SettingsView = ({ isInWelcomePage }) => {
    const { displayName } = (0, react_redux_1.useSelector)((state) => state['features/base/settings']);
    const localParticipant = (0, react_redux_1.useSelector)((state) => (0, functions_1.getLocalParticipant)(state));
    const showModeratorSettings = (0, react_redux_1.useSelector)((state) => (0, functions_native_1.shouldShowModeratorSettings)(state));
    const { visible } = (0, react_redux_1.useSelector)((state) => state['features/settings']);
    const addBottomInset = !isInWelcomePage;
    const localParticipantId = localParticipant?.id;
    const scrollBounces = Boolean(isInWelcomePage);
    if (visible !== undefined && !visible) {
        return null;
    }
    return (<JitsiScreen_1.default disableForcedKeyboardDismiss={true} safeAreaInsets={[addBottomInset && 'bottom', 'left', 'right'].filter(Boolean)} style={styles_1.default.settingsViewContainer}>
            <react_native_1.ScrollView bounces={scrollBounces}>
                <react_native_1.View style={styles_1.default.profileContainerWrapper}>
                    <react_native_1.TouchableHighlight 
    /* eslint-disable react/jsx-no-bind */
    onPress={() => (0, SettingsNavigationContainerRef_1.navigate)(routes_1.screen.settings.profile)}>
                        <react_native_1.View style={styles_1.default.profileContainer}>
                            <Avatar_1.default participantId={localParticipantId} size={constants_1.AVATAR_SIZE}/>
                            <react_native_1.Text style={styles_1.default.displayName}>
                                {displayName}
                            </react_native_1.Text>
                            <Icon_1.default size={24} src={svg_1.IconArrowRight} style={styles_1.default.profileViewArrow}/>
                        </react_native_1.View>
                    </react_native_1.TouchableHighlight>
                </react_native_1.View>
                <GeneralSection_1.default />
                {isInWelcomePage && <>
                    <react_native_paper_1.Divider style={styles_1.default.fieldSeparator}/>
                    <ConferenceSection_1.default />
                </>}
                <react_native_paper_1.Divider style={styles_1.default.fieldSeparator}/>
                <NotificationsSection_1.default />

                {showModeratorSettings
            && <>
                        <react_native_paper_1.Divider style={styles_1.default.fieldSeparator}/>
                        <ModeratorSection_1.default />
                    </>}
                <react_native_paper_1.Divider style={styles_1.default.fieldSeparator}/>
                <AdvancedSection_1.default />
                <react_native_paper_1.Divider style={styles_1.default.fieldSeparator}/>
                <LinksSection_1.default />
            </react_native_1.ScrollView>
        </JitsiScreen_1.default>);
};
exports.default = SettingsView;
