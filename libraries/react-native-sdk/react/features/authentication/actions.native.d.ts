import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Cancels {@ink LoginDialog}.
 *
 * @returns {{
 *     type: CANCEL_LOGIN
 * }}
 */
export declare function cancelLogin(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Cancels {@link WaitForOwnerDialog}. Will navigate back to the welcome page.
 *
 * @returns {Function}
 */
export declare function cancelWaitForOwner(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Redirect to the default location (e.g. Welcome page).
 *
 * @returns {Function}
 */
export declare function redirectToDefaultLocation(): (dispatch: IStore['dispatch']) => Promise<void>;
/**
 * Opens token auth URL page.
 *
 * @param {string} tokenAuthServiceUrl - Authentication service URL.
 *
 * @returns {Function}
 */
export declare function openTokenAuthUrl(tokenAuthServiceUrl: string): () => void;
