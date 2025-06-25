import { IConfig } from '../base/config/configType';
/**
 * Checks if the token for authentication is available.
 *
 * @param {Object} config - Configuration state object from store.
 * @returns {boolean}
 */
export declare const isTokenAuthEnabled: (config: IConfig) => boolean;
/**
 * Returns the state that we can add as a parameter to the tokenAuthUrl.
 *
 * @param {URL} locationURL - The location URL.
 * @param {Object} options: - Config options {
 *     audioMuted: boolean | undefined
 *     audioOnlyEnabled: boolean | undefined,
 *     skipPrejoin: boolean | undefined,
 *     videoMuted: boolean | undefined
 * }.
 * @param {string?} roomName - The room name.
 * @param {string?} tenant - The tenant name if any.
 *
 * @returns {Object} The state object.
 */
export declare const _getTokenAuthState: (locationURL: URL, options: {
    audioMuted: boolean | undefined;
    audioOnlyEnabled: boolean | undefined;
    skipPrejoin: boolean | undefined;
    videoMuted: boolean | undefined;
}, roomName: string | undefined, tenant: string | undefined) => object;
