"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styles_1 = require("../../../base/dialog/components/native/styles");
const functions_any_1 = require("../../../base/styles/functions.any");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
/**
 * The React {@code Component} styles of {@code AudioRoutePickerDialog}.
 *
 * It uses a {@code BottomSheet} and these have been implemented as per the
 * Material Design guidelines:
 * {@link https://material.io/guidelines/components/bottom-sheets.html}.
 */
exports.default = (0, functions_any_1.createStyleSheet)({
    /**
     * Base style for each row.
     */
    deviceRow: {
        alignItems: 'center',
        flexDirection: 'row',
        height: styles_1.MD_ITEM_HEIGHT,
        marginLeft: BaseTheme_native_1.default.spacing[3]
    },
    /**
     * Style for the {@code Icon} element in a row.
     */
    deviceIcon: {
        color: BaseTheme_native_1.default.palette.icon01,
        fontSize: BaseTheme_native_1.default.spacing[4]
    },
    /**
     * Style for the {@code Text} element in a row.
     */
    deviceText: {
        color: BaseTheme_native_1.default.palette.text01,
        fontSize: 16,
        marginLeft: BaseTheme_native_1.default.spacing[5]
    },
    /**
     * Style for a row which is marked as selected.
     */
    selectedText: {
        color: BaseTheme_native_1.default.palette.action01
    }
});
