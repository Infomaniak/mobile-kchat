import { IReduxState } from '../app/types';
import { IGif } from './reducer';
/**
 * Returns the gif config.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {Object}
 */
export declare function getGifConfig(state: IReduxState): {
    displayMode?: "chat" | "all" | "tile" | undefined;
    enabled?: boolean | undefined;
    proxyUrl?: string | undefined;
    rating?: "g" | "pg" | "pg-13" | "r" | undefined;
    sdkKey?: string | undefined;
    tileTime?: number | undefined;
};
/**
 * Get the GIF display mode.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {string}
 */
export declare function getGifDisplayMode(state: IReduxState): "chat" | "all" | "tile";
/**
 * Get the GIF audience rating.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {string}
 */
export declare function getGifRating(state: IReduxState): "g" | "pg" | "pg-13" | "r";
/**
 * Get the Giphy proxy url.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {string}
 */
export declare function getGiphyProxyUrl(state: IReduxState): string | undefined;
/**
 * Gets the URL of the GIF for the given participant or null if there's none.
 *
 * @param {IReduxState} state - Redux state.
 * @param {string} participantId - Id of the participant for which to remove the GIF.
 * @returns {Object}
 */
export declare function getGifForParticipant(state: IReduxState, participantId: string): IGif;
/**
 * Whether or not the message is a GIF message.
 *
 * @param {string} message - Message to check.
 * @returns {boolean}
 */
export declare function isGifMessage(message: string): boolean;
/**
 * Returns the url of the gif selected in the gifs menu.
 *
 * @param {Object} gif - The gif data.
 * @param {string} proxyUrl - The proxy server url.
 * @returns {boolean}
 */
export declare function getGifUrl(gif?: {
    data?: {
        embed_url: string;
    };
    embed_url?: string;
}, proxyUrl?: string): string;
/**
 * Formats the gif message.
 *
 * @param {string} url - GIF url.
 * @returns {string}
 */
export declare function formatGifUrlMessage(url: string): string;
/**
 * Get the Giphy API Key from config.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {string}
 */
export declare function getGifAPIKey(state: IReduxState): string;
/**
 * Returns whether or not the feature is enabled.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {boolean}
 */
export declare function isGifEnabled(state: IReduxState): boolean;
