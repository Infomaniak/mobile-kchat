"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoQualityForStageThumbnails = exports.getVideoQualityForLargeVideo = exports.getVideoQualityForScreenSharingFilmstrip = exports.getVideoQualityForResizableFilmstripThumbnails = exports.isLayoutTileView = exports.updateAutoPinnedParticipant = exports.shouldDisplayTileView = exports.getCurrentLayout = exports.getAutoPinSetting = void 0;
const constants_1 = require("../base/flags/constants");
const functions_1 = require("../base/flags/functions");
const actions_1 = require("../base/participants/actions");
const functions_2 = require("../base/participants/functions");
const types_1 = require("../base/participants/types");
const functions_3 = require("../filmstrip/functions");
const functions_4 = require("../shared-video/functions");
const constants_2 = require("../video-quality/constants");
const functions_5 = require("../video-quality/functions");
const selector_1 = require("../video-quality/selector");
const constants_3 = require("./constants");
/**
 * A selector for retrieving the current automatic pinning setting.
 *
 * @private
 * @returns {string|undefined} The string "remote-only" is returned if only
 * remote screen sharing should be automatically pinned, any other truthy value
 * means automatically pin all screen shares. Falsy means do not automatically
 * pin any screen shares.
 */
function getAutoPinSetting() {
    return typeof interfaceConfig === 'object'
        ? interfaceConfig.AUTO_PIN_LATEST_SCREEN_SHARE
        : 'remote-only';
}
exports.getAutoPinSetting = getAutoPinSetting;
/**
 * Returns the {@code LAYOUTS} constant associated with the layout
 * the application should currently be in.
 *
 * @param {Object} state - The redux state.
 * @returns {string}
 */
function getCurrentLayout(state) {
    if (navigator.product === 'ReactNative') {
        // FIXME: what should this return?
        return undefined;
    }
    else if (shouldDisplayTileView(state)) {
        return constants_3.LAYOUTS.TILE_VIEW;
    }
    else if (interfaceConfig.VERTICAL_FILMSTRIP) {
        if ((0, functions_3.isStageFilmstripAvailable)(state, 2)) {
            return constants_3.LAYOUTS.STAGE_FILMSTRIP_VIEW;
        }
        return constants_3.LAYOUTS.VERTICAL_FILMSTRIP_VIEW;
    }
    return constants_3.LAYOUTS.HORIZONTAL_FILMSTRIP_VIEW;
}
exports.getCurrentLayout = getCurrentLayout;
/**
 * Selector for determining if the UI layout should be in tile view. Tile view
 * is determined by more than just having the tile view setting enabled, as
 * one-on-one calls should not be in tile view, as well as etherpad editing.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean} True if tile view should be displayed.
 */
function shouldDisplayTileView(state) {
    const tileViewDisabled = (0, functions_3.isTileViewModeDisabled)(state);
    if (tileViewDisabled) {
        return false;
    }
    const { tileViewEnabled } = state['features/video-layout'] ?? {};
    if (tileViewEnabled !== undefined) {
        // If the user explicitly requested a view mode, we
        // do that.
        return tileViewEnabled;
    }
    const tileViewEnabledFeatureFlag = (0, functions_1.getFeatureFlag)(state, constants_1.TILE_VIEW_ENABLED, true);
    const { disableTileView } = state['features/base/config'];
    if (disableTileView || !tileViewEnabledFeatureFlag) {
        return false;
    }
    const participantCount = (0, functions_2.getParticipantCount)(state);
    const { iAmRecorder } = state['features/base/config'];
    // None tile view mode is easier to calculate (no need for many negations), so we do
    // that and negate it only once.
    const shouldDisplayNormalMode = Boolean(
    // Reasons for normal mode:
    // Editing etherpad
    state['features/etherpad']?.editing
        // We pinned a participant
        || (0, functions_2.getPinnedParticipant)(state)
        // It's a 1-on-1 meeting
        || participantCount < 3
        // There is a shared YouTube video in the meeting
        || (0, functions_4.isVideoPlaying)(state)
        // We want jibri to use stage view by default
        || iAmRecorder);
    return !shouldDisplayNormalMode;
}
exports.shouldDisplayTileView = shouldDisplayTileView;
/**
 * Private helper to automatically pin the latest screen share stream or unpin
 * if there are no more screen share streams.
 *
 * @param {Array<string>} screenShares - Array containing the list of all the screen sharing endpoints
 * before the update was triggered (including the ones that have been removed from redux because of the update).
 * @param {Store} store - The redux store.
 * @returns {void}
 */
function updateAutoPinnedParticipant(screenShares, { dispatch, getState }) {
    const state = getState();
    const remoteScreenShares = state['features/video-layout'].remoteScreenShares;
    const pinned = (0, functions_2.getPinnedParticipant)(getState);
    // if the pinned participant is shared video or some other fake participant we want to skip auto-pinning
    if (pinned?.fakeParticipant && pinned.fakeParticipant !== types_1.FakeParticipant.RemoteScreenShare) {
        return;
    }
    // Unpin the screen share when the screen sharing participant leaves. Switch to tile view if no other
    // participant was pinned before screen share was auto-pinned, pin the previously pinned participant otherwise.
    if (!remoteScreenShares?.length) {
        let participantId = null;
        if (pinned && !screenShares.find(share => share === pinned.id)) {
            participantId = pinned.id;
        }
        dispatch((0, actions_1.pinParticipant)(participantId));
        return;
    }
    const latestScreenShareParticipantId = remoteScreenShares[remoteScreenShares.length - 1];
    if (latestScreenShareParticipantId) {
        dispatch((0, actions_1.pinParticipant)(latestScreenShareParticipantId));
    }
}
exports.updateAutoPinnedParticipant = updateAutoPinnedParticipant;
/**
 * Selector for whether we are currently in tile view.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean}
 */
function isLayoutTileView(state) {
    return getCurrentLayout(state) === constants_3.LAYOUTS.TILE_VIEW;
}
exports.isLayoutTileView = isLayoutTileView;
/**
 * Returns the video quality for the given height.
 *
 * @param {number|undefined} height - Height of the video container.
 * @returns {number}
 */
function getVideoQualityForHeight(height) {
    if (!height) {
        return constants_2.VIDEO_QUALITY_LEVELS.LOW;
    }
    const levels = Object.values(constants_2.VIDEO_QUALITY_LEVELS)
        .map(Number)
        .sort((a, b) => a - b);
    for (const level of levels) {
        if (height <= level) {
            return level;
        }
    }
    return constants_2.VIDEO_QUALITY_LEVELS.ULTRA;
}
/**
 * Returns the video quality level for the resizable filmstrip thumbnail height.
 *
 * @param {number} height - The height of the thumbnail.
 * @param {Object} state - Redux state.
 * @returns {number}
 */
function getVideoQualityForResizableFilmstripThumbnails(height, state) {
    if (!height) {
        return constants_2.VIDEO_QUALITY_LEVELS.LOW;
    }
    return (0, functions_5.getReceiverVideoQualityLevel)(height, (0, selector_1.getMinHeightForQualityLvlMap)(state));
}
exports.getVideoQualityForResizableFilmstripThumbnails = getVideoQualityForResizableFilmstripThumbnails;
/**
 * Returns the video quality level for the screen sharing filmstrip thumbnail height.
 *
 * @param {number} height - The height of the thumbnail.
 * @param {Object} state - Redux state.
 * @returns {number}
 */
function getVideoQualityForScreenSharingFilmstrip(height, state) {
    if (!height) {
        return constants_2.VIDEO_QUALITY_LEVELS.LOW;
    }
    return (0, functions_5.getReceiverVideoQualityLevel)(height, (0, selector_1.getMinHeightForQualityLvlMap)(state));
}
exports.getVideoQualityForScreenSharingFilmstrip = getVideoQualityForScreenSharingFilmstrip;
/**
 * Returns the video quality for the large video.
 *
 * @param {number} largeVideoHeight - The height of the large video.
 * @returns {number} - The video quality for the large video.
 */
function getVideoQualityForLargeVideo(largeVideoHeight) {
    return getVideoQualityForHeight(largeVideoHeight);
}
exports.getVideoQualityForLargeVideo = getVideoQualityForLargeVideo;
/**
 * Returns the video quality level for the thumbnails in the stage filmstrip.
 *
 * @param {number} height - The height of the thumbnails.
 * @param {Object} state - Redux state.
 * @returns {number}
 */
function getVideoQualityForStageThumbnails(height, state) {
    if (!height) {
        return constants_2.VIDEO_QUALITY_LEVELS.LOW;
    }
    return (0, functions_5.getReceiverVideoQualityLevel)(height, (0, selector_1.getMinHeightForQualityLvlMap)(state));
}
exports.getVideoQualityForStageThumbnails = getVideoQualityForStageThumbnails;
