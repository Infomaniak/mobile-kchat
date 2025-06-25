"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNativeTheme = void 0;
const react_native_paper_1 = require("react-native-paper");
const utils_1 = require("./utils");
/**
 * Creates a React Native Paper theme based on local UI tokens.
 *
 * @param {Object} arg - The ui tokens.
 * @returns {Object}
 */
function createNativeTheme({ font, colors, colorMap, shape, spacing, typography }) {
    return {
        ...react_native_paper_1.DefaultTheme,
        palette: (0, utils_1.createColorTokens)(colorMap, colors),
        shape,
        spacing,
        typography: {
            font,
            ...typography
        }
    };
}
exports.createNativeTheme = createNativeTheme;
