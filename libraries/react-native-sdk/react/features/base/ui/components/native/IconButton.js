"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const styles_1 = __importDefault(require("../../../react/components/native/styles"));
const constants_native_1 = require("../../constants.native");
const BaseTheme_native_1 = __importDefault(require("../BaseTheme.native"));
const IconButton = ({ accessibilityLabel, color: iconColor, disabled, onPress, size, src, style, tapColor, type }) => {
    const { PRIMARY, SECONDARY, TERTIARY } = constants_native_1.BUTTON_TYPES;
    let color;
    let underlayColor;
    let iconButtonContainerStyles;
    if (type === PRIMARY) {
        color = BaseTheme_native_1.default.palette.icon01;
        iconButtonContainerStyles = styles_1.default.iconButtonContainerPrimary;
        underlayColor = BaseTheme_native_1.default.palette.action01;
    }
    else if (type === SECONDARY) {
        color = BaseTheme_native_1.default.palette.icon04;
        iconButtonContainerStyles = styles_1.default.iconButtonContainerSecondary;
        underlayColor = BaseTheme_native_1.default.palette.action02;
    }
    else if (type === TERTIARY) {
        color = iconColor;
        iconButtonContainerStyles = styles_1.default.iconButtonContainer;
        underlayColor = BaseTheme_native_1.default.palette.action03;
    }
    else {
        color = iconColor;
        underlayColor = tapColor;
    }
    if (disabled) {
        color = BaseTheme_native_1.default.palette.icon03;
        iconButtonContainerStyles = styles_1.default.iconButtonContainerDisabled;
        underlayColor = 'transparent';
    }
    return (<react_native_1.TouchableHighlight accessibilityLabel={accessibilityLabel} disabled={disabled} onPress={onPress} style={[
            iconButtonContainerStyles,
            style
        ]} underlayColor={underlayColor}>
            <Icon_1.default color={color} size={20 || size} src={src}/>
        </react_native_1.TouchableHighlight>);
};
exports.default = IconButton;
