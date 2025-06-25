"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openSettings = void 0;
const react_native_1 = require("react-native");
const Platform_native_1 = __importDefault(require("../../base/react/Platform.native"));
/**
 * Opens the settings panel for the current platform.
 *
 * @private
 * @returns {void}
 */
function openSettings() {
    switch (Platform_native_1.default.OS) {
        case 'android':
            react_native_1.NativeModules.AndroidSettings.open().catch(() => {
                react_native_1.Alert.alert('Error opening settings', 'Please open settings and grant the required permissions', [
                    { text: 'OK' }
                ]);
            });
            break;
        case 'ios':
            react_native_1.Linking.openURL('app-settings:');
            break;
    }
}
exports.openSettings = openSettings;
