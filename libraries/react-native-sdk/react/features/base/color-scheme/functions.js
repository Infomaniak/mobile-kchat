"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemeColor = void 0;
/**
 * A special function to be used in the {@code createColorSchemedStyle} call,
 * that denotes that the color is a dynamic color.
 *
 * @param {string} colorDefinition - The definition of the color to mark to be
 * resolved.
 * @returns {Function}
 */
function schemeColor(colorDefinition) {
    return () => colorDefinition;
}
exports.schemeColor = schemeColor;
