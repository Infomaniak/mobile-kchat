/**
 * Sets whether the filmstrip is enabled.
 *
 * @param {boolean} enabled - Whether the filmstrip is enabled.
 * @returns {{
 *     type: SET_FILMSTRIP_ENABLED,
 *     enabled: boolean
 * }}
 */
export declare function setFilmstripEnabled(enabled: boolean): {
    type: string;
    enabled: boolean;
};
/**
 * Sets whether the filmstrip is visible.
 *
 * @param {boolean} visible - Whether the filmstrip is visible.
 * @returns {{
 *     type: SET_FILMSTRIP_VISIBLE,
 *     visible: boolean
 * }}
 */
export declare function setFilmstripVisible(visible: boolean): {
    type: string;
    visible: boolean;
};
/**
 * Sets the list of the reordered remote participants based on which the visible participants in the filmstrip will be
 * determined.
 *
 * @param {Array<string>} participants - The list of the remote participant endpoint IDs.
 * @returns {{
        type: SET_REMOTE_PARTICIPANTS,
        participants: Array<string>
    }}
 */
export declare function setRemoteParticipants(participants: Array<string>): {
    type: string;
    participants: string[];
};
/**
 * Sets the list of the visible participants in the filmstrip by storing the start and end index from the remote
 * participants array.
 *
 * @param {number} startIndex - The start index from the remote participants array.
 * @param {number} endIndex - The end index from the remote participants array.
 * @returns {{
 *      type: SET_VISIBLE_REMOTE_PARTICIPANTS,
 *      startIndex: number,
 *      endIndex: number
 * }}
 */
export declare function setVisibleRemoteParticipants(startIndex: number, endIndex: number): {
    type: string;
    startIndex: number;
    endIndex: number;
};
