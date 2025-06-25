"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presenceStatusDisabled = void 0;
/**
 * Tells whether presence status should be displayed.
 *
 * @returns {boolean}
 */
function presenceStatusDisabled() {
    return Boolean(typeof interfaceConfig !== 'undefined' && interfaceConfig?.DISABLE_PRESENCE_STATUS);
}
exports.presenceStatusDisabled = presenceStatusDisabled;
