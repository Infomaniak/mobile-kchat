"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIB_WILL_INIT = exports.LIB_WILL_DISPOSE = exports.LIB_INIT_ERROR = exports.LIB_DID_INIT = exports.LIB_DID_DISPOSE = void 0;
/**
 * The type of Redux action which signals that {@link JitsiMeetJS} was disposed.
 *
 * {
 *     type: LIB_DID_DISPOSE
 * }
 */
exports.LIB_DID_DISPOSE = 'LIB_DID_DISPOSE';
/**
 * The type of Redux action which signals that {@link JitsiMeetJS.init()} was
 * invoked and completed successfully.
 *
 * {
 *     type: LIB_DID_INIT
 * }
 */
exports.LIB_DID_INIT = 'LIB_DID_INIT';
/**
 * Action to signal that lib-jitsi-meet initialized failed with error.
 *
 * {
 *     type: LIB_INIT_ERROR,
 *     error: Error
 * }
 */
exports.LIB_INIT_ERROR = 'LIB_INIT_ERROR';
/**
 * The type of Redux action which signals that {@link JitsiMeetJS} will be
 * disposed.
 *
 * {
 *     type: LIB_WILL_DISPOSE
 * }
 */
exports.LIB_WILL_DISPOSE = 'LIB_WILL_DISPOSE';
/**
 * The type of Redux action which signals that {@link JitsiMeetJS.init()} will
 * be invoked.
 *
 * {
 *     type: LIB_WILL_INIT
 * }
 */
exports.LIB_WILL_INIT = 'LIB_WILL_INIT';
