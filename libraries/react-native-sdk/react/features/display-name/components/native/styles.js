"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
exports.default = {
    displayNameBackdrop: {
        alignSelf: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        padding: 6
    },
    displayNamePadding: {
        paddingRight: 6
    },
    displayNameText: {
        color: BaseTheme_native_1.default.palette.text01,
        fontSize: 14,
        fontWeight: 'bold'
    }
};
