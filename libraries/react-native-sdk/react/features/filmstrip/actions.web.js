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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setScreenshareFilmstripParticipant = exports.setTopPanelVisible = exports.setScreensharingTileDimensions = exports.clearStageParticipants = exports.togglePinStageParticipant = exports.setStageParticipants = exports.removeStageParticipant = exports.addStageParticipant = exports.setUserIsResizing = exports.setUserFilmstripWidth = exports.setUserFilmstripHeight = exports.setFilmstripWidth = exports.setFilmstripHeight = exports.setVolume = exports.clickOnVideo = exports.setStageFilmstripViewDimensions = exports.setHorizontalViewDimensions = exports.setVerticalViewDimensions = exports.setTileViewDimensions = exports.resizeFilmStrip = void 0;
const actions_1 = require("../base/participants/actions");
const functions_1 = require("../base/participants/functions");
const functions_any_1 = require("../base/settings/functions.any");
const functions_web_1 = require("../video-layout/functions.web");
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
const functions_web_2 = require("./functions.web");
__exportStar(require("./actions.any"), exports);
/**
 * Resize the filmstrip.
 *
 * @param {number} width - Width value for filmstrip.
 *
 * @returns {{
 *  type: RESIZE_FILMSTRIP,
 *  width: number,
 * }}
 */
function resizeFilmStrip(width) {
    return {
        type: actionTypes_1.RESIZE_FILMSTRIP,
        width
    };
}
exports.resizeFilmStrip = resizeFilmStrip;
/**
 * Sets the dimensions of the tile view grid.
 *
 * @returns {Function}
 */
function setTileViewDimensions() {
    return (dispatch, getState) => {
        const state = getState();
        const { clientHeight, clientWidth } = state['features/base/responsive-ui'];
        const { disableResponsiveTiles, disableTileEnlargement, tileView = {} } = state['features/base/config'];
        const { numberOfVisibleTiles = constants_1.TILE_VIEW_DEFAULT_NUMBER_OF_VISIBLE_TILES } = tileView;
        const numberOfParticipants = (0, functions_web_2.getNumberOfPartipantsForTileView)(state);
        const maxColumns = (0, functions_web_1.getMaxColumnCount)(state);
        const { height, width, columns, rows } = disableResponsiveTiles
            ? (0, functions_web_2.calculateNonResponsiveTileViewDimensions)(state)
            : (0, functions_web_2.calculateResponsiveTileViewDimensions)({
                clientWidth,
                clientHeight,
                disableTileEnlargement,
                maxColumns,
                numberOfParticipants,
                desiredNumberOfVisibleTiles: numberOfVisibleTiles
            });
        const thumbnailsTotalHeight = (rows ?? 1) * (constants_1.TILE_VERTICAL_MARGIN + (height ?? 0));
        const availableHeight = clientHeight - constants_1.TILE_VIEW_GRID_VERTICAL_MARGIN;
        const hasScroll = availableHeight < thumbnailsTotalHeight;
        const filmstripWidth = Math.min(clientWidth - constants_1.TILE_VIEW_GRID_HORIZONTAL_MARGIN, (columns ?? 1) * (constants_1.TILE_HORIZONTAL_MARGIN + (width ?? 0)))
            + (hasScroll ? constants_1.SCROLL_SIZE : 0);
        const filmstripHeight = Math.min(availableHeight, thumbnailsTotalHeight);
        dispatch({
            type: actionTypes_1.SET_TILE_VIEW_DIMENSIONS,
            dimensions: {
                gridDimensions: {
                    columns,
                    rows
                },
                thumbnailSize: {
                    height,
                    width
                },
                filmstripHeight,
                filmstripWidth,
                hasScroll
            }
        });
    };
}
exports.setTileViewDimensions = setTileViewDimensions;
/**
 * Sets the dimensions of the thumbnails in vertical view.
 *
 * @returns {Function}
 */
function setVerticalViewDimensions() {
    return (dispatch, getState) => {
        const state = getState();
        const { clientHeight = 0, clientWidth = 0 } = state['features/base/responsive-ui'];
        const { width: filmstripWidth } = state['features/filmstrip'];
        const disableSelfView = (0, functions_any_1.getHideSelfView)(state);
        const resizableFilmstrip = (0, functions_web_2.isFilmstripResizable)(state);
        const _verticalViewGrid = (0, functions_web_2.showGridInVerticalView)(state);
        const numberOfRemoteParticipants = (0, functions_1.getRemoteParticipantCountWithFake)(state);
        const { localScreenShare } = state['features/base/participants'];
        let gridView = {};
        let thumbnails = {};
        let filmstripDimensions = {};
        let hasScroll = false;
        let remoteVideosContainerWidth;
        let remoteVideosContainerHeight;
        // grid view in the vertical filmstrip
        if (_verticalViewGrid) {
            const { tileView = {} } = state['features/base/config'];
            const { numberOfVisibleTiles = constants_1.TILE_VIEW_DEFAULT_NUMBER_OF_VISIBLE_TILES } = tileView;
            const numberOfParticipants = (0, functions_web_2.getNumberOfPartipantsForTileView)(state);
            const maxColumns = (0, functions_web_1.getMaxColumnCount)(state, {
                width: filmstripWidth.current,
                disableResponsiveTiles: false,
                disableTileEnlargement: false
            });
            const { height, width, columns, rows } = (0, functions_web_2.calculateResponsiveTileViewDimensions)({
                clientWidth: filmstripWidth.current ?? 0,
                clientHeight,
                disableTileEnlargement: false,
                maxColumns,
                noHorizontalContainerMargin: true,
                numberOfParticipants,
                desiredNumberOfVisibleTiles: numberOfVisibleTiles
            });
            const thumbnailsTotalHeight = (rows ?? 1) * (constants_1.TILE_VERTICAL_MARGIN + (height ?? 0));
            hasScroll = clientHeight < thumbnailsTotalHeight;
            const widthOfFilmstrip = ((columns ?? 1) * (constants_1.TILE_HORIZONTAL_MARGIN + (width ?? 0)))
                + (hasScroll ? constants_1.SCROLL_SIZE : 0);
            const filmstripHeight = Math.min(clientHeight - constants_1.TILE_VIEW_GRID_VERTICAL_MARGIN, thumbnailsTotalHeight);
            gridView = {
                gridDimensions: {
                    columns,
                    rows
                },
                thumbnailSize: {
                    height,
                    width
                },
                hasScroll
            };
            filmstripDimensions = {
                height: filmstripHeight,
                width: widthOfFilmstrip
            };
        }
        else {
            thumbnails = (0, functions_web_2.calculateThumbnailSizeForVerticalView)(clientWidth, filmstripWidth.current ?? 0, resizableFilmstrip);
            remoteVideosContainerWidth
                = thumbnails?.local?.width + constants_1.TILE_VERTICAL_CONTAINER_HORIZONTAL_MARGIN + constants_1.SCROLL_SIZE;
            remoteVideosContainerHeight
                = clientHeight - (disableSelfView ? 0 : thumbnails?.local?.height) - constants_1.VERTICAL_FILMSTRIP_VERTICAL_MARGIN;
            // Account for the height of the local screen share thumbnail when calculating the height of the remote
            // videos container.
            const localCameraThumbnailHeight = thumbnails?.local?.height;
            const localScreenShareThumbnailHeight = localScreenShare && !disableSelfView ? thumbnails?.local?.height : 0;
            remoteVideosContainerHeight = clientHeight
                - localCameraThumbnailHeight
                - localScreenShareThumbnailHeight
                - constants_1.VERTICAL_FILMSTRIP_VERTICAL_MARGIN;
            hasScroll
                = remoteVideosContainerHeight
                    < (thumbnails?.remote.height + constants_1.TILE_VERTICAL_MARGIN) * numberOfRemoteParticipants;
        }
        dispatch({
            type: actionTypes_1.SET_VERTICAL_VIEW_DIMENSIONS,
            dimensions: {
                ...thumbnails,
                remoteVideosContainer: _verticalViewGrid ? filmstripDimensions : {
                    width: remoteVideosContainerWidth,
                    height: remoteVideosContainerHeight
                },
                gridView,
                hasScroll
            }
        });
    };
}
exports.setVerticalViewDimensions = setVerticalViewDimensions;
/**
 * Sets the dimensions of the thumbnails in horizontal view.
 *
 * @returns {Function}
 */
function setHorizontalViewDimensions() {
    return (dispatch, getState) => {
        const state = getState();
        const { clientHeight = 0, clientWidth = 0 } = state['features/base/responsive-ui'];
        const disableSelfView = (0, functions_any_1.getHideSelfView)(state);
        const thumbnails = (0, functions_web_2.calculateThumbnailSizeForHorizontalView)(clientHeight);
        const remoteVideosContainerWidth = clientWidth - (disableSelfView ? 0 : thumbnails?.local?.width) - constants_1.HORIZONTAL_FILMSTRIP_MARGIN;
        const remoteVideosContainerHeight = thumbnails?.local?.height + constants_1.TILE_VERTICAL_MARGIN + constants_1.STAGE_VIEW_THUMBNAIL_VERTICAL_BORDER + constants_1.SCROLL_SIZE;
        const numberOfRemoteParticipants = (0, functions_1.getRemoteParticipantCountWithFake)(state);
        const hasScroll = remoteVideosContainerHeight
            < (thumbnails?.remote.width + constants_1.TILE_HORIZONTAL_MARGIN) * numberOfRemoteParticipants;
        dispatch({
            type: actionTypes_1.SET_HORIZONTAL_VIEW_DIMENSIONS,
            dimensions: {
                ...thumbnails,
                remoteVideosContainer: {
                    width: remoteVideosContainerWidth,
                    height: remoteVideosContainerHeight
                },
                hasScroll
            }
        });
    };
}
exports.setHorizontalViewDimensions = setHorizontalViewDimensions;
/**
 * Sets the dimensions of the stage filmstrip tile view grid.
 *
 * @returns {Function}
 */
function setStageFilmstripViewDimensions() {
    return (dispatch, getState) => {
        const state = getState();
        const { clientHeight, clientWidth } = state['features/base/responsive-ui'];
        const { tileView = {} } = state['features/base/config'];
        const { visible, topPanelHeight } = state['features/filmstrip'];
        const verticalWidth = visible ? (0, functions_web_2.getVerticalViewMaxWidth)(state) : 0;
        const { numberOfVisibleTiles = constants_1.MAX_ACTIVE_PARTICIPANTS } = tileView;
        const numberOfParticipants = state['features/filmstrip'].activeParticipants.length;
        const availableWidth = clientWidth - verticalWidth;
        const maxColumns = (0, functions_web_1.getMaxColumnCount)(state, {
            width: availableWidth,
            disableResponsiveTiles: false,
            disableTileEnlargement: false
        });
        const topPanel = (0, functions_web_2.isStageFilmstripTopPanel)(state);
        const { height, width, columns, rows } = (0, functions_web_2.calculateResponsiveTileViewDimensions)({
            clientWidth: availableWidth,
            clientHeight: topPanel ? topPanelHeight?.current || constants_1.TOP_FILMSTRIP_HEIGHT : clientHeight,
            disableTileEnlargement: false,
            maxColumns,
            noHorizontalContainerMargin: verticalWidth > 0,
            numberOfParticipants,
            desiredNumberOfVisibleTiles: numberOfVisibleTiles,
            minTileHeight: topPanel ? constants_1.TILE_MIN_HEIGHT_SMALL : null
        });
        const thumbnailsTotalHeight = (rows ?? 1) * (constants_1.TILE_VERTICAL_MARGIN + (height ?? 0));
        const hasScroll = clientHeight < thumbnailsTotalHeight;
        const filmstripWidth = Math.min(clientWidth - constants_1.TILE_VIEW_GRID_HORIZONTAL_MARGIN, (columns ?? 1) * (constants_1.TILE_HORIZONTAL_MARGIN + (width ?? 0)))
            + (hasScroll ? constants_1.SCROLL_SIZE : 0);
        const filmstripHeight = Math.min(clientHeight - constants_1.TILE_VIEW_GRID_VERTICAL_MARGIN, thumbnailsTotalHeight);
        dispatch({
            type: actionTypes_1.SET_STAGE_FILMSTRIP_DIMENSIONS,
            dimensions: {
                gridDimensions: {
                    columns,
                    rows
                },
                thumbnailSize: {
                    height,
                    width
                },
                filmstripHeight,
                filmstripWidth,
                hasScroll
            }
        });
    };
}
exports.setStageFilmstripViewDimensions = setStageFilmstripViewDimensions;
/**
 * Emulates a click on the n-th video.
 *
 * @param {number} n - Number that identifies the video.
 * @returns {Function}
 */
function clickOnVideo(n) {
    return (dispatch, getState) => {
        const state = getState();
        const { id: localId } = (0, functions_1.getLocalParticipant)(state) ?? {};
        // Use the list that correctly represents the current order of the participants as visible in the UI.
        const { remoteParticipants } = state['features/filmstrip'];
        const participants = [localId, ...remoteParticipants];
        if (participants.length - 1 < n) {
            return;
        }
        const { id, pinned } = (0, functions_1.getParticipantById)(state, participants[n] ?? '') ?? {};
        if ((0, functions_web_2.isStageFilmstripAvailable)(state)) {
            dispatch(togglePinStageParticipant(id ?? ''));
        }
        else {
            dispatch((0, actions_1.pinParticipant)(pinned ? null : id));
        }
    };
}
exports.clickOnVideo = clickOnVideo;
/**
 * Sets the volume for a thumbnail's audio.
 *
 * @param {string} participantId - The participant ID associated with the audio.
 * @param {string} volume - The volume level.
 * @returns {{
 *     type: SET_VOLUME,
 *     participantId: string,
 *     volume: number
 * }}
 */
function setVolume(participantId, volume) {
    return {
        type: actionTypes_1.SET_VOLUME,
        participantId,
        volume
    };
}
exports.setVolume = setVolume;
/**
 * Sets the top filmstrip's height.
 *
 * @param {number} height - The new height of the filmstrip.
 * @returns {{
 *      type: SET_FILMSTRIP_HEIGHT,
 *      height: number
 * }}
 */
function setFilmstripHeight(height) {
    return {
        type: actionTypes_1.SET_FILMSTRIP_HEIGHT,
        height
    };
}
exports.setFilmstripHeight = setFilmstripHeight;
/**
 * Sets the filmstrip's width.
 *
 * @param {number} width - The new width of the filmstrip.
 * @returns {{
 *      type: SET_FILMSTRIP_WIDTH,
 *      width: number
 * }}
 */
function setFilmstripWidth(width) {
    return {
        type: actionTypes_1.SET_FILMSTRIP_WIDTH,
        width
    };
}
exports.setFilmstripWidth = setFilmstripWidth;
/**
 * Sets the filmstrip's height and the user preferred height.
 *
 * @param {number} height - The new height of the filmstrip.
 * @returns {{
 *      type: SET_USER_FILMSTRIP_WIDTH,
 *      height: number
 * }}
 */
function setUserFilmstripHeight(height) {
    return {
        type: actionTypes_1.SET_USER_FILMSTRIP_HEIGHT,
        height
    };
}
exports.setUserFilmstripHeight = setUserFilmstripHeight;
/**
 * Sets the filmstrip's width and the user preferred width.
 *
 * @param {number} width - The new width of the filmstrip.
 * @returns {{
 *      type: SET_USER_FILMSTRIP_WIDTH,
 *      width: number
 * }}
 */
function setUserFilmstripWidth(width) {
    return {
        type: actionTypes_1.SET_USER_FILMSTRIP_WIDTH,
        width
    };
}
exports.setUserFilmstripWidth = setUserFilmstripWidth;
/**
 * Sets whether the user is resizing or not.
 *
 * @param {boolean} resizing - Whether the user is resizing or not.
 * @returns {Object}
 */
function setUserIsResizing(resizing) {
    return {
        type: actionTypes_1.SET_USER_IS_RESIZING,
        resizing
    };
}
exports.setUserIsResizing = setUserIsResizing;
/**
 * Add participant to the active participants list.
 *
 * @param {string} participantId - The Id of the participant to be added.
 * @param {boolean?} pinned - Whether the participant is pinned or not.
 * @returns {Object}
 */
function addStageParticipant(participantId, pinned = false) {
    return {
        type: actionTypes_1.ADD_STAGE_PARTICIPANT,
        participantId,
        pinned
    };
}
exports.addStageParticipant = addStageParticipant;
/**
 * Remove participant from the active participants list.
 *
 * @param {string} participantId - The Id of the participant to be removed.
 * @returns {Object}
 */
function removeStageParticipant(participantId) {
    return {
        type: actionTypes_1.REMOVE_STAGE_PARTICIPANT,
        participantId
    };
}
exports.removeStageParticipant = removeStageParticipant;
/**
 * Sets the active participants list.
 *
 * @param {Array<Object>} queue - The new list.
 * @returns {Object}
 */
function setStageParticipants(queue) {
    return {
        type: actionTypes_1.SET_STAGE_PARTICIPANTS,
        queue
    };
}
exports.setStageParticipants = setStageParticipants;
/**
 * Toggles the pin state of the given participant.
 *
 * @param {string} participantId - The id of the participant to be toggled.
 * @returns {Object}
 */
function togglePinStageParticipant(participantId) {
    return {
        type: actionTypes_1.TOGGLE_PIN_STAGE_PARTICIPANT,
        participantId
    };
}
exports.togglePinStageParticipant = togglePinStageParticipant;
/**
 * Clears the stage participants list.
 *
 * @returns {Object}
 */
function clearStageParticipants() {
    return {
        type: actionTypes_1.CLEAR_STAGE_PARTICIPANTS
    };
}
exports.clearStageParticipants = clearStageParticipants;
/**
 * Set the screensharing tile dimensions.
 *
 * @returns {Object}
 */
function setScreensharingTileDimensions() {
    return (dispatch, getState) => {
        const state = getState();
        const { clientHeight, clientWidth } = state['features/base/responsive-ui'];
        const { visible, topPanelHeight, topPanelVisible } = state['features/filmstrip'];
        const verticalWidth = visible ? (0, functions_web_2.getVerticalViewMaxWidth)(state) : 0;
        const availableWidth = clientWidth - verticalWidth;
        const topPanel = (0, functions_web_2.isStageFilmstripTopPanel)(state) && topPanelVisible;
        const availableHeight = clientHeight - (topPanel ? topPanelHeight?.current || constants_1.TOP_FILMSTRIP_HEIGHT : 0);
        dispatch({
            type: actionTypes_1.SET_SCREENSHARING_TILE_DIMENSIONS,
            dimensions: {
                filmstripHeight: availableHeight,
                filmstripWidth: availableWidth,
                thumbnailSize: {
                    width: availableWidth - constants_1.TILE_HORIZONTAL_MARGIN,
                    height: availableHeight - constants_1.TILE_VERTICAL_MARGIN
                }
            }
        });
    };
}
exports.setScreensharingTileDimensions = setScreensharingTileDimensions;
/**
 * Sets the visibility of the top panel.
 *
 * @param {boolean} visible - Whether it should be visible or not.
 * @returns {Object}
 */
function setTopPanelVisible(visible) {
    return {
        type: actionTypes_1.SET_TOP_PANEL_VISIBILITY,
        visible
    };
}
exports.setTopPanelVisible = setTopPanelVisible;
/**
 * Sets the participant whose screenshare to be displayed on the filmstrip.
 *
 * @param {string|undefined} participantId - The id of the participant to be set.
 * @returns {Object}
 */
function setScreenshareFilmstripParticipant(participantId) {
    return {
        type: actionTypes_1.SET_SCREENSHARE_FILMSTRIP_PARTICIPANT,
        participantId
    };
}
exports.setScreenshareFilmstripParticipant = setScreenshareFilmstripParticipant;
