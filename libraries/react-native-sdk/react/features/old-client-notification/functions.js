"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOldJitsiMeetElectronApp = void 0;
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
/**
 * Returns true if Jitsi Meet is running in too old jitsi-meet-electron app and false otherwise.
 *
 * @returns {boolean} - True if Jitsi Meet is running in too old jitsi-meet-electron app and false otherwise.
 */
function isOldJitsiMeetElectronApp() {
    if (!lib_jitsi_meet_1.browser.isElectron()) {
        return false;
    }
    // @ts-ignore
    const match = navigator.userAgent.match(/(JitsiMeet)\s*\/\s*((\d+)\.[^\s]*)/);
    if (!Array.isArray(match) || match.length < 3) {
        return false;
    }
    const majorVersion = Number(match[3]);
    if (isNaN(majorVersion) || majorVersion >= 2022) {
        return false;
    }
    return true;
}
exports.isOldJitsiMeetElectronApp = isOldJitsiMeetElectronApp;
