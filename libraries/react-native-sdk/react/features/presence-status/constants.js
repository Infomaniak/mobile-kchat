"use strict";
// User invite statuses
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_TO_I18N_KEY = exports.DISCONNECTED = exports.CONNECTED_PHONE_NUMBER = exports.CONNECTING2 = exports.CONNECTING = exports.INITIALIZING_CALL = exports.EXPIRED = exports.IGNORED = exports.REJECTED = exports.BUSY = exports.CONNECTED_USER = exports.RINGING = exports.CALLING = exports.INVITED = void 0;
/**
 * Тhe status for a participant when it's invited to a conference.
 *
 * @type {string}
 */
exports.INVITED = 'Invited';
/**
 * Тhe status for a participant when a call has been initiated.
 *
 * @type {string}
 */
exports.CALLING = 'calling';
/**
 * Тhe status for a participant when the invite is received and its device(s)
 * are ringing.
 *
 * @type {string}
 */
exports.RINGING = 'ringing';
/**
 * A status for a participant that indicates the call is connected.
 *
 * @type {string}
 */
exports.CONNECTED_USER = 'connected';
/**
 * The status for a participant when the invitation is received but the user
 * has responded with busy message.
 *
 * @type {string}
 */
exports.BUSY = 'busy';
/**
 * The status for a participant when the invitation is rejected.
 *
 * @type {string}
 */
exports.REJECTED = 'rejected';
/**
 * The status for a participant when the invitation is ignored.
 *
 * @type {string}
 */
exports.IGNORED = 'ignored';
/**
  * The status for a participant when the invitation is expired.
 *
 * @type {string}
 */
exports.EXPIRED = 'expired';
// Phone call statuses
/**
 * A status for a participant that indicates the call is in process of
 * initialization.
 * NOTE: Currently used for phone numbers only.
 *
 * @type {string}
 */
exports.INITIALIZING_CALL = 'Initializing Call';
/**
 * A status for a participant that indicates the call is in process of
 * connecting.
 * NOTE: Currently used for phone numbers only.
 *
 * @type {string}
 */
exports.CONNECTING = 'Connecting';
/**
 * A status for a participant that indicates the call is in process of
 * connecting.
 * NOTE: Currently used for phone numbers only.
 *
 * @type {string}
 */
exports.CONNECTING2 = 'Connecting*';
/**
 * A status for a phone number participant that indicates the call is connected.
 *
 * @type {string}
 */
exports.CONNECTED_PHONE_NUMBER = 'Connected';
/**
 * A status for a participant that indicates the call is disconnected.
 * NOTE: Currently used for phone numbers only.
 *
 * @type {string}
 */
exports.DISCONNECTED = 'Disconnected';
/**
 * Maps the presence status values to i18n translation keys.
 *
 * @type {Object<String, String>}
 */
exports.STATUS_TO_I18N_KEY = {
    [exports.INVITED]: 'presenceStatus.invited',
    [exports.RINGING]: 'presenceStatus.ringing',
    [exports.CALLING]: 'presenceStatus.calling',
    [exports.BUSY]: 'presenceStatus.busy',
    [exports.REJECTED]: 'presenceStatus.rejected',
    [exports.IGNORED]: 'presenceStatus.ignored',
    [exports.EXPIRED]: 'presenceStatus.expired',
    [exports.INITIALIZING_CALL]: 'presenceStatus.initializingCall',
    [exports.CONNECTING]: 'presenceStatus.connecting',
    [exports.CONNECTING2]: 'presenceStatus.connecting2',
    [exports.CONNECTED_PHONE_NUMBER]: 'presenceStatus.connected',
    [exports.CONNECTED_USER]: 'presenceStatus.connected',
    [exports.DISCONNECTED]: 'presenceStatus.disconnected'
};
