"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Create an action for when the settings are updated.
 *
 * @param {Object} settings - The new (partial) settings properties.
 * @returns {{
 *     type: SETTINGS_UPDATED,
 *     settings: {
 *         audioOutputDeviceId: string,
 *         avatarURL: string,
 *         cameraDeviceId: string,
 *         displayName: string,
 *         email: string,
 *         localFlipX: boolean,
 *         micDeviceId: string,
 *         serverURL: string,
 *         soundsReactions: boolean,
 *         startAudioOnly: boolean,
 *         startWithAudioMuted: boolean,
 *         startWithVideoMuted: boolean,
 *         startWithReactionsMuted: boolean
 *     }
 * }}
 */
function updateSettings(settings) {
    return {
        type: actionTypes_1.SETTINGS_UPDATED,
        settings
    };
}
exports.updateSettings = updateSettings;
