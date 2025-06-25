"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOP_FILMSTRIP_HEIGHT = exports.MAX_ACTIVE_PARTICIPANTS = exports.FILMSTRIP_TYPE = exports.ACTIVE_PARTICIPANT_TIMEOUT = exports.VERTICAL_VIEW_HORIZONTAL_MARGIN = exports.MIN_STAGE_VIEW_WIDTH = exports.MIN_STAGE_VIEW_HEIGHT = exports.FILMSTRIP_BREAKPOINT_OFFSET = exports.FILMSTRIP_GRID_BREAKPOINT = exports.FILMSTRIP_BREAKPOINT = exports.DEFAULT_LOCAL_TILE_ASPECT_RATIO = exports.DEFAULT_FILMSTRIP_WIDTH = exports.INDICATORS_TOOLTIP_POSITION = exports.STATS_POPOVER_POSITION = exports.THUMBNAIL_TYPE = exports.TILE_MARGIN = exports.SHOW_TOOLBAR_CONTEXT_MENU_AFTER = exports.HORIZONTAL_FILMSTRIP_MARGIN = exports.VERTICAL_FILMSTRIP_MIN_HORIZONTAL_MARGIN = exports.VERTICAL_FILMSTRIP_VERTICAL_MARGIN = exports.SCROLL_SIZE = exports.STAGE_VIEW_THUMBNAIL_VERTICAL_BORDER = exports.STAGE_VIEW_THUMBNAIL_HORIZONTAL_BORDER = exports.TOOLBAR_HEIGHT_MOBILE = exports.TOOLBAR_HEIGHT = exports.TILE_VIEW_GRID_HORIZONTAL_MARGIN = exports.TILE_VIEW_GRID_VERTICAL_MARGIN = exports.TILE_VERTICAL_CONTAINER_HORIZONTAL_MARGIN = exports.TILE_HORIZONTAL_MARGIN = exports.TILE_VERTICAL_MARGIN = exports.DISPLAY_MODE_TO_CLASS_NAME = exports.DISPLAY_AVATAR = exports.DISPLAY_VIDEO = exports.ABSOLUTE_MAX_COLUMNS = exports.DEFAULT_MAX_COLUMNS = exports.TILE_VIEW_DEFAULT_NUMBER_OF_VISIBLE_TILES = exports.TILE_PORTRAIT_ASPECT_RATIO = exports.TILE_MIN_HEIGHT_LARGE = exports.TILE_MIN_HEIGHT_SMALL = exports.ASPECT_RATIO_BREAKPOINT = exports.DISPLAY_DRAWER_THRESHOLD = exports.SQUARE_TILE_ASPECT_RATIO = exports.TILE_ASPECT_RATIO = exports.FILMSTRIP_SIZE = exports.SMALL_THUMBNAIL_SIZE = void 0;
const BoxModel_1 = require("../base/styles/components/styles/BoxModel");
/**
 * The size (height and width) of the small (not tile view) thumbnails.
 */
exports.SMALL_THUMBNAIL_SIZE = 80;
/**
 * The height of the filmstrip in narrow aspect ratio, or width in wide.
 */
exports.FILMSTRIP_SIZE = exports.SMALL_THUMBNAIL_SIZE + BoxModel_1.BoxModel.margin;
/**
 * The aspect ratio of a tile in tile view.
 */
exports.TILE_ASPECT_RATIO = 16 / 9;
/**
 * The aspect ratio of a square tile in tile view.
 */
exports.SQUARE_TILE_ASPECT_RATIO = 1;
/**
 * Width below which the overflow menu(s) will be displayed as drawer(s).
 */
exports.DISPLAY_DRAWER_THRESHOLD = 512;
/**
 * Breakpoint past which the aspect ratio is switched in tile view.
 * Also, past this breakpoint, if there are two participants in the conference, we enforce
 * single column view.
 * If this is to be modified, please also change the related media query from the tile_view scss file.
 */
exports.ASPECT_RATIO_BREAKPOINT = 500;
/**
 * Minimum height of tile for small screens.
 */
exports.TILE_MIN_HEIGHT_SMALL = 150;
/**
 * Minimum height of tile for large screens.
 */
exports.TILE_MIN_HEIGHT_LARGE = 200;
/**
 * Aspect ratio for portrait tiles.
 */
exports.TILE_PORTRAIT_ASPECT_RATIO = 1 / 1.3;
/**
 * The default number of visible tiles for tile view.
 */
exports.TILE_VIEW_DEFAULT_NUMBER_OF_VISIBLE_TILES = 25;
/**
 * The default number of columns for tile view.
 */
exports.DEFAULT_MAX_COLUMNS = 5;
/**
 * An extended number of columns for tile view.
 */
exports.ABSOLUTE_MAX_COLUMNS = 7;
/**
 * Display mode constant used when video is being displayed on the small video.
 *
 * @type {number}
 * @constant
 */
exports.DISPLAY_VIDEO = 0;
/**
 * Display mode constant used when the user's avatar is being displayed on
 * the small video.
 *
 * @type {number}
 * @constant
 */
exports.DISPLAY_AVATAR = 1;
/**
 * Maps the display modes to class name that will be applied on the thumbnail container.
 *
 * @type {Array<string>}
 * @constant
 */
exports.DISPLAY_MODE_TO_CLASS_NAME = [
    'display-video',
    'display-avatar-only'
];
/**
 * The vertical margin of a tile.
 *
 * @type {number}
 */
exports.TILE_VERTICAL_MARGIN = 4;
/**
 * The horizontal margin of a tile.
 *
 * @type {number}
 */
exports.TILE_HORIZONTAL_MARGIN = 4;
/**
 * The horizontal margin of a vertical filmstrip tile container.
 *
 * @type {number}
 */
exports.TILE_VERTICAL_CONTAINER_HORIZONTAL_MARGIN = 2;
/**
 * The vertical margin of the tile grid container.
 *
 * @type {number}
 */
exports.TILE_VIEW_GRID_VERTICAL_MARGIN = 14;
/**
 * The horizontal margin of the tile grid container.
 *
 * @type {number}
 */
exports.TILE_VIEW_GRID_HORIZONTAL_MARGIN = 14;
/**
 * The height of the whole toolbar.
 */
exports.TOOLBAR_HEIGHT = 72;
/**
 * The height of the whole toolbar.
 */
exports.TOOLBAR_HEIGHT_MOBILE = 60;
/**
 * The size of the horizontal border of a thumbnail.
 *
 * @type {number}
 */
exports.STAGE_VIEW_THUMBNAIL_HORIZONTAL_BORDER = 4;
/**
 * The size of the vertical border of a thumbnail.
 *
 * @type {number}
 */
exports.STAGE_VIEW_THUMBNAIL_VERTICAL_BORDER = 4;
/**
 * The size of the scroll.
 *
 * @type {number}
 */
exports.SCROLL_SIZE = 7;
/**
 * The total vertical space between the thumbnails container and the edges of the window.
 *
 * NOTE: This will include margins, paddings and the space for the 'hide filmstrip' icon.
 *
 * @type {number}
 */
exports.VERTICAL_FILMSTRIP_VERTICAL_MARGIN = 26;
/**
 * The min horizontal space between the thumbnails container and the edges of the window.
 *
 * @type {number}
 */
exports.VERTICAL_FILMSTRIP_MIN_HORIZONTAL_MARGIN = 10;
/**
 * The total horizontal space between the thumbnails container and the edges of the window.
 *
 * NOTE: This will include margins, paddings and the space for the 'hide filmstrip' icon.
 *
 * @type {number}
 */
exports.HORIZONTAL_FILMSTRIP_MARGIN = 39;
/**
 * Sets after how many ms to show the thumbnail context menu on long touch on mobile.
 *
 * @type {number}
 */
exports.SHOW_TOOLBAR_CONTEXT_MENU_AFTER = 600;
/**
 * The margin for each side of the tile view. Taken away from the available
 * width for the tile container to display in.
 *
 * NOTE: Mobile specific.
 *
 * @private
 * @type {number}
 */
exports.TILE_MARGIN = 10;
/**
 * The types of thumbnails for filmstrip.
 */
exports.THUMBNAIL_TYPE = {
    TILE: 'TILE',
    VERTICAL: 'VERTICAL',
    HORIZONTAL: 'HORIZONTAL'
};
/**
 * The popover position for the connection stats table.
 */
exports.STATS_POPOVER_POSITION = {
    [exports.THUMBNAIL_TYPE.TILE]: 'right-start',
    [exports.THUMBNAIL_TYPE.VERTICAL]: 'left-start',
    [exports.THUMBNAIL_TYPE.HORIZONTAL]: 'top-end'
};
/**
 * The tooltip position for the indicators on the thumbnail.
 */
exports.INDICATORS_TOOLTIP_POSITION = {
    [exports.THUMBNAIL_TYPE.TILE]: 'right',
    [exports.THUMBNAIL_TYPE.VERTICAL]: 'left',
    [exports.THUMBNAIL_TYPE.HORIZONTAL]: 'top'
};
/**
 * The default (and minimum) width for the vertical filmstrip (user resizable).
 */
exports.DEFAULT_FILMSTRIP_WIDTH = 120;
/**
 * The default aspect ratio for the local tile.
 */
exports.DEFAULT_LOCAL_TILE_ASPECT_RATIO = 16 / 9;
/**
 * The width of the filmstrip at which it no longer goes above the stage view, but it pushes it.
 */
exports.FILMSTRIP_BREAKPOINT = 180;
/**
 * The width of the filmstrip at which the display mode changes from column to grid.
 */
exports.FILMSTRIP_GRID_BREAKPOINT = 300;
/**
 * How much before the breakpoint should we display the background.
 * (We display the opaque background before we resize the stage view to make sure
 * the resize is not visible behind the filmstrip).
 */
exports.FILMSTRIP_BREAKPOINT_OFFSET = 5;
/**
 * The minimum height for the stage view
 * (used to determine the maximum height of the user-resizable top panel).
 */
exports.MIN_STAGE_VIEW_HEIGHT = 700;
/**
 * The minimum width for the stage view
 * (used to determine the maximum width of the user-resizable vertical filmstrip).
 */
exports.MIN_STAGE_VIEW_WIDTH = 800;
/**
 * Horizontal margin used for the vertical filmstrip.
 */
exports.VERTICAL_VIEW_HORIZONTAL_MARGIN = exports.VERTICAL_FILMSTRIP_MIN_HORIZONTAL_MARGIN
    + exports.SCROLL_SIZE + exports.TILE_HORIZONTAL_MARGIN + exports.STAGE_VIEW_THUMBNAIL_HORIZONTAL_BORDER;
/**
 * The time after which a participant should be removed from active participants.
 */
exports.ACTIVE_PARTICIPANT_TIMEOUT = 1000 * 60;
/**
 * The types of filmstrip.
 */
exports.FILMSTRIP_TYPE = {
    MAIN: 'main',
    STAGE: 'stage',
    SCREENSHARE: 'screenshare'
};
/**
 * The max number of participants to be displayed on the stage filmstrip.
 */
exports.MAX_ACTIVE_PARTICIPANTS = 6;
/**
 * Top filmstrip default height.
 */
exports.TOP_FILMSTRIP_HEIGHT = 180;
