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
Object.defineProperty(exports, "__esModule", { value: true });
const elements_1 = require("@react-navigation/elements");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const JitsiKeyboardAvoidingView = ({ addBottomPadding = true, children, contentContainerStyle, disableForcedKeyboardDismiss, hasBottomTextInput, hasExtraHeaderHeight, style }) => {
    const headerHeight = (0, elements_1.useHeaderHeight)();
    const insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    const [bottomPadding, setBottomPadding] = (0, react_1.useState)(insets.bottom);
    (0, react_1.useEffect)(() => {
        // This useEffect is needed because insets are undefined at first for some reason
        // https://github.com/th3rdwave/react-native-safe-area-context/issues/54
        setBottomPadding(insets.bottom);
    }, [insets.bottom]);
    const extraHeaderHeight = hasExtraHeaderHeight ? headerHeight : 0;
    const extraBottomPadding = addBottomPadding ? bottomPadding : 0;
    const noNotchDevicePadding = extraBottomPadding || 10;
    const iosVerticalOffset = headerHeight + noNotchDevicePadding + extraHeaderHeight;
    const androidVerticalOffset = hasBottomTextInput
        ? headerHeight + Number(react_native_1.StatusBar.currentHeight) : headerHeight;
    // Tells the view what to do with taps
    const shouldSetResponse = (0, react_1.useCallback)(() => !disableForcedKeyboardDismiss, []);
    const onRelease = (0, react_1.useCallback)(() => react_native_1.Keyboard.dismiss(), []);
    return (react_1.default.createElement(react_native_1.KeyboardAvoidingView, { behavior: react_native_1.Platform.OS === 'ios' ? 'padding' : 'height', contentContainerStyle: contentContainerStyle, enabled: true, keyboardVerticalOffset: react_native_1.Platform.OS === 'ios'
            ? iosVerticalOffset
            : androidVerticalOffset, onResponderRelease: onRelease, onStartShouldSetResponder: shouldSetResponse, style: style }, children));
};
exports.default = JitsiKeyboardAvoidingView;
