/**
 * Wrapper around fetch GET requests to handle json-ifying the response
 * and logging errors.
 *
 * @param {string} url - The URL to perform a GET against.
 * @param {?boolean} retry - Whether the request will be retried after short timeout.
 * @param {?Object} options - The request options.
 * @returns {Promise<Object>} The response body, in JSON format, will be
 * through the Promise.
 */
export declare function doGetJSON(url: string, retry?: boolean, options?: Object): Promise<any>;
/**
 * Encodes strings to Base64URL.
 *
 * @param {any} data - The byte array to encode.
 * @returns {string}
 */
export declare const encodeToBase64URL: (data: string) => string;
/**
 * Decodes strings from Base64URL.
 *
 * @param {string} data - The byte array to decode.
 * @returns {string}
 */
export declare const decodeFromBase64URL: (data: string) => string;
