"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const IconButton_1 = __importDefault(require("../../../base/ui/components/native/IconButton"));
const constants_native_1 = require("../../../base/ui/constants.native");
const styles_1 = require("./styles");
const HeaderNavigationButton = ({ color, disabled, label, onPress, src, style, twoActions }) => {
    let btnStyle;
    let labelStyle;
    if (disabled) {
        btnStyle = styles_1.navigationStyles.headerNavigationButtonDisabled;
        labelStyle = twoActions
            ? styles_1.navigationStyles.headerNavigationButtonLabelBoldDisabled
            : styles_1.navigationStyles.headerNavigationButtonLabelDisabled;
    }
    else {
        btnStyle = styles_1.navigationStyles.headerNavigationButton;
        labelStyle = twoActions
            ? styles_1.navigationStyles.headerNavigationButtonLabelBold
            : styles_1.navigationStyles.headerNavigationButtonLabel;
    }
    return (<>
            {src ? (<IconButton_1.default color={color} onPress={onPress} size={24} src={src} style={[
                styles_1.navigationStyles.headerNavigationButtonIcon,
                style
            ]}/>) : (<Button_1.default disabled={disabled} labelKey={label} labelStyle={labelStyle} onClick={onPress} style={[
                btnStyle,
                style
            ]} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>)}
        </>);
};
exports.default = HeaderNavigationButton;
