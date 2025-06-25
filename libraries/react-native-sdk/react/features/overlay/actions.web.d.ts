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
export declare function mediaPermissionPromptVisibilityChanged(isVisible: boolean, browser: string): {
    type: string;
    browser: string;
    isVisible: boolean;
};
/**
 * Opens {@link PageReloadDialog}.
 *
 * @returns {Function}
 */
export declare function openPageReloadDialog(): any;
