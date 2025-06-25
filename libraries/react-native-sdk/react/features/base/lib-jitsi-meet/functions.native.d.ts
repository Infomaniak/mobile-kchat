export * from './functions.any';
/**
 * Loads config.js from a specific remote server.
 *
 * @param {string} url - The URL to load.
 * @returns {Promise<Object>}
 */
export declare function loadConfig(url: string): Promise<Object>;
