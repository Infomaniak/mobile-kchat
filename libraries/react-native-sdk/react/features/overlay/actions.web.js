"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openPageReloadDialog = exports.mediaPermissionPromptVisibilityChanged = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Signals that the prompt for media permission is visible or not.
 *
 * @param {boolean} isVisible - If the value is true - the prompt for media
 * permission is visible otherwise the value is false/undefined.
 * @param {string} browser - The name of the current browser.
 * @public
 * @returns {{
 *     type: MEDIA_PERMISSION_PROMPT_VISIBILITY_CHANGED,
 *     browser: {string},
 *     isVisible: {boolean}
 * }}
 */
function mediaPermissionPromptVisibilityChanged(isVisible, browser) {
    return {
        type: actionTypes_1.MEDIA_PERMISSION_PROMPT_VISIBILITY_CHANGED,
        browser,
        isVisible
    };
}
exports.mediaPermissionPromptVisibilityChanged = mediaPermissionPromptVisibilityChanged;
/**
 * Opens {@link PageReloadDialog}.
 *
 * @returns {Function}
 */
function openPageReloadDialog() {
    // Dummy
}
exports.openPageReloadDialog = openPageReloadDialog;
