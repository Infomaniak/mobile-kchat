/**
 * A helper function that behaves similar to Object.assign, but only reassigns a
 * property in target if it's defined in source.
 *
 * @param {Object} target - The target object to assign the values into.
 * @param {Object} source - The source object.
 * @returns {Object}
 */
export declare function assignIfDefined(target: Object, source: Object): any;
/**
 * Creates a deferred object.
 *
 * @returns {{promise, resolve, reject}}
 */
export declare function createDeferred(): any;
/**
 * Escape RegExp special characters.
 *
 * Based on https://github.com/sindresorhus/escape-string-regexp.
 *
 * @param {string} s - The regexp string to escape.
 * @returns {string}
 */
export declare function escapeRegexp(s: string): string;
/**
 * Returns the base URL of the app.
 *
 * @param {Object} w - Window object to use instead of the built in one.
 * @returns {string}
 */
export declare function getBaseUrl(w?: typeof window): string;
/**
 * Returns the namespace for all global variables, functions, etc that we need.
 *
 * @returns {Object} The namespace.
 *
 * NOTE: After React-ifying everything this should be the only global.
 */
export declare function getJitsiMeetGlobalNS(): any;
/**
 * Prints the error and reports it to the global error handler.
 *
 * @param {Error} e - The error object.
 * @param {string} msg - A custom message to print in addition to the error.
 * @returns {void}
 */
export declare function reportError(e: Error, msg?: string): void;
/**
 * Adds alpha to a color css string.
 *
 * @param {string} color - The color string either in rgb... Or #... Format.
 * @param {number} opacity -The opacity(alpha) to apply to the color. Can take a value between 0 and 1, including.
 * @returns {string} - The color with applied alpha.
 */
export declare function setColorAlpha(color: string, opacity: number): string;
/**
 * Sorts an object by a sort function, same functionality as array.sort().
 *
 * @param {Object} object - The data object.
 * @param {Function} callback - The sort function.
 * @returns {void}
 */
export declare function objectSort(object: Object, callback: Function): {};
