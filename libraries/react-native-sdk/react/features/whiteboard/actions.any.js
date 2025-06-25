"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyWhiteboardLimit = exports.setWhiteboardOpen = exports.resetWhiteboard = exports.setupWhiteboard = void 0;
const actions_1 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const actionTypes_1 = require("./actionTypes");
/**
 * Configures the whiteboard collaboration details.
 *
 * @param {Object} payload - The whiteboard settings.
 * @returns {{
 *     type: SETUP_WHITEBOARD,
 *     collabDetails: { roomId: string, roomKey: string },
 *     collabServerUrl: string
 * }}
 */
const setupWhiteboard = ({ collabDetails, collabServerUrl }) => {
    return {
        type: actionTypes_1.SETUP_WHITEBOARD,
        collabDetails,
        collabServerUrl
    };
};
exports.setupWhiteboard = setupWhiteboard;
/**
 * Cleans up the whiteboard collaboration settings.
 * To be used only on native for cleanup in between conferences.
 *
 * @returns {{
 *     type: RESET_WHITEBOARD
 * }}
 */
const resetWhiteboard = () => {
    return { type: actionTypes_1.RESET_WHITEBOARD };
};
exports.resetWhiteboard = resetWhiteboard;
/**
 * Sets the whiteboard visibility status.
 *
 * @param {boolean} isOpen - The whiteboard visibility flag.
 * @returns {{
 *      type: SET_WHITEBOARD_OPEN,
 *      isOpen
 * }}
 */
const setWhiteboardOpen = (isOpen) => {
    return {
        type: actionTypes_1.SET_WHITEBOARD_OPEN,
        isOpen
    };
};
exports.setWhiteboardOpen = setWhiteboardOpen;
/**
 * Shows a warning notification about the whiteboard user limit.
 *
 * @returns {Function}
 */
const notifyWhiteboardLimit = () => (dispatch) => {
    dispatch((0, actions_1.showWarningNotification)({
        titleKey: 'notify.whiteboardLimitTitle',
        descriptionKey: 'notify.whiteboardLimitDescription'
    }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
};
exports.notifyWhiteboardLimit = notifyWhiteboardLimit;
