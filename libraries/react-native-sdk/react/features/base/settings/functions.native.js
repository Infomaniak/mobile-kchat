"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCrashReportingChange = exports.handleCallIntegrationChange = void 0;
const react_native_1 = require("react-native");
const react_native_default_preference_1 = __importDefault(require("react-native-default-preference"));
__exportStar(require("./functions.any"), exports);
const { AudioMode } = react_native_1.NativeModules;
/**
 * Handles changes to the `disableCallIntegration` setting.
 * On Android (where `AudioMode.setUseConnectionService` is defined) we must update
 * the native side too, since audio routing works differently.
 *
 * @param {boolean} disabled - Whether call integration is disabled or not.
 * @returns {void}
 */
function handleCallIntegrationChange(disabled) {
    if (AudioMode.setUseConnectionService) {
        AudioMode.setUseConnectionService(!disabled);
    }
}
exports.handleCallIntegrationChange = handleCallIntegrationChange;
/**
 * Handles changes to the `disableCrashReporting` setting.
 * Stores the value into platform specific default preference file, so at app
 * start-up time it is retrieved on the native side and the crash reporting
 * is enabled/disabled.
 *
 * @param {boolean} disabled - Whether crash reporting is disabled or not.
 * @returns {void}
 */
function handleCrashReportingChange(disabled) {
    react_native_default_preference_1.default.setName('jitsi-default-preferences').then(// @ts-ignore
    react_native_default_preference_1.default.set('isCrashReportingDisabled', disabled.toString()));
}
exports.handleCrashReportingChange = handleCrashReportingChange;
