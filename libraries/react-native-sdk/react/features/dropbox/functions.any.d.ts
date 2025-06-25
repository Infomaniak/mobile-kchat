export * from './functions';
/**
 * Information related to the user's dropbox account.
 */
type DropboxUserData = {
    /**
     * The available space left in MB into the user's Dropbox account.
     */
    spaceLeft: number;
    /**
     * The display name of the user in Dropbox.
     */
    userName: string;
};
/**
 * Fetches information about the user's dropbox account.
 *
 * @param {string} token - The dropbox access token.
 * @param {string} appKey - The Jitsi Recorder dropbox app key.
 * @returns {Promise<DropboxUserData|undefined>}
 */
export declare function getDropboxData(token: string, appKey: string): Promise<DropboxUserData | undefined>;
