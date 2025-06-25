"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDisplayNamePrompt = void 0;
const actions_1 = require("../base/dialog/actions");
const components_1 = require("./components");
/**
 * Signals to open a dialog with the {@code DisplayNamePrompt} component.
 *
 * @param {Object} params - Map containing the callbacks to be executed in the prompt:
 * - onPostSubmit - The function to invoke after a successful submit of the dialog.
 * - validateInput - The function to invoke after a change in the display name value.
 * @returns {Object}
 */
function openDisplayNamePrompt({ onPostSubmit, validateInput }) {
    return (0, actions_1.openDialog)(components_1.DisplayNamePrompt, {
        onPostSubmit,
        validateInput
    });
}
exports.openDisplayNamePrompt = openDisplayNamePrompt;
