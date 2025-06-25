"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiveStreaming = void 0;
const uri_1 = require("../../../base/util/uri");
const constants_1 = require("./constants");
/**
 * Get the live streaming options.
 *
 * @param {Object} state - The global state.
 * @returns {LiveStreaming}
 */
function getLiveStreaming(state) {
    const { liveStreaming = {} } = state['features/base/config'];
    const regexp = liveStreaming.validatorRegExpString && new RegExp(liveStreaming.validatorRegExpString);
    return {
        enabled: Boolean(liveStreaming.enabled),
        helpURL: (0, uri_1.sanitizeUrl)(liveStreaming.helpLink || constants_1.JITSI_LIVE_STREAMING_HELP_LINK)?.toString(),
        termsURL: (0, uri_1.sanitizeUrl)(liveStreaming.termsLink || constants_1.YOUTUBE_TERMS_URL)?.toString(),
        dataPrivacyURL: (0, uri_1.sanitizeUrl)(liveStreaming.dataPrivacyLink || constants_1.GOOGLE_PRIVACY_POLICY)?.toString(),
        streamLinkRegexp: regexp || constants_1.FOUR_GROUPS_DASH_SEPARATED
    };
}
exports.getLiveStreaming = getLiveStreaming;
