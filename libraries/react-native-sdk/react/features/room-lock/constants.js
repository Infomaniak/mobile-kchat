"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOCKED_REMOTELY = exports.LOCKED_LOCALLY = void 0;
/**
 * The conference/room lock state which identifies that the password was set by
 * the current/local participant/user.
 *
 * @type {string}
 */
exports.LOCKED_LOCALLY = 'LOCKED_LOCALLY';
/**
 * The conference/room lock state which identifies that the password was set by
 * a remote participant/user.
 *
 * @type {string}
 */
exports.LOCKED_REMOTELY = 'LOCKED_REMOTELY';
