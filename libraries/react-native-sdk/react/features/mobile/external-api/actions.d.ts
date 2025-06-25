/**
 * Creates a (redux) action which signals that the SDK is ready to be closed.
 *
 * @returns {{
 *     type: READY_TO_CLOSE
 * }}
 */
export declare function readyToClose(): {
    type: string;
};
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
export declare function setParticipantsWithScreenShare(participantIds: Array<string>): {
    type: string;
    participantIds: string[];
};
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
export declare function customOverflowMenuButtonPressed(id: string, text: string): {
    type: string;
    id: string;
    text: string;
};
