"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
// eslint-disable-next-line lines-around-comment
// @ts-expect-error
const util_1 = require("util");
// Some code adapted from https://github.com/houserater/react-native-lumberjack
// License: MIT
const { LogBridge } = react_native_1.NativeModules;
/**
 * Returns the stack trace for a given @code {Error} object.
 *
 * @param {Error} e - The error.
 * @returns {string} - The stack trace.
 */
function stackToString(e) {
    let ce;
    let s = e.stack;
    if (typeof e.cause === 'function' && (ce = e.cause())) {
        s += `\nCaused by: ${stackToString(ce)}`;
    }
    return s;
}
/**
 * Constructs a log transport object for use with @jitsi/logger.
 *
 * @returns {Object} - The transport object.
 */
function buildTransport() {
    return [
        'trace',
        'debug',
        'info',
        'log',
        'warn',
        'error'
    ].reduce((logger, logName) => {
        logger[logName] = (timestamp, ...args) => {
            // It ignores the timestamp argument, because LogBridge will add it on the native side anyway
            const nargs = args.map((arg) => {
                if (arg instanceof Error) {
                    const errorBody = {
                        message: arg.message,
                        // @ts-ignore
                        code: arg.code,
                        stack: stackToString(arg)
                    };
                    return `Error(${arg.name})${JSON.stringify(errorBody)}`;
                }
                return arg;
            });
            const message = (0, util_1.format)(...nargs);
            LogBridge[logName](message);
        };
        return logger;
    }, {});
}
exports.default = buildTransport();
