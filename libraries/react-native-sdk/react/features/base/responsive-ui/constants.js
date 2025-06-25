"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMALL_MOBILE_WIDTH = exports.ASPECT_RATIO_WIDE = exports.ASPECT_RATIO_NARROW = void 0;
/**
 * The aspect ratio constant which indicates that the width (of whatever the
 * aspect ratio constant is used for) is smaller than the height.
 *
 * @type {Symbol}
 */
exports.ASPECT_RATIO_NARROW = Symbol('ASPECT_RATIO_NARROW');
/**
 * The aspect ratio constant which indicates that the width (of whatever the
 * aspect ratio constant is used for) is larger than the height.
 *
 * @type {Symbol}
 */
exports.ASPECT_RATIO_WIDE = Symbol('ASPECT_RATIO_WIDE');
/**
 * Smallest supported mobile width.
 */
exports.SMALL_MOBILE_WIDTH = '320';
