/**
 * Тhe status for a participant when it's invited to a conference.
 *
 * @type {string}
 */
export declare const INVITED = "Invited";
/**
 * Тhe status for a participant when a call has been initiated.
 *
 * @type {string}
 */
export declare const CALLING = "calling";
/**
 * Тhe status for a participant when the invite is received and its device(s)
 * are ringing.
 *
 * @type {string}
 */
export declare const RINGING = "ringing";
/**
 * A status for a participant that indicates the call is connected.
 *
 * @type {string}
 */
export declare const CONNECTED_USER = "connected";
/**
 * The status for a participant when the invitation is received but the user
 * has responded with busy message.
 *
 * @type {string}
 */
export declare const BUSY = "busy";
/**
 * The status for a participant when the invitation is rejected.
 *
 * @type {string}
 */
export declare const REJECTED = "rejected";
/**
 * The status for a participant when the invitation is ignored.
 *
 * @type {string}
 */
export declare const IGNORED = "ignored";
/**
  * The status for a participant when the invitation is expired.
 *
 * @type {string}
 */
export declare const EXPIRED = "expired";
/**
 * A status for a participant that indicates the call is in process of
 * initialization.
 * NOTE: Currently used for phone numbers only.
 *
 * @type {string}
 */
export declare const INITIALIZING_CALL = "Initializing Call";
/**
 * A status for a participant that indicates the call is in process of
 * connecting.
 * NOTE: Currently used for phone numbers only.
 *
 * @type {string}
 */
export declare const CONNECTING = "Connecting";
/**
 * A status for a participant that indicates the call is in process of
 * connecting.
 * NOTE: Currently used for phone numbers only.
 *
 * @type {string}
 */
export declare const CONNECTING2 = "Connecting*";
/**
 * A status for a phone number participant that indicates the call is connected.
 *
 * @type {string}
 */
export declare const CONNECTED_PHONE_NUMBER = "Connected";
/**
 * A status for a participant that indicates the call is disconnected.
 * NOTE: Currently used for phone numbers only.
 *
 * @type {string}
 */
export declare const DISCONNECTED = "Disconnected";
/**
 * Maps the presence status values to i18n translation keys.
 *
 * @type {Object<String, String>}
 */
export declare const STATUS_TO_I18N_KEY: {
    Invited: string;
    ringing: string;
    calling: string;
    busy: string;
    rejected: string;
    ignored: string;
    expired: string;
    "Initializing Call": string;
    Connecting: string;
    "Connecting*": string;
    Connected: string;
    connected: string;
    Disconnected: string;
};
