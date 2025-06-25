import { ComponentType } from 'react';
import { IStore } from '../../app/types';
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
export declare function hideDialog(component?: ComponentType<any>): {
    type: string;
    component: ComponentType<any> | undefined;
};
/**
 * Closes the active sheet.
 *
 * @returns {{
 *     type: HIDE_SHEET,
 * }}
 */
export declare function hideSheet(): {
    type: string;
};
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
export declare function openDialog(component: ComponentType<any>, componentProps?: Object): {
    type: string;
    component: ComponentType<any>;
    componentProps: Object | undefined;
};
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
export declare function openSheet(component: ComponentType<any>, componentProps?: Object): {
    type: string;
    component: ComponentType<any>;
    componentProps: Object | undefined;
};
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
export declare function toggleDialog(component: ComponentType<any>, componentProps?: Object): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
