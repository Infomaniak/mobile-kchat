"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScreenshareFilmstripParticipantId = exports.shouldDisplayLocalThumbnailSeparately = exports.getFilmstripDimensions = exports.isTopPanelEnabled = exports.isStageFilmstripEnabled = exports.isStageFilmstripAvailable = exports.isFilmstripScrollVisible = exports.getColumnCount = exports.getTileViewParticipantCount = exports.getPinnedActiveParticipants = exports.getActiveParticipantsIds = exports.shouldRemoteVideosBeVisible = exports.isFilmstripVisible = void 0;
const constants_1 = require("../base/flags/constants");
const functions_1 = require("../base/flags/functions");
const functions_2 = require("../base/participants/functions");
const Platform_native_1 = __importDefault(require("../base/react/Platform.native"));
const functions_3 = require("../base/redux/functions");
const constants_2 = require("../base/responsive-ui/constants");
const functions_any_1 = require("../base/settings/functions.any");
const styles_1 = __importDefault(require("../conference/components/native/styles"));
const functions_native_1 = require("../video-layout/functions.native");
const styles_2 = __importDefault(require("./components/native/styles"));
__exportStar(require("./functions.any"), exports);
/**
 * Returns true if the filmstrip on mobile is visible, false otherwise.
 *
 * NOTE: Filmstrip on mobile behaves differently to web, and is only visible
 * when there are at least 2 participants.
 *
 * @param {Object | Function} stateful - The Object or Function that can be
 * resolved to a Redux state object with the toState function.
 * @returns {boolean}
 */
function isFilmstripVisible(stateful) {
    const state = (0, functions_3.toState)(stateful);
    const enabled = (0, functions_1.getFeatureFlag)(state, constants_1.FILMSTRIP_ENABLED, true);
    if (!enabled) {
        return false;
    }
    return (0, functions_2.getParticipantCountWithFake)(state) > 1;
}
exports.isFilmstripVisible = isFilmstripVisible;
/**
 * Determines whether the remote video thumbnails should be displayed/visible in
 * the filmstrip.
 *
 * @param {Object} state - The full redux state.
 * @returns {boolean} - If remote video thumbnails should be displayed/visible
 * in the filmstrip, then {@code true}; otherwise, {@code false}.
 */
function shouldRemoteVideosBeVisible(state) {
    if (state['features/invite'].calleeInfoVisible) {
        return false;
    }
    // Include fake participants to derive how many thumbnails are displayed,
    // as it is assumed all participants, including fake, will be displayed
    // in the filmstrip.
    const participantCount = (0, functions_2.getParticipantCountWithFake)(state);
    const pinnedParticipant = (0, functions_2.getPinnedParticipant)(state);
    const { disable1On1Mode } = state['features/base/config'];
    return Boolean(participantCount > 2
        // Always show the filmstrip when there is another participant to
        // show and the local video is pinned. Note we are not taking the
        // toolbar visibility into account here (unlike web) because
        // showing / hiding views in quick succession on mobile is taxing.
        || (participantCount > 1 && pinnedParticipant?.local)
        || disable1On1Mode);
}
exports.shouldRemoteVideosBeVisible = shouldRemoteVideosBeVisible;
/**
 * Not implemented on mobile.
 *
 * @param {any} _state - Used on web.
 * @returns {Array<string>}
 */
function getActiveParticipantsIds(_state) {
    return [];
}
exports.getActiveParticipantsIds = getActiveParticipantsIds;
/**
 * Not implemented on mobile.
 *
 * @param {any} _state - Redux state.
 * @returns {Array<Object>}
 */
function getPinnedActiveParticipants(_state) {
    return [];
}
exports.getPinnedActiveParticipants = getPinnedActiveParticipants;
/**
 * Returns the number of participants displayed in tile view.
 *
 * @param {Object | Function} stateful - The Object or Function that can be
 * resolved to a Redux state object with the toState function.
 * @returns {number} - The number of participants displayed in tile view.
 */
function getTileViewParticipantCount(stateful) {
    const state = (0, functions_3.toState)(stateful);
    const disableSelfView = (0, functions_any_1.getHideSelfView)(state);
    const localParticipant = (0, functions_2.getLocalParticipant)(state);
    const participantCount = (0, functions_2.getParticipantCountWithFake)(state) - (disableSelfView && localParticipant ? 1 : 0);
    return participantCount;
}
exports.getTileViewParticipantCount = getTileViewParticipantCount;
/**
 * Returns how many columns should be displayed for tile view.
 *
 * @param {Object | Function} stateful - The Object or Function that can be
 * resolved to a Redux state object with the toState function.
 * @returns {number} - The number of columns to be rendered in tile view.
 * @private
 */
function getColumnCount(stateful) {
    const state = (0, functions_3.toState)(stateful);
    const participantCount = getTileViewParticipantCount(state);
    const { aspectRatio } = state['features/base/responsive-ui'];
    // For narrow view, tiles should stack on top of each other for a lonely
    // call and a 1:1 call. Otherwise tiles should be grouped into rows of
    // two.
    if (aspectRatio === constants_2.ASPECT_RATIO_NARROW) {
        return participantCount >= 3 ? 2 : 1;
    }
    if (participantCount === 4) {
        // In wide view, a four person call should display as a 2x2 grid.
        return 2;
    }
    return Math.min(participantCount <= 6 ? 3 : 4, participantCount);
}
exports.getColumnCount = getColumnCount;
/**
 * Returns true if the filmstrip has a scroll and false otherwise.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean} - True if the scroll is displayed and false otherwise.
 */
function isFilmstripScrollVisible(state) {
    if ((0, functions_native_1.shouldDisplayTileView)(state)) {
        return state['features/filmstrip']?.tileViewDimensions?.hasScroll;
    }
    const { aspectRatio, clientWidth, clientHeight, safeAreaInsets = {} } = state['features/base/responsive-ui'];
    const isNarrowAspectRatio = aspectRatio === constants_2.ASPECT_RATIO_NARROW;
    const disableSelfView = (0, functions_any_1.getHideSelfView)(state);
    const localParticipant = Boolean((0, functions_2.getLocalParticipant)(state));
    const localParticipantVisible = localParticipant && !disableSelfView;
    const participantCount = (0, functions_2.getParticipantCountWithFake)(state)
        - (localParticipant && (shouldDisplayLocalThumbnailSeparately() || disableSelfView) ? 1 : 0);
    const { height: thumbnailHeight, width: thumbnailWidth, margin } = styles_2.default.thumbnail;
    const { height, width } = getFilmstripDimensions({
        aspectRatio,
        clientWidth,
        clientHeight,
        insets: safeAreaInsets,
        localParticipantVisible
    });
    if (isNarrowAspectRatio) {
        return width < (thumbnailWidth + (2 * margin)) * participantCount;
    }
    return height < (thumbnailHeight + (2 * margin)) * participantCount;
}
exports.isFilmstripScrollVisible = isFilmstripScrollVisible;
/**
 * Whether the stage filmstrip is available or not.
 *
 * @param {any} _state - Used on web.
 * @param {any} _count - Used on web.
 * @returns {boolean}
 */
function isStageFilmstripAvailable(_state, _count) {
    return false;
}
exports.isStageFilmstripAvailable = isStageFilmstripAvailable;
/**
 * Whether the stage filmstrip is enabled.
 *
 * @param {any} _state - Used on web.
 * @returns {boolean}
 */
function isStageFilmstripEnabled(_state) {
    return false;
}
exports.isStageFilmstripEnabled = isStageFilmstripEnabled;
/**
 * Whether or not the top panel is enabled.
 *
 * @param {any} _state - Used on web.
 * @returns {boolean}
 */
function isTopPanelEnabled(_state) {
    return false;
}
exports.isTopPanelEnabled = isTopPanelEnabled;
/**
 * Calculates the width and height of the filmstrip based on the screen size and aspect ratio.
 *
 * @param {Object} options - The screen aspect ratio, width, height and safe are insets.
 * @returns {Object} - The width and the height.
 */
function getFilmstripDimensions({ aspectRatio, clientWidth, clientHeight, insets = {}, localParticipantVisible = true }) {
    const { height, width, margin } = styles_2.default.thumbnail; // @ts-ignore
    const conferenceBorder = styles_1.default.conference.borderWidth || 0;
    const { left = 0, right = 0, top = 0, bottom = 0 } = insets;
    if (aspectRatio === constants_2.ASPECT_RATIO_NARROW) {
        return {
            height,
            width: (shouldDisplayLocalThumbnailSeparately() && localParticipantVisible
                ? clientWidth - width - (margin * 2) : clientWidth)
                - left - right - (styles_2.default.filmstripNarrow.margin * 2) - (conferenceBorder * 2)
        };
    }
    return {
        height: (shouldDisplayLocalThumbnailSeparately() && localParticipantVisible
            ? clientHeight - height - (margin * 2) : clientHeight)
            - top - bottom - (conferenceBorder * 2),
        width
    };
}
exports.getFilmstripDimensions = getFilmstripDimensions;
/**
 * Returns true if the local thumbnail should be displayed separately and false otherwise.
 *
 * @returns {boolean} - True if the local thumbnail should be displayed separately and flase otherwise.
 */
function shouldDisplayLocalThumbnailSeparately() {
    // XXX Our current design is to have the local participant separate from
    // the remote participants. Unfortunately, Android's Video
    // implementation cannot accommodate that because remote participants'
    // videos appear on top of the local participant's video at times.
    // That's because Android's Video utilizes EGL and EGL gives us only two
    // practical layers in which we can place our participants' videos:
    // layer #0 sits behind the window, creates a hole in the window, and
    // there we render the LargeVideo; layer #1 is known as media overlay in
    // EGL terms, renders on top of layer #0, and, consequently, is for the
    // Filmstrip. With the separate LocalThumbnail, we should have left the
    // remote participants' Thumbnails in layer #1 and utilized layer #2 for
    // LocalThumbnail. Unfortunately, layer #2 is not practical (that's why
    // I said we had two practical layers only) because it renders on top of
    // everything which in our case means on top of participant-related
    // indicators such as moderator, audio and video muted, etc. For now we
    // do not have much of a choice but to continue rendering LocalThumbnail
    // as any other remote Thumbnail on Android.
    return Platform_native_1.default.OS !== 'android';
}
exports.shouldDisplayLocalThumbnailSeparately = shouldDisplayLocalThumbnailSeparately;
/**
 * Not implemented on mobile.
 *
 * @param {any} _state - Used on web.
 * @returns {undefined}
 */
function getScreenshareFilmstripParticipantId(_state) {
    return undefined;
}
exports.getScreenshareFilmstripParticipantId = getScreenshareFilmstripParticipantId;
