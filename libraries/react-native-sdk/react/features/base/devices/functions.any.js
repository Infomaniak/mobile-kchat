"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAvailableDevices = void 0;
/**
 * Returns true if there are devices of a specific type or on native platform.
 *
 * @param {Object} state - The state of the application.
 * @param {string} type - The type of device: VideoOutput | audioOutput | audioInput.
 *
 * @returns {boolean}
 */
function hasAvailableDevices(state, type) {
    if (state['features/base/devices'] === undefined) {
        return true;
    }
    const availableDevices = state['features/base/devices'].availableDevices;
    return Number(availableDevices[type]?.length) > 0;
}
exports.hasAvailableDevices = hasAvailableDevices;
