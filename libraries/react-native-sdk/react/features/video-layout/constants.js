"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LAYOUT_CLASSNAMES = exports.LAYOUTS = void 0;
/**
 * An enumeration of the different display layouts supported by the application.
 *
 * @type {Object}
 */
exports.LAYOUTS = {
    HORIZONTAL_FILMSTRIP_VIEW: 'horizontal-filmstrip-view',
    TILE_VIEW: 'tile-view',
    VERTICAL_FILMSTRIP_VIEW: 'vertical-filmstrip-view',
    STAGE_FILMSTRIP_VIEW: 'stage-filmstrip-view'
};
/**
 * The CSS class to apply so CSS can modify the app layout.
 *
 * @private
 */
exports.LAYOUT_CLASSNAMES = {
    [exports.LAYOUTS.HORIZONTAL_FILMSTRIP_VIEW]: 'horizontal-filmstrip',
    [exports.LAYOUTS.TILE_VIEW]: 'tile-view',
    [exports.LAYOUTS.VERTICAL_FILMSTRIP_VIEW]: 'vertical-filmstrip',
    [exports.LAYOUTS.STAGE_FILMSTRIP_VIEW]: 'stage-filmstrip'
};
