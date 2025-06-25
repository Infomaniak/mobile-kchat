"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixDeviceID = void 0;
const react_native_default_preference_1 = __importDefault(require("react-native-default-preference"));
const react_native_device_info_1 = require("react-native-device-info");
const logger_1 = __importDefault(require("../../logger"));
/**
 * Custom logic for setting the correct device id.
 *
 * @param {AmplitudeClient} amplitude - The amplitude instance.
 * @returns {void}
 */
async function fixDeviceID(amplitude) {
    await react_native_default_preference_1.default.setName('jitsi-preferences');
    const current = await react_native_default_preference_1.default.get('amplitudeDeviceId');
    if (current) {
        await amplitude.setDeviceId(current);
    }
    else {
        const uid = await (0, react_native_device_info_1.getUniqueId)();
        if (!uid) {
            logger_1.default.warn('Device ID is not set!');
            return;
        }
        await amplitude.setDeviceId(uid);
        await react_native_default_preference_1.default.set('amplitudeDeviceId', uid);
    }
}
exports.fixDeviceID = fixDeviceID;
