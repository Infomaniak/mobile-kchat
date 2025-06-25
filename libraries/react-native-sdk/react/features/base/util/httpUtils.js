"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeFromBase64URL = exports.encodeToBase64URL = exports.doGetJSON = void 0;
const base64_js_1 = __importDefault(require("base64-js"));
const timeoutPromise_1 = require("./timeoutPromise");
/**
 * The number of milliseconds before deciding that we need retry a fetch request.
 *
 * @type {number}
 */
const RETRY_TIMEOUT = 3000;
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
function doGetJSON(url, retry, options) {
    const fetchPromise = fetch(url, options)
        .then(response => {
        const jsonify = response.json();
        if (response.ok) {
            return jsonify;
        }
        return jsonify
            .then(result => Promise.reject(result));
    });
    if (retry) {
        return (0, timeoutPromise_1.timeoutPromise)(fetchPromise, RETRY_TIMEOUT)
            .catch(response => {
            if (response.status >= 400 && response.status < 500) {
                return Promise.reject(response);
            }
            return (0, timeoutPromise_1.timeoutPromise)(fetchPromise, RETRY_TIMEOUT);
        });
    }
    return fetchPromise;
}
exports.doGetJSON = doGetJSON;
/**
 * Encodes strings to Base64URL.
 *
 * @param {any} data - The byte array to encode.
 * @returns {string}
 */
const encodeToBase64URL = (data) => base64_js_1.default
    .fromByteArray(new window.TextEncoder().encode(data))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
exports.encodeToBase64URL = encodeToBase64URL;
/**
 * Decodes strings from Base64URL.
 *
 * @param {string} data - The byte array to decode.
 * @returns {string}
 */
const decodeFromBase64URL = (data) => {
    let s = data;
    // Convert from Base64URL to Base64.
    if (s.length % 4 === 2) {
        s += '==';
    }
    else if (s.length % 4 === 3) {
        s += '=';
    }
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    // Convert Base64 to a byte array.
    return new window.TextDecoder().decode(base64_js_1.default.toByteArray(s));
};
exports.decodeFromBase64URL = decodeFromBase64URL;
