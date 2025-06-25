"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_HELP_CENTRE_URL = exports.DEFAULT_PRIVACY_URL = exports.DEFAULT_TERMS_URL = exports.FEATURE_FLAGS = exports.THIRD_PARTY_PREJOIN_BUTTONS = exports.PREMEETING_BUTTONS = exports._CONFIG_STORE_PREFIX = void 0;
/**
 * The prefix of the {@code localStorage} key into which {@link storeConfig}
 * stores and from which {@link restoreConfig} restores.
 *
 * @protected
 * @type string
 */
exports._CONFIG_STORE_PREFIX = 'config.js';
/**
 * The toolbar buttons to show on premeeting screens.
 */
exports.PREMEETING_BUTTONS = ['microphone', 'camera', 'select-background', 'invite', 'settings'];
/**
  * The toolbar buttons to show on 3rdParty prejoin screen.
  */
exports.THIRD_PARTY_PREJOIN_BUTTONS = ['microphone', 'camera', 'select-background'];
/**
 * The set of feature flags.
 *
 * @enum {string}
 */
exports.FEATURE_FLAGS = {
    SSRC_REWRITING: 'ssrcRewritingEnabled'
};
/**
 * The URL at which the terms (of service/use) are available to the user.
 */
exports.DEFAULT_TERMS_URL = 'https://jitsi.org/meet/terms';
/**
 * The URL at which the privacy policy is available to the user.
 */
exports.DEFAULT_PRIVACY_URL = 'https://jitsi.org/meet/privacy';
/**
 * The URL at which the help centre is available to the user.
 */
exports.DEFAULT_HELP_CENTRE_URL = 'https://web-cdn.jitsi.net/faq/meet-faq.html';
