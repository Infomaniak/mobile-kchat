import { IStore } from '../app/types';
/**
 * Action to authorize the Jitsi Recording app in dropbox.
 *
 * @returns {Function}
 */
export declare function authorizeDropbox(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action to update the dropbox access token.
 *
 * @param {string} token - The new token.
 * @param {string} rToken - The refresh token.
 * @param {number} expireDate - The token expiration date as UNIX timestamp.
 * @returns {{
 *     type: UPDATE_DROPBOX_TOKEN,
 *     token: string,
 *     rToken: string,
 *     expireDate: number
 * }}
 */
export declare function updateDropboxToken(token?: string, rToken?: string, expireDate?: number): {
    type: string;
    token: string | undefined;
    rToken: string | undefined;
    expireDate: number | undefined;
};
