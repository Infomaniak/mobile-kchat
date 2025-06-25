import { IReduxState } from '../app/types';
/**
 * Action to authorize the Jitsi Recording app in dropbox.
 *
 * @param {string} appKey - The Jitsi Recorder dropbox app key.
 * @param {string} redirectURI - The return URL.
 * @returns {Promise<Object>}
 */
export declare function _authorizeDropbox(appKey: string, redirectURI: string): Promise<any>;
/**
 * Gets a new access token based on the refresh token.
 *
 * @param {string} appKey - The dropbox appKey.
 * @param {string} rToken - The refresh token.
 * @returns {Promise}
 */
export declare function getNewAccessToken(appKey: string, rToken: string): any;
/**
 * Returns the display name for the current dropbox account.
 *
 * @param {string} token - The dropbox access token.
 * @param {string} appKey - The Jitsi Recorder dropbox app key.
 * @returns {Promise<string>}
 */
export declare function getDisplayName(token: string, appKey: string): Promise<string>;
/**
 * Returns information about the space usage for the current dropbox account.
 *
 * @param {string} token - The dropbox access token.
 * @param {string} appKey - The Jitsi Recorder dropbox app key.
 * @returns {Promise<Object>}
 */
export declare function getSpaceUsage(token: string, appKey: string): Promise<{
    allocated: any;
    used: number;
}>;
/**
 * Returns <tt>true</tt> if the dropbox features is enabled and <tt>false</tt>
 * otherwise.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean}
 */
export declare function isEnabled(state: IReduxState): boolean;
