"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldUseFullScreen = void 0;
const functions_1 = require("../../base/conference/functions");
const functions_2 = require("../../base/dialog/functions");
const constants_1 = require("../../base/flags/constants");
const functions_3 = require("../../base/flags/functions");
const functions_any_1 = require("../../base/tracks/functions.any");
/**
 * Checks whether full-screen state should be used or not.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - Whether full-screen state shuld be used or not.
 */
function shouldUseFullScreen(state) {
    const { enabled: audioOnly } = state['features/base/audio-only'];
    const conference = (0, functions_1.getCurrentConference)(state);
    const dialogOpen = (0, functions_2.isAnyDialogOpen)(state);
    const fullscreenEnabled = (0, functions_3.getFeatureFlag)(state, constants_1.FULLSCREEN_ENABLED, true);
    const isDesktopSharing = (0, functions_any_1.isLocalVideoTrackDesktop)(state);
    return conference ? !audioOnly && !dialogOpen && !isDesktopSharing && fullscreenEnabled : false;
}
exports.shouldUseFullScreen = shouldUseFullScreen;
