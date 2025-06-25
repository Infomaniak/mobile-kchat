"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_NARROW_LAYOUT = exports.SET_CONTEXT_MENU_OPEN = exports.SET_REDUCED_UI = exports.SET_ASPECT_RATIO = exports.SAFE_AREA_INSETS_CHANGED = exports.CLIENT_RESIZED = void 0;
/**
 * The type of (redux) action which indicates that the client window has been resized.
 *
 * {
 *     type: CLIENT_RESIZED
 * }
 */
exports.CLIENT_RESIZED = 'CLIENT_RESIZED';
/**
 * The type of (redux) action which indicates that the insets from the SafeAreaProvider have changed.
 *
 * {
 *    type: SAFE_AREA_INSETS_CHANGED,
 *    insets: Object
 * }
 */
exports.SAFE_AREA_INSETS_CHANGED = 'SAFE_AREA_INSETS_CHANGED';
/**
 * The type of (redux) action which sets the aspect ratio of the app's user
 * interface.
 *
 * {
 *     type: SET_ASPECT_RATIO,
 *     aspectRatio: Symbol
 * }
 */
exports.SET_ASPECT_RATIO = 'SET_ASPECT_RATIO';
/**
 * The type of redux action which signals that the reduces UI mode was enabled
 * or disabled.
 *
 * {
 *     type: SET_REDUCED_UI,
 *     reducedUI: boolean
 * }
 *
 * @public
 */
exports.SET_REDUCED_UI = 'SET_REDUCED_UI';
/**
 * The type of (redux) action which tells whether a local or remote participant
 * context menu is open.
 *
 * {
 *     type: SET_CONTEXT_MENU_OPEN,
 *     showConnectionInfo: boolean
 * }
 */
exports.SET_CONTEXT_MENU_OPEN = 'SET_CONTEXT_MENU_OPEN';
/**
 * The type of redux action which signals whether we are in narrow layout.
 *
 * {
 *     type: SET_NARROW_LAYOUT,
 *     isNarrow: boolean
 * }
 *
 * @public
 */
exports.SET_NARROW_LAYOUT = 'SET_NARROW_LAYOUT';
