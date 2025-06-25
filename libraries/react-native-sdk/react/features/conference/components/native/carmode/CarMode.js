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
const react_native_1 = require("react-native");
const react_native_orientation_locker_1 = __importDefault(require("react-native-orientation-locker"));
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const react_redux_1 = require("react-redux");
const JitsiScreen_1 = __importDefault(require("../../../../base/modal/components/JitsiScreen"));
const LoadingIndicator_1 = __importDefault(require("../../../../base/react/components/native/LoadingIndicator"));
const TintedView_1 = __importDefault(require("../../../../base/react/components/native/TintedView"));
const functions_native_1 = require("../../../../base/tracks/functions.native");
const functions_1 = require("../../../../mobile/picture-in-picture/functions");
const actions_1 = require("../../../../video-layout/actions");
const ConferenceTimer_1 = __importDefault(require("../../ConferenceTimer"));
const functions_2 = require("../../functions");
const CarModeFooter_1 = __importDefault(require("./CarModeFooter"));
const MicrophoneButton_1 = __importDefault(require("./MicrophoneButton"));
const TitleBar_1 = __importDefault(require("./TitleBar"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements the carmode component.
 *
 * @returns { JSX.Element} - The carmode component.
 */
const CarMode = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const connecting = (0, react_redux_1.useSelector)(functions_2.isConnecting);
    const isSharing = (0, react_redux_1.useSelector)(functions_native_1.isLocalVideoTrackDesktop);
    (0, react_1.useEffect)(() => {
        dispatch((0, actions_1.setIsCarmode)(true));
        (0, functions_1.setPictureInPictureEnabled)(false);
        react_native_orientation_locker_1.default.lockToPortrait();
        return () => {
            react_native_orientation_locker_1.default.unlockAllOrientations();
            dispatch((0, actions_1.setIsCarmode)(false));
            if (!isSharing) {
                (0, functions_1.setPictureInPictureEnabled)(true);
            }
        };
    }, []);
    return (<JitsiScreen_1.default footerComponent={CarModeFooter_1.default} style={styles_1.default.conference}>
            {/*
              * The activity/loading indicator goes above everything, except
              * the toolbox/toolbars and the dialogs.
              */connecting
            && <TintedView_1.default>
                    <LoadingIndicator_1.default />
                </TintedView_1.default>}
            <react_native_1.View pointerEvents='box-none' style={styles_1.default.titleBarSafeViewColor}>
                <react_native_1.View style={styles_1.default.titleBar}>
                    <TitleBar_1.default />
                </react_native_1.View>
                <ConferenceTimer_1.default textStyle={styles_1.default.roomTimer}/>
            </react_native_1.View>
            <react_native_1.View pointerEvents='box-none' style={styles_1.default.microphoneContainer}>
                <MicrophoneButton_1.default />
            </react_native_1.View>
        </JitsiScreen_1.default>);
};
exports.default = (0, react_native_safe_area_context_1.withSafeAreaInsets)(CarMode);
