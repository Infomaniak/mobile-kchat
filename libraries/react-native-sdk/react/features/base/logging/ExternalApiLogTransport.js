"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Constructs a log transport object for use with external API.
 *
 * @param {Array} levels - The log levels forwarded to the external API.

 * @returns {Object} - The transport object.
 */
function buildTransport(levels) {
    return levels.reduce((logger, level) => {
        logger[level] = (...args) => {
            APP.API.notifyLog(level, args);
        };
        return logger;
    }, {});
}
exports.default = buildTransport;
