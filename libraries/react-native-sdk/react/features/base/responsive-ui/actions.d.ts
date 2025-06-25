import { IStore } from '../../app/types';
/**
 * Indicates a resize of the window.
 *
 * @param {number} clientWidth - The width of the window.
 * @param {number} clientHeight - The height of the window.
 * @returns {Object}
 */
export declare function clientResized(clientWidth: number, clientHeight: number): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sets the aspect ratio of the app's user interface based on specific width and
 * height.
 *
 * @param {number} width - The width of the app's user interface.
 * @param {number} height - The height of the app's user interface.
 * @returns {{
 *     type: SET_ASPECT_RATIO,
 *     aspectRatio: Symbol
 * }}
 */
export declare function setAspectRatio(width: number, height: number): (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    type: string;
    aspectRatio: symbol;
} | undefined;
/**
 * Sets the "reduced UI" property. In reduced UI mode some components will
 * be hidden if there is no space to render them.
 *
 * @param {number} width - Current usable width.
 * @param {number} height - Current usable height.
 * @returns {{
 *     type: SET_REDUCED_UI,
 *     reducedUI: boolean
 * }}
 */
export declare function setReducedUI(width: number, height: number): (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    type: string;
    reducedUI: boolean;
} | undefined;
/**
 * Sets whether the local or remote participant context menu is open.
 *
 * @param {boolean} isOpen - Whether local or remote context menu is open.
 * @returns {Object}
 */
export declare function setParticipantContextMenuOpen(isOpen: boolean): {
    type: string;
    isOpen: boolean;
};
/**
 * Sets the insets from the SafeAreaProvider.
 *
 * @param {Object} insets - The new insets to be set.
 * @returns {{
 *    type: SAFE_AREA_INSETS_CHANGED,
 *    insets: Object
 * }}
 */
export declare function setSafeAreaInsets(insets: Object): {
    type: string;
    insets: Object;
};
/**
 * Sets narrow layout.
 *
 * @param {boolean} isNarrow - Whether is narrow layout.
 * @returns {{
*    type: SET_NARROW_LAYOUT,
*    isNarrow: boolean
* }}
 */
export declare function setNarrowLayout(isNarrow: boolean): {
    type: string;
    isNarrow: boolean;
};
