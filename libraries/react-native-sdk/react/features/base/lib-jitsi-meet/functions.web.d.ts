export * from './functions.any';
/**
 * Loads config.js from a specific remote server.
 *
 * @param {string} _url - The URL to load.
 * @returns {Promise<IConfig>}
 */
export declare function loadConfig(_url?: string): Promise<import("../config/configType").IConfig>;
