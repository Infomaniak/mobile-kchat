/**
 * Fixed name of the whiteboard fake participant.
 */
export declare const WHITEBOARD_PARTICIPANT_NAME = "Whiteboard";
/**
 * Whiteboard ID.
 */
export declare const WHITEBOARD_ID = "whiteboard";
/**
 * Whiteboard UI Options.
 */
export declare const WHITEBOARD_UI_OPTIONS: {
    canvasActions: {
        allowedShapes: string[];
        allowedShortcuts: string[];
        disableAlignItems: boolean;
        disableFileDrop: boolean;
        disableGrouping: boolean;
        disableHints: boolean;
        disableLink: boolean;
        disableShortcuts: boolean;
        disableVerticalAlignOptions: boolean;
        fontSizeOptions: string[];
        hideArrowHeadsOptions: boolean;
        hideColorInput: boolean;
        hideClearCanvas: boolean;
        hideFontFamily: boolean;
        hideHelpDialog: boolean;
        hideIOActions: boolean;
        hideLayers: boolean;
        hideLibraries: boolean;
        hideLockButton: boolean;
        hideOpacityInput: boolean;
        hideSharpness: boolean;
        hideStrokeStyle: boolean;
        hideTextAlign: boolean;
        hideThemeControls: boolean;
        hideUserList: boolean;
        saveAsImageOptions: {
            defaultBackgroundValue: boolean;
            disableScale: boolean;
            disableSelection: boolean;
            disableClipboard: boolean;
            disableSceneEmbed: boolean;
            hideTheme: boolean;
        };
    };
};
/**
 * Whiteboard default lower limit.
 */
export declare const MIN_USER_LIMIT = 10;
/**
 * Whiteboard soft limit diff.
 */
export declare const USER_LIMIT_THRESHOLD = 5;
/**
 * The pathName for the whiteboard page.
 *
 * @type {string}
 */
export declare const WHITEBOARD_PATH_NAME = "static/whiteboard.html";
