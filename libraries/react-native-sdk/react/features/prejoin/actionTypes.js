"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_PREJOIN_PAGE_VISIBILITY = exports.SET_PREJOIN_DEVICE_ERRORS = exports.SET_PREJOIN_AUDIO_MUTED = exports.SET_PREJOIN_AUDIO_DISABLED = exports.SET_JOIN_BY_PHONE_DIALOG_VISIBLITY = exports.SET_DIALOUT_STATUS = exports.SET_DIALOUT_NUMBER = exports.SET_DIALOUT_COUNTRY = exports.SET_SKIP_PREJOIN_RELOAD = exports.SET_DEVICE_STATUS = exports.PREJOIN_INITIALIZED = exports.PREJOIN_JOINING_IN_PROGRESS = void 0;
/**
 * Action type to signal that joining is in progress.
 */
exports.PREJOIN_JOINING_IN_PROGRESS = 'PREJOIN_JOINING_IN_PROGRESS';
/**
 * Action type to signal that prejoin page was initialized.
 */
exports.PREJOIN_INITIALIZED = 'PREJOIN_INITIALIZED';
/**
 * Action type to set the status of the device.
 */
exports.SET_DEVICE_STATUS = 'SET_DEVICE_STATUS';
/**
 * Action type to set the visibility of the prejoin page when client is forcefully reloaded.
 */
exports.SET_SKIP_PREJOIN_RELOAD = 'SET_SKIP_PREJOIN_RELOAD';
/**
 * Action type to set the country to dial out to.
 */
exports.SET_DIALOUT_COUNTRY = 'SET_DIALOUT_COUNTRY';
/**
 * Action type to set the dial out number.
 */
exports.SET_DIALOUT_NUMBER = 'SET_DIALOUT_NUMBER';
/**
 * Action type to set the dial out status while dialing.
 */
exports.SET_DIALOUT_STATUS = 'SET_DIALOUT_STATUS';
/**
 * Action type to set the visibility of the 'JoinByPhone' dialog.
 */
exports.SET_JOIN_BY_PHONE_DIALOG_VISIBLITY = 'SET_JOIN_BY_PHONE_DIALOG_VISIBLITY';
/**
 * Action type to disable the audio while on prejoin page.
 */
exports.SET_PREJOIN_AUDIO_DISABLED = 'SET_PREJOIN_AUDIO_DISABLED';
/**
 * Action type to mute/unmute the audio while on prejoin page.
 */
exports.SET_PREJOIN_AUDIO_MUTED = 'SET_PREJOIN_AUDIO_MUTED';
/**
 * Action type to set the errors while creating the prejoin streams.
 */
exports.SET_PREJOIN_DEVICE_ERRORS = 'SET_PREJOIN_DEVICE_ERRORS';
/**
 * Action type to set the visibility of the prejoin page.
 */
exports.SET_PREJOIN_PAGE_VISIBILITY = 'SET_PREJOIN_PAGE_VISIBILITY';
