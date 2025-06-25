"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_FILE_SIZE = exports.SCREENSHOT_QUEUE_LIMIT = exports.TIMEOUT_TICK = exports.CLEAR_TIMEOUT = exports.SET_TIMEOUT = exports.POLL_INTERVAL = exports.PERCENTAGE_LOWER_BOUND = void 0;
/**
 * Percent of pixels that signal if two images should be considered different.
 */
exports.PERCENTAGE_LOWER_BOUND = 4;
/**
 * Number of milliseconds that represent how often screenshots should be taken.
 */
exports.POLL_INTERVAL = 2000;
/**
 * SET_TIMEOUT constant is used to set interval and it is set in
 * the id property of the request.data property. TimeMs property must
 * also be set.
 *
 * ```
 * Request.data example:
 * {
 *      id: SET_TIMEOUT,
 *      timeMs: 33
 * }
 * ```
 */
exports.SET_TIMEOUT = 1;
/**
 * CLEAR_TIMEOUT constant is used to clear the interval and it is set in
 * the id property of the request.data property.
 *
 * ```
 * {
 *      id: CLEAR_TIMEOUT
 * }
 * ```
 */
exports.CLEAR_TIMEOUT = 2;
/**
 * TIMEOUT_TICK constant is used as response and it is set in the id property.
 *
 * ```
 * {
 *      id: TIMEOUT_TICK
 * }
 * ```
 */
exports.TIMEOUT_TICK = 3;
exports.SCREENSHOT_QUEUE_LIMIT = 3;
exports.MAX_FILE_SIZE = 1000000;
