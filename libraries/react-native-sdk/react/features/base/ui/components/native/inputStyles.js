"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTheme_native_1 = __importDefault(require("../../../ui/components/BaseTheme.native"));
exports.default = {
    inputContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        ...BaseTheme_native_1.default.typography.bodyShortRegularLarge,
        lineHeight: 0,
        color: BaseTheme_native_1.default.palette.text01,
        marginBottom: BaseTheme_native_1.default.spacing[2]
    },
    fieldContainer: {
        position: 'relative'
    },
    icon: {
        position: 'absolute',
        zIndex: 1,
        top: 14,
        left: 14
    },
    input: {
        ...BaseTheme_native_1.default.typography.bodyShortRegularLarge,
        backgroundColor: BaseTheme_native_1.default.palette.ui03,
        borderColor: BaseTheme_native_1.default.palette.ui03,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        borderWidth: 2,
        color: BaseTheme_native_1.default.palette.text01,
        paddingHorizontal: BaseTheme_native_1.default.spacing[3],
        height: BaseTheme_native_1.default.spacing[7],
        lineHeight: 20
    },
    inputDisabled: {
        color: BaseTheme_native_1.default.palette.text03
    },
    inputFocused: {
        borderColor: BaseTheme_native_1.default.palette.focus01
    },
    inputError: {
        borderColor: BaseTheme_native_1.default.palette.textError
    },
    iconInput: {
        paddingLeft: BaseTheme_native_1.default.spacing[6]
    },
    inputMultiline: {
        height: BaseTheme_native_1.default.spacing[10],
        paddingTop: BaseTheme_native_1.default.spacing[2]
    },
    clearableInput: {
        paddingRight: BaseTheme_native_1.default.spacing[6]
    },
    clearButton: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        position: 'absolute',
        right: 0,
        top: 14,
        width: BaseTheme_native_1.default.spacing[6],
        height: BaseTheme_native_1.default.spacing[7]
    },
    clearIcon: {
        color: BaseTheme_native_1.default.palette.icon01
    },
    bottomLabel: {
        ...BaseTheme_native_1.default.typography.labelRegular,
        color: BaseTheme_native_1.default.palette.text02,
        marginTop: BaseTheme_native_1.default.spacing[2]
    },
    bottomLabelError: {
        color: BaseTheme_native_1.default.palette.textError
    }
};
