/// <reference types="react" />
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
export declare function mediaPermissionPromptVisibilityChanged(_isVisible: boolean, _browser: string): void;
/**
 * Opens {@link PageReloadDialog}.
 *
 * @returns {Function}
 */
export declare function openPageReloadDialog(): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
