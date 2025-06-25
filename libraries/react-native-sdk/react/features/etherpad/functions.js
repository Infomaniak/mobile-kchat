"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedDocumentUrl = void 0;
const functions_1 = require("../base/redux/functions");
const ETHERPAD_OPTIONS = {
    showControls: 'true',
    showChat: 'false',
    showLineNumbers: 'true',
    useMonospaceFont: 'false'
};
/**
 * Retrieves the current sahred document URL.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState} function.
 * @returns {?string} - Current shared document URL or undefined.
 */
function getSharedDocumentUrl(stateful) {
    const state = (0, functions_1.toState)(stateful);
    const { documentUrl } = state['features/etherpad'];
    const { displayName } = state['features/base/settings'];
    if (!documentUrl) {
        return undefined;
    }
    const params = new URLSearchParams(ETHERPAD_OPTIONS);
    if (displayName) {
        params.append('userName', displayName);
    }
    return `${documentUrl}?${params.toString()}`;
}
exports.getSharedDocumentUrl = getSharedDocumentUrl;
