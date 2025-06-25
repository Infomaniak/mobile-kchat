"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createColorTokens = void 0;
/**
 * Creates the color tokens based on the color theme and the association map.
 * If a key is not found in the association map it defaults to the current value.
 *
 * @param {Object} colorMap - A map between the token name and the actual color value.
 * @param {Object} colors - An object containing all the theme colors.
 * @returns {Object}
 */
function createColorTokens(colorMap, colors) {
    return Object.entries(colorMap)
        .reduce((result, [token, value]) => Object.assign(result, { [token]: colors[value] || value }), {});
}
exports.createColorTokens = createColorTokens;
