"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFlags = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Updates the current features flags with the given ones. They will be merged.
 *
 * @param {Object} flags - The new flags object.
 * @returns {{
 *     type: UPDATE_FLAGS,
 *     flags: Object
 * }}
 */
function updateFlags(flags) {
    return {
        type: actionTypes_1.UPDATE_FLAGS,
        flags
    };
}
exports.updateFlags = updateFlags;
