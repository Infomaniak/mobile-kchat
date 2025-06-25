"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARTICIPANT_VERIFIED = exports.START_VERIFICATION = exports.SET_MEDIA_ENCRYPTION_KEY = exports.SET_MAX_MODE = exports.TOGGLE_E2EE = void 0;
/**
 * The type of the action which signals that E2EE needs to be enabled / disabled.
 *
 * {
 *     type: TOGGLE_E2EE
 * }
 */
exports.TOGGLE_E2EE = 'TOGGLE_E2EE';
/**
 * The type of the action which signals to set new value E2EE maxMode.
 *
 * {
 *     type: SET_MAX_MODE
 * }
 */
exports.SET_MAX_MODE = 'SET_MAX_MODE';
/**
 * The type of the action which signals to set media encryption key for e2ee.
 *
 * {
 *     type: SET_MEDIA_ENCRYPTION_KEY
 * }
 */
exports.SET_MEDIA_ENCRYPTION_KEY = 'SET_MEDIA_ENCRYPTION_KEY';
exports.START_VERIFICATION = 'START_VERIFICATION';
exports.PARTICIPANT_VERIFIED = 'PARTICIPANT_VERIFIED';
