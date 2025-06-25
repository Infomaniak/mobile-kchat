"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSetDisplayName = exports.appendSuffix = void 0;
const actions_1 = require("../base/settings/actions");
/**
 * Appends a suffix to the display name.
 *
 * @param {string} displayName - The display name.
 * @param {string} suffix - Suffix that will be appended.
 * @returns {string} The formatted display name.
 */
function appendSuffix(displayName, suffix = '') {
    return `${displayName || suffix}${displayName && suffix && displayName !== suffix ? ` (${suffix})` : ''}`;
}
exports.appendSuffix = appendSuffix;
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
function onSetDisplayName(dispatch, onPostSubmit) {
    return function (displayName) {
        if (!displayName?.trim()) {
            return false;
        }
        // Store display name in settings
        dispatch((0, actions_1.updateSettings)({
            displayName
        }));
        onPostSubmit?.();
        return true;
    };
}
exports.onSetDisplayName = onSetDisplayName;
