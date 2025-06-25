import { IReduxState } from '../app/types';
import { IStateful } from '../base/app/types';
export * from './functions.any';
/**
 * Returns true if the filmstrip on mobile is visible, false otherwise.
 *
 * NOTE: Filmstrip on web behaves differently to mobile, much simpler, but so
 * function lies here only for the sake of consistency and to avoid flow errors
 * on import.
 *
 * @param {IStateful} stateful - The Object or Function that can be
 * resolved to a Redux state object with the toState function.
 * @returns {boolean}
 */
export declare function isFilmstripVisible(stateful: IStateful): boolean;
/**
 * Determines whether the remote video thumbnails should be displayed/visible in
 * the filmstrip.
 *
 * @param {IReduxState} state - The full redux state.
 * @returns {boolean} - If remote video thumbnails should be displayed/visible
 * in the filmstrip, then {@code true}; otherwise, {@code false}.
 */
export declare function shouldRemoteVideosBeVisible(state: IReduxState): boolean;
/**
 * Checks whether there is a playable video stream available for the user associated with the passed ID.
 *
 * @param {IStateful} stateful - The Object or Function that can be
 * resolved to a Redux state object with the toState function.
 * @param {string} id - The id of the participant.
 * @returns {boolean} <tt>true</tt> if there is a playable video stream available
 * or <tt>false</tt> otherwise.
 */
export declare function isVideoPlayable(stateful: IStateful, id: string): boolean;
/**
 * Calculates the size for thumbnails when in horizontal view layout.
 *
 * @param {number} clientHeight - The height of the app window.
 * @returns {{local: {height, width}, remote: {height, width}}}
 */
export declare function calculateThumbnailSizeForHorizontalView(clientHeight?: number): {
    local: {
        height: number;
        width: number;
    };
    remote: {
        height: number;
        width: number;
    };
};
/**
 * Calculates the size for thumbnails when in vertical view layout.
 *
 * @param {number} clientWidth - The height of the app window.
 * @param {number} filmstripWidth - The width of the filmstrip.
 * @param {boolean} isResizable - Whether the filmstrip is resizable or not.
 * @returns {{local: {height, width}, remote: {height, width}}}
 */
export declare function calculateThumbnailSizeForVerticalView(clientWidth?: number, filmstripWidth?: number, isResizable?: boolean): {
    local: {
        height: number;
        width: number;
    };
    remote: {
        height: number;
        width: number;
    };
};
/**
 * Returns the minimum height of a thumbnail.
 *
 * @param {number} clientWidth - The width of the window.
 * @returns {number} The minimum height of a thumbnail.
 */
export declare function getThumbnailMinHeight(clientWidth: number): 200 | 150;
/**
 * Returns the default aspect ratio for a tile.
 *
 * @param {boolean} disableResponsiveTiles - Indicates whether the responsive tiles functionality is disabled.
 * @param {boolean} disableTileEnlargement - Indicates whether the tiles enlargement functionality is disabled.
 * @param {number} clientWidth - The width of the window.
 * @returns {number} The default aspect ratio for a tile.
 */
export declare function getTileDefaultAspectRatio(disableResponsiveTiles: boolean, disableTileEnlargement: boolean, clientWidth: number): number;
/**
 * Returns the number of participants that will be displayed in tile view.
 *
 * @param {Object} state - The redux store state.
 * @returns {number} The number of participants that will be displayed in tile view.
 */
export declare function getNumberOfPartipantsForTileView(state: IReduxState): number;
/**
 * Calculates the dimensions (thumbnail width/height and columns/row) for tile view when the responsive tiles are
 * disabled.
 *
 * @param {Object} state - The redux store state.
 * @returns {Object} - The dimensions.
 */
export declare function calculateNonResponsiveTileViewDimensions(state: IReduxState): {
    height: number;
    width: number;
    columns: number;
    rows: number;
};
/**
 * Calculates the dimensions (thumbnail width/height and columns/row) for tile view when the responsive tiles are
 * enabled.
 *
 * @param {Object} state - The redux store state.
 * @returns {Object} - The dimensions.
 */
export declare function calculateResponsiveTileViewDimensions({ clientWidth, clientHeight, disableTileEnlargement, noHorizontalContainerMargin, maxColumns, numberOfParticipants, desiredNumberOfVisibleTiles, minTileHeight }: {
    clientHeight: number;
    clientWidth: number;
    desiredNumberOfVisibleTiles: number;
    disableTileEnlargement?: boolean;
    maxColumns: number;
    minTileHeight?: number | null;
    noHorizontalContainerMargin?: boolean;
    numberOfParticipants: number;
}): {
    height: number | undefined;
    width: number | undefined;
    columns: number | undefined;
    rows: number | undefined;
};
/**
 * Calculates the size for thumbnails when in tile view layout.
 *
 * @param {Object} dimensions - The desired dimensions of the tile view grid.
 * @returns {{hasScroll, height, width}}
 */
export declare function calculateThumbnailSizeForTileView({ columns, minVisibleRows, clientWidth, clientHeight, disableResponsiveTiles, disableTileEnlargement, noHorizontalContainerMargin, minTileHeight }: {
    clientHeight: number;
    clientWidth: number;
    columns: number;
    disableResponsiveTiles: boolean;
    disableTileEnlargement?: boolean;
    minTileHeight?: number | null;
    minVisibleRows: number;
    noHorizontalContainerMargin?: boolean;
}): {
    height: number;
    width: number;
    minHeightEnforced: boolean;
    maxVisibleRows: number;
} | undefined;
/**
 * Returns the width of the visible area (doesn't include the left margin/padding) of the the vertical filmstrip.
 *
 * @returns {number} - The width of the vertical filmstrip.
 */
export declare function getVerticalFilmstripVisibleAreaWidth(): number;
/**
 * Computes information that determine the display mode.
 *
 * @param {Object} input - Object containing all necessary information for determining the display mode for
 * the thumbnail.
 * @returns {number} - One of <tt>DISPLAY_VIDEO</tt> or <tt>DISPLAY_AVATAR</tt>.
*/
export declare function computeDisplayModeFromInput(input: any): 1 | 0;
/**
 * Extracts information for props and state needed to compute the display mode.
 *
 * @param {Object} props - The Thumbnail component's props.
 * @param {Object} state - The Thumbnail component's state.
 * @returns {Object}
*/
export declare function getDisplayModeInput(props: any, state: {
    canPlayEventReceived: boolean;
}): {
    filmstripType: any;
    isActiveParticipant: any;
    isCurrentlyOnLargeVideo: any;
    isAudioOnly: any;
    tileViewActive: boolean;
    isVideoPlayable: any;
    canPlayEventReceived: boolean;
    videoStream: boolean;
    isRemoteParticipant: boolean;
    isScreenSharing: any;
    isVirtualScreenshareParticipant: any;
    stageParticipantsVisible: any;
    videoStreamMuted: any;
};
/**
 * Gets the tooltip position for the thumbnail indicators.
 *
 * @param {string} thumbnailType - The current thumbnail type.
 * @returns {string}
 */
export declare function getIndicatorsTooltipPosition(thumbnailType?: string): "right" | "left" | "top";
/**
 * Returns whether or not the filmstrip is resizable.
 *
 * @param {Object} state - Redux state.
 * @returns {boolean}
 */
export declare function isFilmstripResizable(state: IReduxState): boolean;
/**
 * Whether or not grid should be displayed in the vertical filmstrip.
 *
 * @param {Object} state - Redux state.
 * @returns {boolean}
 */
export declare function showGridInVerticalView(state: IReduxState): boolean;
/**
 * Gets the vertical filmstrip max width.
 *
 * @param {Object} state - Redux state.
 * @returns {number}
 */
export declare function getVerticalViewMaxWidth(state: IReduxState): any;
/**
 * Returns true if the scroll is displayed and false otherwise.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean} - True if the scroll is displayed and false otherwise.
 */
export declare function isFilmstripScrollVisible(state: IReduxState): boolean;
/**
 * Gets the ids of the active participants.
 *
 * @param {Object} state - Redux state.
 * @returns {Array<string>}
 */
export declare function getActiveParticipantsIds(state: IReduxState): string[];
/**
 * Gets the ids of the active participants.
 *
 * @param {Object} state - Redux state.
 * @returns {Array<Object>}
 */
export declare function getPinnedActiveParticipants(state: IReduxState): {
    participantId: string;
    pinned?: boolean | undefined;
}[];
/**
 * Get whether or not the stage filmstrip is available (enabled & can be used).
 *
 * @param {Object} state - Redux state.
 * @param {number} minParticipantCount - The min number of participants for the stage filmstrip
 * to be displayed.
 * @returns {boolean}
 */
export declare function isStageFilmstripAvailable(state: IReduxState, minParticipantCount?: number): boolean;
/**
 * Whether the stage filmstrip should be displayed on the top.
 *
 * @param {Object} state - Redux state.
 * @param {number} minParticipantCount - The min number of participants for the stage filmstrip
 * to be displayed.
 * @returns {boolean}
 */
export declare function isStageFilmstripTopPanel(state: IReduxState, minParticipantCount?: number): boolean;
/**
 * Whether the stage filmstrip is disabled or not.
 *
 * @param {Object} state - Redux state.
 * @returns {boolean}
 */
export declare function isStageFilmstripEnabled(state: IReduxState): boolean;
/**
 * Whether the vertical/horizontal filmstrip is disabled.
 *
 * @param {Object} state - Redux state.
 * @returns {boolean}
 */
export declare function isFilmstripDisabled(state: IReduxState): boolean;
/**
 * Gets the thumbnail type by filmstrip type.
 *
 * @param {string} currentLayout - Current app layout.
 * @param {string} filmstripType - The current filmstrip type.
 * @returns {string}
 */
export declare function getThumbnailTypeFromLayout(currentLayout: string, filmstripType: string): string | undefined;
/**
 * Returns the id of the participant displayed on the screen share filmstrip.
 *
 * @param {Object} state - Redux state.
 * @returns {string} - The participant id.
 */
export declare function getScreenshareFilmstripParticipantId(state: IReduxState): string | undefined;
/**
 * Whether or not the top panel is enabled.
 *
 * @param {Object} state - Redux state.
 * @returns {boolean}
 */
export declare function isTopPanelEnabled(state: IReduxState): boolean;
