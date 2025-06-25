import { IStore } from '../app/types';
/**
 * Continue to the conference page.
 *
 * @returns {Function}
 */
export declare function openWebApp(): (dispatch: IStore['dispatch']) => void;
/**
 * Opens the desktop app.
 *
 * @returns {{
 *     type: OPEN_DESKTOP_APP
 * }}
 */
export declare function openDesktopApp(): {
    type: string;
};
