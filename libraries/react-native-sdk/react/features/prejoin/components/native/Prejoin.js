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
const actions_1 = require("../../../analytics/actions");
const actions_native_1 = require("../../../app/actions.native");
const actions_2 = require("../../../base/audio-only/actions");
const functions_1 = require("../../../base/conference/functions");
const functions_any_1 = require("../../../base/config/functions.any");
const actions_native_2 = require("../../../base/connection/actions.native");
const constants_1 = require("../../../base/flags/constants");
const functions_2 = require("../../../base/flags/functions");
const svg_1 = require("../../../base/icons/svg");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const functions_3 = require("../../../base/participants/functions");
const functions_4 = require("../../../base/react/functions");
const constants_2 = require("../../../base/responsive-ui/constants");
const actions_3 = require("../../../base/settings/actions");
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const Input_1 = __importDefault(require("../../../base/ui/components/native/Input"));
const constants_native_1 = require("../../../base/ui/constants.native");
const actions_4 = require("../../../display-name/actions");
const BrandingImageBackground_1 = __importDefault(require("../../../dynamic-branding/components/native/BrandingImageBackground"));
const LargeVideo_native_1 = __importDefault(require("../../../large-video/components/LargeVideo.native"));
const HeaderNavigationButton_1 = __importDefault(require("../../../mobile/navigation/components/HeaderNavigationButton"));
const rootNavigationContainerRef_1 = require("../../../mobile/navigation/rootNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const AudioMuteButton_1 = __importDefault(require("../../../toolbox/components/native/AudioMuteButton"));
const VideoMuteButton_1 = __importDefault(require("../../../toolbox/components/native/VideoMuteButton"));
const functions_5 = require("../../functions");
const utils_1 = require("../../utils");
const styles_1 = require("./styles");
const Prejoin = ({ navigation }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const isFocused = (0, native_1.useIsFocused)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const aspectRatio = (0, react_redux_1.useSelector)((state) => state['features/base/responsive-ui']?.aspectRatio);
    const localParticipant = (0, react_redux_1.useSelector)((state) => (0, functions_3.getLocalParticipant)(state));
    const isDisplayNameMandatory = (0, react_redux_1.useSelector)((state) => (0, functions_5.isDisplayNameRequired)(state));
    const isDisplayNameVisible = (0, react_redux_1.useSelector)((state) => !(0, functions_2.getFeatureFlag)(state, constants_1.PREJOIN_PAGE_HIDE_DISPLAY_NAME, false));
    const isDisplayNameReadonly = (0, react_redux_1.useSelector)(functions_any_1.isNameReadOnly);
    const roomName = (0, react_redux_1.useSelector)((state) => (0, functions_1.getConferenceName)(state));
    const roomNameEnabled = (0, react_redux_1.useSelector)((state) => (0, functions_5.isRoomNameEnabled)(state));
    const participantName = localParticipant?.name;
    const [displayName, setDisplayName] = (0, react_1.useState)(participantName || '');
    const isDisplayNameMissing = (0, react_1.useMemo)(() => !displayName && isDisplayNameMandatory, [displayName, isDisplayNameMandatory]);
    const showDisplayNameError = (0, react_1.useMemo)(() => !isDisplayNameReadonly && isDisplayNameMissing && isDisplayNameVisible, [isDisplayNameMissing, isDisplayNameReadonly, isDisplayNameVisible]);
    const showDisplayNameInput = (0, react_1.useMemo)(() => isDisplayNameVisible && (displayName || !isDisplayNameReadonly), [displayName, isDisplayNameReadonly, isDisplayNameVisible]);
    const [isJoining, setIsJoining] = (0, react_1.useState)(false);
    const onChangeDisplayName = (0, react_1.useCallback)(event => {
        const fieldValue = (0, functions_4.getFieldValue)(event);
        setDisplayName(fieldValue);
        dispatch((0, actions_3.updateSettings)({
            displayName: fieldValue
        }));
    }, [displayName]);
    const onJoin = (0, react_1.useCallback)(() => {
        setIsJoining(true);
        dispatch((0, actions_native_2.connect)());
        (0, rootNavigationContainerRef_1.navigateRoot)(routes_1.screen.conference.root);
    }, [dispatch]);
    const maybeJoin = (0, react_1.useCallback)(() => {
        if (isDisplayNameMissing) {
            dispatch((0, actions_4.openDisplayNamePrompt)({
                onPostSubmit: onJoin,
                validateInput: utils_1.hasDisplayName
            }));
        }
        else {
            onJoin();
        }
    }, [dispatch, utils_1.hasDisplayName, isDisplayNameMissing, onJoin]);
    const onJoinLowBandwidth = (0, react_1.useCallback)(() => {
        dispatch((0, actions_2.setAudioOnly)(true));
        maybeJoin();
    }, [dispatch]);
    const goBack = (0, react_1.useCallback)(() => {
        dispatch((0, actions_native_1.appNavigate)(undefined));
        return true;
    }, [dispatch]);
    const { PRIMARY, TERTIARY } = constants_native_1.BUTTON_TYPES;
    (0, react_1.useEffect)(() => {
        react_native_1.BackHandler.addEventListener('hardwareBackPress', goBack);
        dispatch((0, actions_1.setPermanentProperty)({
            wasPrejoinDisplayed: true
        }));
        return () => react_native_1.BackHandler.removeEventListener('hardwareBackPress', goBack);
    }, []); // dispatch is not in the dependancy list because we want the action to be dispatched only once when
    // the component is mounted.
    const headerLeft = () => {
        if (react_native_1.Platform.OS === 'ios') {
            return (<HeaderNavigationButton_1.default label={t('dialog.close')} onPress={goBack}/>);
        }
        return (<HeaderNavigationButton_1.default onPress={goBack} src={svg_1.IconCloseLarge}/>);
    };
    (0, react_1.useLayoutEffect)(() => {
        navigation.setOptions({
            headerLeft,
            headerTitle: t('prejoin.joinMeeting')
        });
    }, [navigation]);
    let contentWrapperStyles;
    let contentContainerStyles;
    let largeVideoContainerStyles;
    if (aspectRatio === constants_2.ASPECT_RATIO_NARROW) {
        contentWrapperStyles = styles_1.preJoinStyles.contentWrapper;
        contentContainerStyles = styles_1.preJoinStyles.contentContainer;
        largeVideoContainerStyles = styles_1.preJoinStyles.largeVideoContainer;
    }
    else {
        contentWrapperStyles = styles_1.preJoinStyles.contentWrapperWide;
        contentContainerStyles = styles_1.preJoinStyles.contentContainerWide;
        largeVideoContainerStyles = styles_1.preJoinStyles.largeVideoContainerWide;
    }
    return (<JitsiScreen_1.default addBottomPadding={false} safeAreaInsets={['right']} style={contentWrapperStyles}>
            <BrandingImageBackground_1.default />
            {isFocused
            && <react_native_1.View style={largeVideoContainerStyles}>
                    <react_native_1.View style={styles_1.preJoinStyles.conferenceInfo}>
                        {roomNameEnabled && (<react_native_1.View style={styles_1.preJoinStyles.displayRoomNameBackdrop}>
                                <react_native_1.Text numberOfLines={1} style={styles_1.preJoinStyles.preJoinRoomName}>
                                    {roomName}
                                </react_native_1.Text>
                            </react_native_1.View>)}
                    </react_native_1.View>
                    <LargeVideo_native_1.default />
                </react_native_1.View>}
            <react_native_1.View style={contentContainerStyles}>
                <react_native_1.View style={styles_1.preJoinStyles.toolboxContainer}>
                    <AudioMuteButton_1.default styles={styles_1.preJoinStyles.buttonStylesBorderless}/>
                    <VideoMuteButton_1.default styles={styles_1.preJoinStyles.buttonStylesBorderless}/>
                </react_native_1.View>
                {showDisplayNameInput && <Input_1.default customStyles={{ input: styles_1.preJoinStyles.customInput }} disabled={isDisplayNameReadonly} error={showDisplayNameError} onChange={onChangeDisplayName} placeholder={t('dialog.enterDisplayName')} value={displayName}/>}
                {showDisplayNameError && (<react_native_1.View style={styles_1.preJoinStyles.errorContainer}>
                            <react_native_1.Text style={styles_1.preJoinStyles.error}>
                                {t('prejoin.errorMissingName')}
                            </react_native_1.Text>
                        </react_native_1.View>)}
                <Button_1.default accessibilityLabel='prejoin.joinMeeting' disabled={showDisplayNameError} labelKey='prejoin.joinMeeting' onClick={isJoining ? undefined : maybeJoin} style={styles_1.preJoinStyles.joinButton} type={PRIMARY}/>
                <Button_1.default accessibilityLabel='prejoin.joinMeetingInLowBandwidthMode' disabled={showDisplayNameError} labelKey='prejoin.joinMeetingInLowBandwidthMode' onClick={isJoining ? undefined : onJoinLowBandwidth} style={styles_1.preJoinStyles.joinButton} type={TERTIARY}/>
            </react_native_1.View>
        </JitsiScreen_1.default>);
};
exports.default = Prejoin;
