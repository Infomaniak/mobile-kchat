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
exports.getNotResponsiveTileViewGridDimensions = exports.getMaxColumnCount = void 0;
const constants_1 = require("../filmstrip/constants");
const functions_web_1 = require("../filmstrip/functions.web");
__exportStar(require("./functions.any"), exports);
/**
 * Returns how many columns should be displayed in tile view. The number
 * returned will be between 1 and 7, inclusive.
 *
 * @param {Object} state - The redux store state.
 * @param {Object} options - Object with custom values used to override the values that we get from redux by default.
 * @param {number} options.width - Custom width to be used.
 * @param {boolean} options.disableResponsiveTiles - Custom value to be used instead of config.disableResponsiveTiles.
 * @param {boolean} options.disableTileEnlargement - Custom value to be used instead of config.disableTileEnlargement.
 * @returns {number}
 */
function getMaxColumnCount(state, options = {}) {
    if (typeof interfaceConfig === 'undefined') {
        return constants_1.DEFAULT_MAX_COLUMNS;
    }
    const { disableResponsiveTiles: configDisableResponsiveTiles, disableTileEnlargement: configDisableTileEnlargement } = state['features/base/config'];
    const { width, disableResponsiveTiles = configDisableResponsiveTiles, disableTileEnlargement = configDisableTileEnlargement } = options;
    const { clientWidth } = state['features/base/responsive-ui'];
    const widthToUse = width || clientWidth;
    const configuredMax = interfaceConfig.TILE_VIEW_MAX_COLUMNS;
    if (disableResponsiveTiles) {
        return Math.min(Math.max(configuredMax || constants_1.DEFAULT_MAX_COLUMNS, 1), constants_1.ABSOLUTE_MAX_COLUMNS);
    }
    if (typeof interfaceConfig.TILE_VIEW_MAX_COLUMNS !== 'undefined' && interfaceConfig.TILE_VIEW_MAX_COLUMNS > 0) {
        return Math.max(configuredMax, 1);
    }
    const aspectRatio = disableTileEnlargement
        ? (0, functions_web_1.getTileDefaultAspectRatio)(true, disableTileEnlargement, widthToUse)
        : constants_1.TILE_PORTRAIT_ASPECT_RATIO;
    const minHeight = (0, functions_web_1.getThumbnailMinHeight)(widthToUse);
    const minWidth = aspectRatio * minHeight;
    return Math.floor(widthToUse / minWidth);
}
exports.getMaxColumnCount = getMaxColumnCount;
/**
 * Returns the cell count dimensions for tile view. Tile view tries to uphold
 * equal count of tiles for height and width, until maxColumn is reached in
 * which rows will be added but no more columns.
 *
 * @param {Object} state - The redux store state.
 * @param {boolean} stageFilmstrip - Whether the dimensions should be calculated for the stage filmstrip.
 * @returns {Object} An object is return with the desired number of columns,
 * rows, and visible rows (the rest should overflow) for the tile view layout.
 */
function getNotResponsiveTileViewGridDimensions(state, stageFilmstrip = false) {
    const maxColumns = getMaxColumnCount(state);
    const { activeParticipants } = state['features/filmstrip'];
    const numberOfParticipants = stageFilmstrip ? activeParticipants.length : (0, functions_web_1.getNumberOfPartipantsForTileView)(state);
    const columnsToMaintainASquare = Math.ceil(Math.sqrt(numberOfParticipants));
    const columns = Math.min(columnsToMaintainASquare, maxColumns);
    const rows = Math.ceil(numberOfParticipants / columns);
    const minVisibleRows = Math.min(maxColumns, rows);
    return {
        columns,
        minVisibleRows,
        rows
    };
}
exports.getNotResponsiveTileViewGridDimensions = getNotResponsiveTileViewGridDimensions;
