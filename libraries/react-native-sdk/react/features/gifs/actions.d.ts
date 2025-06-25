/**
 * Adds a GIF for a given participant.
 *
 * @param {string} participantId - The id of the participant that sent the GIF.
 * @param {string} gifUrl - The URL of the GIF.
 * @returns {Object}
 */
export declare function addGif(participantId: string, gifUrl: string): {
    type: string;
    participantId: string;
    gifUrl: string;
};
/**
 * Removes the GIF of the given participant.
 *
 * @param {string} participantId - The Id of the participant for whom to remove the GIF.
 * @returns {Object}
 */
export declare function removeGif(participantId: string): {
    type: string;
    participantId: string;
};
/**
 * Keep showing the GIF of the given participant.
 *
 * @param {string} participantId - The Id of the participant for whom to show the GIF.
 * @returns {Object}
 */
export declare function showGif(participantId: string): {
    type: string;
    participantId: string;
};
/**
 * Set timeout to hide the GIF of the given participant.
 *
 * @param {string} participantId - The Id of the participant for whom to show the GIF.
 * @returns {Object}
 */
export declare function hideGif(participantId: string): {
    type: string;
    participantId: string;
};
/**
 * Set visibility of the GIF menu.
 *
 * @param {boolean} visible - Whether or not it should be visible.
 * @returns {Object}
 */
export declare function setGifMenuVisibility(visible: boolean): {
    type: string;
    visible: boolean;
};
