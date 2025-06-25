"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customOverflowMenuButtonPressed = exports.setParticipantsWithScreenShare = exports.readyToClose = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Creates a (redux) action which signals that the SDK is ready to be closed.
 *
 * @returns {{
 *     type: READY_TO_CLOSE
 * }}
 */
function readyToClose() {
    return {
        type: actionTypes_1.READY_TO_CLOSE
    };
}
exports.readyToClose = readyToClose;
/**
 * Creates a (redux) action which signals that the list of known participants
 * with screen shares has changed.
 *
 * @param {string} participantIds - The participants which currently have active
 * screen share streams.
 * @returns {{
 *     type: SCREEN_SHARE_PARTICIPANTS_UPDATED,
 *     participantId: string
 * }}
 */
function setParticipantsWithScreenShare(participantIds) {
    return {
        type: actionTypes_1.SCREEN_SHARE_PARTICIPANTS_UPDATED,
        participantIds
    };
}
exports.setParticipantsWithScreenShare = setParticipantsWithScreenShare;
/**
 * Creates a (redux) action which that a custom overflow menu button was pressed.
 *
 * @param {string} id - The id for the custom button.
 * @param {string} text - The label for the custom button.
 * @returns {{
 *     type: CUSTOM_OVERFLOW_MENU_BUTTON_PRESSED,
 *     id: string,
 *     text: string
 * }}
 */
function customOverflowMenuButtonPressed(id, text) {
    return {
        type: actionTypes_1.CUSTOM_OVERFLOW_MENU_BUTTON_PRESSED,
        id,
        text
    };
}
exports.customOverflowMenuButtonPressed = customOverflowMenuButtonPressed;
