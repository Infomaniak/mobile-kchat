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
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../../analytics/functions");
const constants_1 = require("../../../../base/flags/constants");
const functions_2 = require("../../../../base/flags/functions");
const Icon_1 = __importDefault(require("../../../../base/icons/components/Icon"));
const svg_1 = require("../../../../base/icons/svg");
const constants_2 = require("../../../../base/media/constants");
const functions_3 = require("../../../../base/tracks/functions");
const functions_any_1 = require("../../../../toolbox/functions.any");
const actions_1 = require("../../../../video-menu/actions");
const styles_1 = __importDefault(require("./styles"));
const LONG_PRESS = 'long.press';
/**
 * Implements a round audio mute/unmute button of a custom size.
 *
 * @returns {JSX.Element} - The audio mute round button.
 */
const MicrophoneButton = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const audioMuted = (0, react_redux_1.useSelector)((state) => (0, functions_3.isLocalTrackMuted)(state['features/base/tracks'], constants_2.MEDIA_TYPE.AUDIO));
    const disabled = (0, react_redux_1.useSelector)(functions_any_1.isAudioMuteButtonDisabled);
    const enabledFlag = (0, react_redux_1.useSelector)((state) => (0, functions_2.getFeatureFlag)(state, constants_1.AUDIO_MUTE_BUTTON_ENABLED, true));
    const [longPress, setLongPress] = (0, react_1.useState)(false);
    if (!enabledFlag) {
        return null;
    }
    const onPressIn = (0, react_1.useCallback)(() => {
        !disabled && dispatch((0, actions_1.muteLocal)(!audioMuted, constants_2.MEDIA_TYPE.AUDIO));
    }, [audioMuted, disabled]);
    const onLongPress = (0, react_1.useCallback)(() => {
        if (!disabled && !audioMuted) {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('push.to.talk', AnalyticsEvents_1.ACTION_SHORTCUT_PRESSED, {}, LONG_PRESS));
            setLongPress(true);
        }
    }, [audioMuted, disabled, setLongPress]);
    const onPressOut = (0, react_1.useCallback)(() => {
        if (longPress) {
            setLongPress(false);
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createShortcutEvent)('push.to.talk', AnalyticsEvents_1.ACTION_SHORTCUT_RELEASED, {}, LONG_PRESS));
            dispatch((0, actions_1.muteLocal)(true, constants_2.MEDIA_TYPE.AUDIO));
        }
    }, [longPress, setLongPress]);
    return (<react_native_1.TouchableOpacity onLongPress={onLongPress} onPressIn={onPressIn} onPressOut={onPressOut}>
            <react_native_1.View style={[
            styles_1.default.microphoneStyles.container,
            !audioMuted && styles_1.default.microphoneStyles.unmuted
        ]}>
                <react_native_1.View style={styles_1.default.microphoneStyles.iconContainer}>
                    <Icon_1.default src={audioMuted ? svg_1.IconMicSlash : svg_1.IconMic} style={styles_1.default.microphoneStyles.icon}/>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.TouchableOpacity>);
};
exports.default = MicrophoneButton;
