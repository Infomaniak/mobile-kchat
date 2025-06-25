"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleDocument = exports.setDocumentUrl = exports.setDocumentEditingState = void 0;
const actionTypes_1 = require("./actionTypes");
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
function setDocumentEditingState(editing) {
    return {
        type: actionTypes_1.SET_DOCUMENT_EDITING_STATUS,
        editing
    };
}
exports.setDocumentEditingState = setDocumentEditingState;
/**
 * Dispatches an action to set the shared document URL.
 *
 * @param {string} documentUrl - The shared document URL.
 * @returns {{
 *    type: SET_DOCUMENT_URL,
 *    documentUrl: string
 * }}
 */
function setDocumentUrl(documentUrl) {
    return {
        type: actionTypes_1.SET_DOCUMENT_URL,
        documentUrl
    };
}
exports.setDocumentUrl = setDocumentUrl;
/**
 * Dispatches an action to show or hide Etherpad.
 *
 * @returns {{
 *    type: TOGGLE_DOCUMENT_EDITING
 * }}
 */
function toggleDocument() {
    return {
        type: actionTypes_1.TOGGLE_DOCUMENT_EDITING
    };
}
exports.toggleDocument = toggleDocument;
