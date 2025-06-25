"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timerWorkerScript = exports.TIMEOUT_TICK = exports.CLEAR_TIMEOUT = exports.SET_TIMEOUT = void 0;
/**
 * SET_TIMEOUT constant is used to set interval and it is set in
 * the id property of the request.data property. TimeMs property must
 * also be set.
 *
 * ```
 * //Request.data example:
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
/**
 * The following code is needed as string to create a URL from a Blob.
 * The URL is then passed to a WebWorker. Reason for this is to enable
 * use of setInterval that is not throttled when tab is inactive.
 */
const code = `
    var timer;

    onmessage = function(request) {
        switch (request.data.id) {
        case ${exports.SET_TIMEOUT}: {
            timer = setTimeout(() => {
                postMessage({ id: ${exports.TIMEOUT_TICK} });
            }, request.data.timeMs);
            break;
        }
        case ${exports.CLEAR_TIMEOUT}: {
            if (timer) {
                clearTimeout(timer);
            }
            break;
        }
        }
    };
`;
// @ts-ignore
exports.timerWorkerScript = URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));
