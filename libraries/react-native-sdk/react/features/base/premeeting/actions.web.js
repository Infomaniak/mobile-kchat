"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUnsafeRoomConsent = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Sets the consent of the user for joining the unsafe room.
 *
 * @param {boolean} consent - The user's consent.
 * @returns {{
 *      type: SET_UNSAFE_ROOM_CONSENT,
*       consent: boolean
* }}
 */
function setUnsafeRoomConsent(consent) {
    return {
        type: actionTypes_1.SET_UNSAFE_ROOM_CONSENT,
        consent
    };
}
exports.setUnsafeRoomConsent = setUnsafeRoomConsent;
