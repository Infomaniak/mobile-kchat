"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ColorPalette_1 = require("../styles/components/styles/ColorPalette");
const functions_any_1 = require("../styles/functions.any");
/**
 * The default color scheme of the application.
 */
exports.default = {
    '_defaultTheme': {
        // Generic app theme colors that are used across the entire app.
        // All scheme definitions below inherit these values.
        background: 'rgb(255, 255, 255)',
        errorText: ColorPalette_1.ColorPalette.red,
        icon: 'rgb(28, 32, 37)',
        text: 'rgb(28, 32, 37)'
    },
    'Dialog': {},
    'Header': {
        background: ColorPalette_1.ColorPalette.blue,
        icon: ColorPalette_1.ColorPalette.white,
        statusBar: ColorPalette_1.ColorPalette.blueHighlight,
        statusBarContent: ColorPalette_1.ColorPalette.white,
        text: ColorPalette_1.ColorPalette.white
    },
    'Toolbox': {
        button: 'rgb(255, 255, 255)',
        buttonToggled: 'rgb(38, 58, 76)',
        buttonToggledBorder: (0, functions_any_1.getRGBAFormat)('#a4b8d1', 0.6),
        hangup: 'rgb(227,79,86)'
    }
};
