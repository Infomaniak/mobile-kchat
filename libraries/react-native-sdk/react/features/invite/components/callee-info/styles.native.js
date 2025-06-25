"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const ColorPalette_1 = require("../../../base/styles/components/styles/ColorPalette");
const functions_native_1 = require("../../../base/styles/functions.native");
exports.default = (0, functions_native_1.createStyleSheet)({
    // XXX The names below were preserved for the purposes of compatibility
    // with the existing CSS class names on Web.
    /**
     * The style of {@code CalleeInfo}.
     */
    ringing: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        alignItems: 'center',
        backgroundColor: ColorPalette_1.ColorPalette.black,
        flex: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: 0.8
    },
    'ringing__avatar': {
        borderRadius: 50,
        flex: 0,
        height: 100,
        width: 100
    },
    'ringing__caller-info': {
        alignItems: 'center',
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    'ringing__content': {
        alignItems: 'center',
        flex: 0,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    /**
     * The style of {@code Text} within {@code CalleeInfo}.
     */
    'ringing__text': {
        color: ColorPalette_1.ColorPalette.white
    }
});
