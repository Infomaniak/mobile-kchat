import { IReduxState } from '../app/types';
export * from './functions.any';
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
export declare function getMaxColumnCount(state: IReduxState, options?: {
    disableResponsiveTiles?: boolean;
    disableTileEnlargement?: boolean;
    width?: number | null;
}): number;
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
export declare function getNotResponsiveTileViewGridDimensions(state: IReduxState, stageFilmstrip?: boolean): {
    columns: number;
    minVisibleRows: number;
    rows: number;
};
