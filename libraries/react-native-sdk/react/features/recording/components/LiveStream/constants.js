"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOUR_GROUPS_DASH_SEPARATED = exports.JITSI_LIVE_STREAMING_HELP_LINK = exports.YOUTUBE_TERMS_URL = exports.YOUTUBE_LIVE_DASHBOARD_URL = exports.GOOGLE_PRIVACY_POLICY = void 0;
/**
 * The URL for Google Privacy Policy.
 */
exports.GOOGLE_PRIVACY_POLICY = 'https://policies.google.com/privacy';
/**
 * The URL that is the main landing page for YouTube live streaming and should
 * have a user's live stream key.
 */
exports.YOUTUBE_LIVE_DASHBOARD_URL = 'https://www.youtube.com/live_dashboard';
/**
 * The URL for YouTube terms and conditions.
 */
exports.YOUTUBE_TERMS_URL = 'https://www.youtube.com/t/terms';
/**
 * The live streaming help link to display.
 */
exports.JITSI_LIVE_STREAMING_HELP_LINK = 'https://jitsi.org/live';
/**
 *  The YouTube stream link RegExp.
 */
exports.FOUR_GROUPS_DASH_SEPARATED = /^(?:[a-zA-Z0-9]{4}(?:-(?!$)|$)){4}/;
