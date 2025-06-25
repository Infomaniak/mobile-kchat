"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_keep_awake_1 = __importDefault(require("react-native-keep-awake"));
const functions_1 = require("../../base/conference/functions");
const StateListenerRegistry_1 = __importDefault(require("../../base/redux/StateListenerRegistry"));
/**
 * State listener that activates or deactivates the wake lock accordingly. If
 * the wake lock is active, it will prevent the screen from dimming.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => {
    const { enabled: audioOnly } = state['features/base/audio-only'];
    const conference = (0, functions_1.getCurrentConference)(state);
    return Boolean(conference && !audioOnly);
}, 
/* listener */ wakeLock => _setWakeLock(wakeLock));
/**
 * Activates/deactivates the wake lock. If the wake lock is active, it will
 * prevent the screen from dimming.
 *
 * @param {boolean} wakeLock - True to active the wake lock or false to
 * deactivate it.
 * @private
 * @returns {void}
 */
function _setWakeLock(wakeLock) {
    if (wakeLock) {
        react_native_keep_awake_1.default.activate();
    }
    else {
        react_native_keep_awake_1.default.deactivate();
    }
}
