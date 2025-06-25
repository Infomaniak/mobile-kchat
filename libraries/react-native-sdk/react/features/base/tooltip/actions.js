"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideTooltip = exports.showTooltip = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Set tooltip state to visible.
 *
 * @param {string} content - The content of the tooltip.
 * Used as unique identifier for tooltip.
 * @returns {Object}
 */
function showTooltip(content) {
    return {
        type: actionTypes_1.SHOW_TOOLTIP,
        content
    };
}
exports.showTooltip = showTooltip;
/**
 * Set tooltip state to hidden.
 *
 * @param {string} content - The content of the tooltip.
 * Used as unique identifier for tooltip.
 * @returns {Object}
 */
function hideTooltip(content) {
    return {
        type: actionTypes_1.HIDE_TOOLTIP,
        content
    };
}
exports.hideTooltip = hideTooltip;
