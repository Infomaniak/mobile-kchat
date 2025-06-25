"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
const constants_native_1 = require("../../constants.native");
const BaseTheme_native_1 = __importDefault(require("../BaseTheme.native"));
const buttonStyles_1 = __importDefault(require("./buttonStyles"));
const Button = ({ accessibilityLabel, color: buttonColor, contentStyle, disabled, icon, labelKey, labelStyle, mode = constants_native_1.BUTTON_MODES.CONTAINED, onClick: onPress, style, type }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { DESTRUCTIVE, PRIMARY, SECONDARY, TERTIARY } = constants_native_1.BUTTON_TYPES;
    const { CONTAINED, TEXT } = constants_native_1.BUTTON_MODES;
    let buttonLabelStyles;
    let buttonStyles;
    let color;
    if (type === PRIMARY) {
        buttonLabelStyles = mode === TEXT
            ? buttonStyles_1.default.buttonLabelPrimaryText
            : buttonStyles_1.default.buttonLabelPrimary;
        color = mode === CONTAINED && BaseTheme_native_1.default.palette.action01;
    }
    else if (type === SECONDARY) {
        buttonLabelStyles = buttonStyles_1.default.buttonLabelSecondary;
        color = mode === CONTAINED && BaseTheme_native_1.default.palette.action02;
    }
    else if (type === DESTRUCTIVE) {
        buttonLabelStyles = mode === TEXT
            ? buttonStyles_1.default.buttonLabelDestructiveText
            : buttonStyles_1.default.buttonLabelDestructive;
        color = mode === CONTAINED && BaseTheme_native_1.default.palette.actionDanger;
    }
    else {
        color = buttonColor;
        buttonLabelStyles = buttonStyles_1.default.buttonLabel;
    }
    if (disabled) {
        buttonLabelStyles = buttonStyles_1.default.buttonLabelDisabled;
        buttonStyles = buttonStyles_1.default.buttonDisabled;
    }
    else {
        buttonStyles = buttonStyles_1.default.button;
    }
    if (type === TERTIARY) {
        if (disabled) {
            buttonLabelStyles = buttonStyles_1.default.buttonLabelTertiaryDisabled;
        }
        buttonLabelStyles = buttonStyles_1.default.buttonLabelTertiary;
        return (<react_native_1.TouchableHighlight accessibilityLabel={accessibilityLabel} disabled={disabled} onPress={onPress} style={[
                buttonStyles,
                style
            ]}>
                <react_native_paper_1.Text style={[
                buttonLabelStyles,
                labelStyle
            ]}>{t(labelKey ?? '')}</react_native_paper_1.Text>
            </react_native_1.TouchableHighlight>);
    }
    return (<react_native_paper_1.Button accessibilityLabel={t(accessibilityLabel ?? '')} buttonColor={color} children={t(labelKey ?? '')} contentStyle={[
            buttonStyles_1.default.buttonContent,
            contentStyle
        ]} disabled={disabled} 
    // @ts-ignore
    icon={icon} labelStyle={[
            buttonLabelStyles,
            labelStyle
        ]} mode={mode} onPress={onPress} style={[
            buttonStyles,
            style
        ]}/>);
};
exports.default = Button;
