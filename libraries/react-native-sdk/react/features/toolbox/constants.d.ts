import { ToolbarButton } from './types';
/**
 * Thresholds for displaying toolbox buttons.
 */
export declare const THRESHOLDS: {
    width: number;
    order: string[];
}[];
/**
 * Main toolbar buttons priority used to determine which button should be picked to fill empty spaces for disabled
 * buttons.
 */
export declare const MAIN_TOOLBAR_BUTTONS_PRIORITY: string[];
export declare const TOOLBAR_TIMEOUT = 4000;
export declare const DRAWER_MAX_HEIGHT = "80dvh - 64px";
export declare const ZINDEX_DIALOG_PORTAL = 302;
/**
 * Color for spinner displayed in the toolbar.
 */
export declare const SPINNER_COLOR = "#929292";
/**
 * The list of all possible UI buttons.
 *
 * @protected
 * @type Array<string>
 */
export declare const TOOLBAR_BUTTONS: ToolbarButton[];
/**
 * The toolbar buttons to show when in visitors mode.
 */
export declare const VISITORS_MODE_BUTTONS: ToolbarButton[];
