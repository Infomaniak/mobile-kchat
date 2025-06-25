"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const functions_1 = require("../../base/conference/functions");
const StateListenerRegistry_1 = __importDefault(require("../../base/redux/StateListenerRegistry"));
/**
 * State listener which enables / disables the proximity sensor based on the
 * current conference state. If the proximity sensor is enabled, it will dim
 * the screen and disable touch controls when an object is nearby. The
 * functionality is  enabled when the current audio device is the earpiece.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => {
    const { devices } = state['features/mobile/audio-mode'];
    const selectedDevice = devices.filter(d => d.selected)[0];
    const conference = (0, functions_1.getCurrentConference)(state);
    return Boolean(conference && selectedDevice?.type === 'EARPIECE');
}, 
/* listener */ proximityEnabled => _setProximityEnabled(proximityEnabled));
/**
 * Enables / disables the proximity sensor. If the proximity sensor is enabled,
 * it will dim the screen and disable touch controls when an object is nearby.
 *
 * @param {boolean} enabled - True to enable the proximity sensor or false to
 * disable it.
 * @private
 * @returns {void}
 */
function _setProximityEnabled(enabled) {
    react_native_1.NativeModules.Proximity.setEnabled(Boolean(enabled));
}
