"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMuiBrandingTheme = void 0;
const styles_1 = require("@mui/material/styles");
const Tokens_1 = require("../base/ui/Tokens");
const utils_1 = require("../base/ui/utils");
/**
 * Creates MUI branding theme based on the custom theme json.
 *
 * @param {Object} customTheme - The branded custom theme.
 * @returns {Object} - The MUI theme.
 */
function createMuiBrandingTheme(customTheme) {
    const { palette: customPalette, shape: customShape, typography: customTypography, breakpoints: customBreakpoints, spacing: customSpacing } = customTheme;
    const newPalette = (0, utils_1.createColorTokens)(Tokens_1.colorMap, Tokens_1.colors);
    if (customPalette) {
        overwriteRecurrsive(newPalette, customPalette);
    }
    const newShape = { ...Tokens_1.shape };
    if (customShape) {
        overwriteRecurrsive(newShape, customShape);
    }
    const newTypography = {
        font: { ...Tokens_1.font },
        ...Tokens_1.typography
    };
    if (customTypography) {
        overwriteRecurrsive(newTypography, customTypography);
    }
    const newBreakpoints = { ...Tokens_1.breakpoints };
    if (customBreakpoints) {
        overwriteRecurrsive(newBreakpoints, customBreakpoints);
    }
    let newSpacing = [...Tokens_1.spacing];
    if (customSpacing?.length) {
        newSpacing = customSpacing;
    }
    return (0, styles_1.createTheme)((0, styles_1.adaptV4Theme)({
        spacing: newSpacing,
        palette: newPalette,
        shape: newShape,
        // @ts-ignore
        typography: newTypography,
        // @ts-ignore
        breakpoints: newBreakpoints
    }));
}
exports.createMuiBrandingTheme = createMuiBrandingTheme;
/**
* Overwrites recursively values from object 2 into object 1 based on common keys.
* (Merges object2 into object1).
*
* @param {Object} obj1 - The object holding the merged values.
* @param {Object} obj2 - The object to compare to and take values from.
* @returns {void}
*/
function overwriteRecurrsive(obj1, obj2) {
    Object.keys(obj2).forEach(key => {
        if (obj1.hasOwnProperty(key)) {
            if (typeof obj1[key] === 'object') {
                overwriteRecurrsive(obj1[key], obj2[key]);
            }
            else {
                // @ts-ignore
                obj1[key] = obj2[key];
            }
        }
    });
}
