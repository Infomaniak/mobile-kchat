"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleDialog = exports.openSheet = exports.openDialog = exports.hideSheet = exports.hideDialog = void 0;
const actionTypes_1 = require("./actionTypes");
const functions_1 = require("./functions");
/**
 * Signals Dialog to close its dialog.
 *
 * @param {Object} [component] - The {@code Dialog} component to close/hide. If
 * {@code undefined}, closes/hides {@code Dialog} regardless of which
 * component it's rendering; otherwise, closes/hides {@code Dialog} only if
 * it's rendering the specified {@code component}.
 * @returns {{
 *     type: HIDE_DIALOG,
 *     component: (React.Component | undefined)
 * }}
 */
function hideDialog(component) {
    return {
        type: actionTypes_1.HIDE_DIALOG,
        component
    };
}
exports.hideDialog = hideDialog;
/**
 * Closes the active sheet.
 *
 * @returns {{
 *     type: HIDE_SHEET,
 * }}
 */
function hideSheet() {
    return {
        type: actionTypes_1.HIDE_SHEET
    };
}
exports.hideSheet = hideSheet;
/**
 * Signals Dialog to open dialog.
 *
 * @param {Object} component - The component to display as dialog.
 * @param {Object} [componentProps] - The React {@code Component} props of the
 * specified {@code component}.
 * @returns {{
 *     type: OPEN_DIALOG,
 *     component: React.Component,
 *     componentProps: (Object | undefined)
 * }}
 */
function openDialog(component, componentProps) {
    return {
        type: actionTypes_1.OPEN_DIALOG,
        component,
        componentProps
    };
}
exports.openDialog = openDialog;
/**
 * Opens the requested sheet.
 *
 * @param {Object} component - The component to display as a sheet.
 * @param {Object} [componentProps] - The React {@code Component} props of the
 * specified {@code component}.
 * @returns {{
 *     type: OPEN_SHEET,
 *     component: React.Component,
 *     componentProps: (Object | undefined)
 * }}
 */
function openSheet(component, componentProps) {
    return {
        type: actionTypes_1.OPEN_SHEET,
        component,
        componentProps
    };
}
exports.openSheet = openSheet;
/**
 * Signals Dialog to open a dialog with the specified component if the component
 * is not already open. If it is open, then Dialog is signaled to close its
 * dialog.
 *
 * @param {Object} component - The component to display as dialog.
 * @param {Object} [componentProps] - The React {@code Component} props of the
 * specified {@code component}.
 * @returns {Function}
 */
function toggleDialog(component, componentProps) {
    return (dispatch, getState) => {
        if ((0, functions_1.isDialogOpen)(getState, component)) {
            dispatch(hideDialog(component));
        }
        else {
            dispatch(openDialog(component, componentProps));
        }
    };
}
exports.toggleDialog = toggleDialog;
