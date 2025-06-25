import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Cancels {@ink LoginDialog}.
 *
 * @returns {{
 *     type: CANCEL_LOGIN
 * }}
 */
export declare function cancelLogin(): {
    type: string;
};
/**
 * Cancels authentication, closes {@link WaitForOwnerDialog}
 * and navigates back to the welcome page only in the case of authentication required error.
 * We can be showing the dialog while lobby is enabled and participant is still waiting there and hiding this dialog
 * should do nothing.
 *
 * @returns {Function}
 */
export declare function cancelWaitForOwner(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Redirect to the default location (e.g. Welcome page).
 *
 * @returns {Function}
 */
export declare function redirectToDefaultLocation(): (dispatch: IStore['dispatch']) => void;
/**
 * Opens token auth URL page.
 *
 * @param {string} tokenAuthServiceUrl - Authentication service URL.
 *
 * @returns {Function}
 */
export declare function openTokenAuthUrl(tokenAuthServiceUrl: string): any;
