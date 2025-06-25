"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPGRADE_OPTIONS_LINK = exports.UPGRADE_OPTIONS_TEXT = exports.INVITE_TYPES = exports.SIP_ADDRESS_REGEX = exports.OUTGOING_CALL_START_SOUND_ID = exports.OUTGOING_CALL_RINGING_SOUND_ID = exports.OUTGOING_CALL_REJECTED_SOUND_ID = exports.OUTGOING_CALL_EXPIRED_SOUND_ID = exports.DIAL_IN_INFO_PAGE_PATH_NAME = void 0;
/**
 * The pathName for the dialInInfo page.
 *
 * @type {string}
 */
exports.DIAL_IN_INFO_PAGE_PATH_NAME = 'static/dialInInfo.html';
/**
 * The identifier of the sound to be played when the status of an outgoing call
 * is expired.
 *
 * @type {string}
 */
exports.OUTGOING_CALL_EXPIRED_SOUND_ID = 'OUTGOING_CALL_EXPIRED_SOUND';
/**
 * The identifier of the sound to be played when the status of an outgoing call
 * is rejected.
 *
 * @type {string}
 */
exports.OUTGOING_CALL_REJECTED_SOUND_ID = 'OUTGOING_CALL_REJECTED_SOUND';
/**
 * The identifier of the sound to be played when the status of an outgoing call
 * is ringing.
 *
 * @type {string}
 */
exports.OUTGOING_CALL_RINGING_SOUND_ID = 'OUTGOING_CALL_RINGING_SOUND';
/**
 * The identifier of the sound to be played when outgoing call is started.
 *
 * @type {string}
 */
exports.OUTGOING_CALL_START_SOUND_ID = 'OUTGOING_CALL_START_SOUND';
/**
 * Regex for matching sip addresses.
 */
// eslint-disable-next-line max-len
exports.SIP_ADDRESS_REGEX = /^[+a-zA-Z0-9]+(?:([^\s>:@]+)(?::([^\s@>]+))?@)?([\w\-.]+)(?::(\d+))?((?:;[^\s=?>;]+(?:=[^\s?;]+)?)*)(?:\?(([^\s&=>]+=[^\s&=>]+)(&[^\s&=>]+=[^\s&=>]+)*))?$/;
/**
 * Different invite types mapping.
 */
exports.INVITE_TYPES = {
    PHONE: 'phone',
    ROOM: 'room',
    SIP: 'sip',
    USER: 'user',
    VIDEO_ROOM: 'videosipgw'
};
exports.UPGRADE_OPTIONS_TEXT = 'jaas.8x8.vc';
exports.UPGRADE_OPTIONS_LINK = 'https://jaas.8x8.vc/#/plan/upgrade';
