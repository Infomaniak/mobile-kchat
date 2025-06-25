"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTheme_native_1 = __importDefault(require("../../../ui/components/BaseTheme.native"));
const BUTTON_HEIGHT = BaseTheme_native_1.default.spacing[7];
const button = {
    borderRadius: BaseTheme_native_1.default.shape.borderRadius,
    display: 'flex',
    height: BUTTON_HEIGHT,
    justifyContent: 'center'
};
const buttonLabel = {
    ...BaseTheme_native_1.default.typography.bodyShortBold,
    textTransform: 'capitalize'
};
exports.default = {
    button: {
        ...button
    },
    buttonLabel: {
        ...buttonLabel
    },
    buttonLabelDisabled: {
        ...buttonLabel,
        color: BaseTheme_native_1.default.palette.text03
    },
    buttonContent: {
        height: BUTTON_HEIGHT
    },
    buttonDisabled: {
        ...button,
        backgroundColor: BaseTheme_native_1.default.palette.ui08
    },
    buttonLabelPrimary: {
        ...buttonLabel,
        color: BaseTheme_native_1.default.palette.text01
    },
    buttonLabelPrimaryText: {
        ...buttonLabel,
        color: BaseTheme_native_1.default.palette.action01
    },
    buttonLabelSecondary: {
        ...buttonLabel,
        color: BaseTheme_native_1.default.palette.text04
    },
    buttonLabelDestructive: {
        ...buttonLabel,
        color: BaseTheme_native_1.default.palette.text01
    },
    buttonLabelDestructiveText: {
        ...buttonLabel,
        color: BaseTheme_native_1.default.palette.actionDanger
    },
    buttonLabelTertiary: {
        ...buttonLabel,
        color: BaseTheme_native_1.default.palette.text01,
        marginHorizontal: BaseTheme_native_1.default.spacing[2],
        textAlign: 'center'
    },
    buttonLabelTertiaryDisabled: {
        ...buttonLabel,
        color: BaseTheme_native_1.default.palette.text03,
        textAlign: 'center'
    }
};
