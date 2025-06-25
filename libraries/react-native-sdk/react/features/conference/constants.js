"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFRAME_EMBED_ALLOWED_LOCATIONS = exports.IFRAME_DISABLED_TIMEOUT_MINUTES = void 0;
const extraConstants_1 = require("./extraConstants");
/**
 * Timeout of the conference when iframe is disabled in minutes.
 */
exports.IFRAME_DISABLED_TIMEOUT_MINUTES = 5;
/**
 * A list of allowed location to embed iframe.
 */
/* eslint-disable-next-line no-extra-parens*/
exports.IFRAME_EMBED_ALLOWED_LOCATIONS = [].concat(extraConstants_1.IFRAME_EMBED_ALLOWED_LOCATIONS);
