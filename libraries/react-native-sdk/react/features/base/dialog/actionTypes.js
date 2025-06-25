"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPEN_SHEET = exports.OPEN_DIALOG = exports.HIDE_SHEET = exports.HIDE_DIALOG = void 0;
/**
 * The type of Redux action which closes a dialog
 *
 * {
 *     type: HIDE_DIALOG
 * }
 */
exports.HIDE_DIALOG = 'HIDE_DIALOG';
/**
 * The type of Redux action which closes a sheet.
 *
 * {
 *     type: HIDE_SHEET
 * }
 */
exports.HIDE_SHEET = 'HIDE_SHEET';
/**
 * The type of Redux action which begins a request to open a dialog.
 *
 * {
 *     type: OPEN_DIALOG,
 *     component: React.Component,
 *     props: PropTypes
 * }
 *
 */
exports.OPEN_DIALOG = 'OPEN_DIALOG';
/**
 * The type of Redux action which begins a request to open a sheet.
 *
 * {
 *     type: OPEN_SHEET,
 *     component: React.Component,
 *     props: PropTypes
 * }
 *
 */
exports.OPEN_SHEET = 'OPEN_SHEET';
