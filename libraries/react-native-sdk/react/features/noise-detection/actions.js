"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNoisyAudioInputNotificationUid = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Sets UID of the the pending notification to use it when hiding
 * the notification is necessary, or unset it when undefined (or no param) is
 * passed.
 *
 * @param {?number} uid - The UID of the notification.
 * @returns {{
 *     type: SET_NOISY_AUDIO_INPUT_NOTIFICATION_UID,
 *     uid: number
 * }}
 */
function setNoisyAudioInputNotificationUid(uid) {
    return {
        type: actionTypes_1.SET_NOISY_AUDIO_INPUT_NOTIFICATION_UID,
        uid
    };
}
exports.setNoisyAudioInputNotificationUid = setNoisyAudioInputNotificationUid;
