import { IStore } from '../app/types';
/**
 * Appends a suffix to the display name.
 *
 * @param {string} displayName - The display name.
 * @param {string} suffix - Suffix that will be appended.
 * @returns {string} The formatted display name.
 */
export declare function appendSuffix(displayName: string, suffix?: string): string;
/**
 * Dispatches an action to update the local participant's display name. A
 * name must be entered for the action to dispatch.
 *
 * It returns a boolean to comply the Dialog behaviour:
 *     {@code true} - the dialog should be closed.
 *     {@code false} - the dialog should be left open.
 *
 * @param {Function} dispatch - Redux dispatch function.
 * @param {Function} onPostSubmit - Function to be invoked after a successful display name change.
 * @param {string} displayName - The display name to save.
 * @returns {boolean}
 */
export declare function onSetDisplayName(dispatch: IStore['dispatch'], onPostSubmit?: Function): (displayName: string) => boolean;
