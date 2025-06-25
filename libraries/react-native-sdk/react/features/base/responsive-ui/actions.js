"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNarrowLayout = exports.setSafeAreaInsets = exports.setParticipantContextMenuOpen = exports.setReducedUI = exports.setAspectRatio = exports.clientResized = void 0;
const react_redux_1 = require("react-redux");
const constants_1 = require("../../chat/constants");
const functions_1 = require("../../participants-pane/functions");
const participantsPaneTheme_json_1 = __importDefault(require("../components/themes/participantsPaneTheme.json"));
const actionTypes_1 = require("./actionTypes");
const constants_2 = require("./constants");
/**
 * Size threshold for determining if we are in reduced UI mode or not.
 *
 * FIXME The logic to base {@code reducedUI} on a hardcoded width or height is
 * very brittle because it's completely disconnected from the UI which wants to
 * be rendered and, naturally, it broke on iPad where even the secondary Toolbar
 * didn't fit in the height. We do need to measure the actual UI at runtime and
 * determine whether and how to render it.
 */
const REDUCED_UI_THRESHOLD = 300;
/**
 * Indicates a resize of the window.
 *
 * @param {number} clientWidth - The width of the window.
 * @param {number} clientHeight - The height of the window.
 * @returns {Object}
 */
function clientResized(clientWidth, clientHeight) {
    return (dispatch, getState) => {
        let availableWidth = clientWidth;
        if (navigator.product !== 'ReactNative') {
            const state = getState();
            const { isOpen: isChatOpen } = state['features/chat'];
            const isParticipantsPaneOpen = (0, functions_1.getParticipantsPaneOpen)(state);
            if (isChatOpen) {
                availableWidth -= constants_1.CHAT_SIZE;
            }
            if (isParticipantsPaneOpen) {
                availableWidth -= participantsPaneTheme_json_1.default.participantsPaneWidth;
            }
        }
        (0, react_redux_1.batch)(() => {
            dispatch({
                type: actionTypes_1.CLIENT_RESIZED,
                clientHeight,
                clientWidth: availableWidth
            });
            dispatch(setAspectRatio(clientWidth, clientHeight));
        });
    };
}
exports.clientResized = clientResized;
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
function setAspectRatio(width, height) {
    return (dispatch, getState) => {
        // Don't change the aspect ratio if width and height are the same, that
        // is, if we transition to a 1:1 aspect ratio.
        if (width !== height) {
            const aspectRatio = width < height ? constants_2.ASPECT_RATIO_NARROW : constants_2.ASPECT_RATIO_WIDE;
            if (aspectRatio
                !== getState()['features/base/responsive-ui'].aspectRatio) {
                return dispatch({
                    type: actionTypes_1.SET_ASPECT_RATIO,
                    aspectRatio
                });
            }
        }
    };
}
exports.setAspectRatio = setAspectRatio;
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
function setReducedUI(width, height) {
    return (dispatch, getState) => {
        const reducedUI = Math.min(width, height) < REDUCED_UI_THRESHOLD;
        if (reducedUI !== getState()['features/base/responsive-ui'].reducedUI) {
            return dispatch({
                type: actionTypes_1.SET_REDUCED_UI,
                reducedUI
            });
        }
    };
}
exports.setReducedUI = setReducedUI;
/**
 * Sets whether the local or remote participant context menu is open.
 *
 * @param {boolean} isOpen - Whether local or remote context menu is open.
 * @returns {Object}
 */
function setParticipantContextMenuOpen(isOpen) {
    return {
        type: actionTypes_1.SET_CONTEXT_MENU_OPEN,
        isOpen
    };
}
exports.setParticipantContextMenuOpen = setParticipantContextMenuOpen;
/**
 * Sets the insets from the SafeAreaProvider.
 *
 * @param {Object} insets - The new insets to be set.
 * @returns {{
 *    type: SAFE_AREA_INSETS_CHANGED,
 *    insets: Object
 * }}
 */
function setSafeAreaInsets(insets) {
    return {
        type: actionTypes_1.SAFE_AREA_INSETS_CHANGED,
        insets
    };
}
exports.setSafeAreaInsets = setSafeAreaInsets;
/**
 * Sets narrow layout.
 *
 * @param {boolean} isNarrow - Whether is narrow layout.
 * @returns {{
*    type: SET_NARROW_LAYOUT,
*    isNarrow: boolean
* }}
 */
function setNarrowLayout(isNarrow) {
    return {
        type: actionTypes_1.SET_NARROW_LAYOUT,
        isNarrow
    };
}
exports.setNarrowLayout = setNarrowLayout;
