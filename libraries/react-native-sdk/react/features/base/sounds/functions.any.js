"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDisabledSounds = void 0;
/**
 * Selector for retrieving the disabled sounds array.
 *
 * @param {Object} state - The Redux state.
 * @returns {Array<string>} - The disabled sound id's array.
 */
function getDisabledSounds(state) {
    return state['features/base/config'].disabledSounds || [];
}
exports.getDisabledSounds = getDisabledSounds;
