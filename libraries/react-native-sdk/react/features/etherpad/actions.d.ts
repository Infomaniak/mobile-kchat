/**
 * Dispatches an action to set whether document editing has started or stopped.
 *
 * @param {boolean} editing - Whether or not a document is currently being
 * edited.
 * @returns {{
 *    type: SET_DOCUMENT_EDITING_STATUS,
 *    editing: boolean
 * }}
 */
export declare function setDocumentEditingState(editing: boolean): {
    type: string;
    editing: boolean;
};
/**
 * Dispatches an action to set the shared document URL.
 *
 * @param {string} documentUrl - The shared document URL.
 * @returns {{
 *    type: SET_DOCUMENT_URL,
 *    documentUrl: string
 * }}
 */
export declare function setDocumentUrl(documentUrl?: string): {
    type: string;
    documentUrl: string | undefined;
};
/**
 * Dispatches an action to show or hide Etherpad.
 *
 * @returns {{
 *    type: TOGGLE_DOCUMENT_EDITING
 * }}
 */
export declare function toggleDocument(): {
    type: string;
};
