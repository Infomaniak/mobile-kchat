/// <reference types="react" />
/**
 * Signals to open a dialog with the {@code DisplayNamePrompt} component.
 *
 * @param {Object} params - Map containing the callbacks to be executed in the prompt:
 * - onPostSubmit - The function to invoke after a successful submit of the dialog.
 * - validateInput - The function to invoke after a change in the display name value.
 * @returns {Object}
 */
export declare function openDisplayNamePrompt({ onPostSubmit, validateInput }: {
    onPostSubmit?: Function;
    validateInput?: Function;
}): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
