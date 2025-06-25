"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHITEBOARD_PATH_NAME = exports.USER_LIMIT_THRESHOLD = exports.MIN_USER_LIMIT = exports.WHITEBOARD_UI_OPTIONS = exports.WHITEBOARD_ID = exports.WHITEBOARD_PARTICIPANT_NAME = void 0;
/**
 * Fixed name of the whiteboard fake participant.
 */
exports.WHITEBOARD_PARTICIPANT_NAME = 'Whiteboard';
/**
 * Whiteboard ID.
 */
exports.WHITEBOARD_ID = 'whiteboard';
/**
 * Whiteboard UI Options.
 */
exports.WHITEBOARD_UI_OPTIONS = {
    canvasActions: {
        allowedShapes: [
            'arrow', 'diamond', 'ellipse', 'freedraw', 'line', 'rectangle', 'selection', 'text'
        ],
        allowedShortcuts: [
            'cut', 'deleteSelectedElements', 'redo', 'selectAll', 'undo'
        ],
        disableAlignItems: true,
        disableFileDrop: true,
        disableGrouping: true,
        disableHints: true,
        disableLink: true,
        disableShortcuts: true,
        disableVerticalAlignOptions: true,
        fontSizeOptions: ['s', 'm', 'l'],
        hideArrowHeadsOptions: true,
        hideColorInput: true,
        hideClearCanvas: true,
        hideFontFamily: true,
        hideHelpDialog: true,
        hideIOActions: true,
        hideLayers: true,
        hideLibraries: true,
        hideLockButton: true,
        hideOpacityInput: true,
        hideSharpness: true,
        hideStrokeStyle: true,
        hideTextAlign: true,
        hideThemeControls: true,
        hideUserList: true,
        saveAsImageOptions: {
            defaultBackgroundValue: true,
            disableScale: true,
            disableSelection: true,
            disableClipboard: true,
            disableSceneEmbed: true,
            hideTheme: true
        }
    }
};
/**
 * Whiteboard default lower limit.
 */
exports.MIN_USER_LIMIT = 10;
/**
 * Whiteboard soft limit diff.
 */
exports.USER_LIMIT_THRESHOLD = 5;
/**
 * The pathName for the whiteboard page.
 *
 * @type {string}
 */
exports.WHITEBOARD_PATH_NAME = 'static/whiteboard.html';
