"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openPageReloadDialog = exports.mediaPermissionPromptVisibilityChanged = void 0;
const actions_1 = require("../base/dialog/actions");
const PageReloadDialog_1 = __importDefault(require("../base/dialog/components/native/PageReloadDialog"));
/**
 * Signals that the prompt for media permission is visible or not.
 *
 * @param {boolean} _isVisible - If the value is true - the prompt for media
 * permission is visible otherwise the value is false/undefined.
 * @param {string} _browser - The name of the current browser.
 * @public
 * @returns {{
 *     type: MEDIA_PERMISSION_PROMPT_VISIBILITY_CHANGED,
 *     browser: {string},
 *     isVisible: {boolean}
 * }}
 */
function mediaPermissionPromptVisibilityChanged(_isVisible, _browser) {
    // Dummy.
}
exports.mediaPermissionPromptVisibilityChanged = mediaPermissionPromptVisibilityChanged;
/**
 * Opens {@link PageReloadDialog}.
 *
 * @returns {Function}
 */
function openPageReloadDialog() {
    return (0, actions_1.openDialog)(PageReloadDialog_1.default);
}
exports.openPageReloadDialog = openPageReloadDialog;
