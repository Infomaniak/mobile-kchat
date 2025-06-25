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
const actions_native_1 = require("../../../app/actions.native");
const functions_1 = require("../../../base/conference/functions");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const constants_1 = require("../../../base/responsive-ui/constants");
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const constants_native_1 = require("../../../base/ui/constants.native");
const getUnsafeRoomText_native_1 = __importDefault(require("../../../base/util/getUnsafeRoomText.native"));
const HeaderNavigationButton_1 = __importDefault(require("../../../mobile/navigation/components/HeaderNavigationButton"));
const rootNavigationContainerRef_1 = require("../../../mobile/navigation/rootNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const styles_1 = require("./styles");
const UnsafeRoomWarning = ({ navigation }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const roomName = (0, react_redux_1.useSelector)((state) => (0, functions_1.getConferenceName)(state));
    const aspectRatio = (0, react_redux_1.useSelector)((state) => state['features/base/responsive-ui']?.aspectRatio);
    const unsafeRoomText = (0, react_redux_1.useSelector)((state) => (0, getUnsafeRoomText_native_1.default)(state, t, 'prejoin'));
    const goBack = (0, react_1.useCallback)(() => {
        dispatch((0, actions_native_1.appNavigate)(undefined));
        return true;
    }, [dispatch]);
    const onProceed = (0, react_1.useCallback)(() => {
        (0, rootNavigationContainerRef_1.navigateRoot)(routes_1.screen.preJoin);
        return true;
    }, [dispatch]);
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
    let unsafeRoomContentContainer;
    if (aspectRatio === constants_1.ASPECT_RATIO_NARROW) {
        unsafeRoomContentContainer = styles_1.preJoinStyles.unsafeRoomContentContainer;
    }
    else {
        unsafeRoomContentContainer = styles_1.preJoinStyles.unsafeRoomContentContainerWide;
    }
    return (<JitsiScreen_1.default addBottomPadding={false} safeAreaInsets={['right']} style={styles_1.preJoinStyles.unsafeRoomWarningContainer}>
            <react_native_1.View style={styles_1.preJoinStyles.displayRoomNameBackdrop}>
                <react_native_1.Text numberOfLines={1} style={styles_1.preJoinStyles.preJoinRoomName}>
                    {roomName}
                </react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={unsafeRoomContentContainer}>
                <react_native_1.View style={styles_1.preJoinStyles.warningIconWrapper}>
                    <Icon_1.default src={svg_1.IconWarning} style={styles_1.preJoinStyles.warningIcon}/>
                </react_native_1.View>

                <react_native_1.Text dataDetectorType='link' style={styles_1.preJoinStyles.warningText}>
                    {unsafeRoomText}
                </react_native_1.Text>
                <Button_1.default accessibilityLabel='prejoin.proceedAnyway' disabled={false} labelKey='prejoin.proceedAnyway' onClick={onProceed} style={styles_1.preJoinStyles.joinButton} type={constants_native_1.BUTTON_TYPES.SECONDARY}/>
            </react_native_1.View>
        </JitsiScreen_1.default>);
};
exports.default = UnsafeRoomWarning;
