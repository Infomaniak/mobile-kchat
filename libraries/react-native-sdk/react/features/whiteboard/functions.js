"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWhiteboardInfoForURIString = exports.shouldNotifyUserLimit = exports.shouldEnforceUserLimit = exports.isWhiteboardAllowed = exports.isWhiteboardVisible = exports.getCollabServerUrl = exports.generateCollabServerUrl = exports.isWhiteboardPresent = exports.isWhiteboardButtonVisible = exports.isWhiteboardOpen = exports.isWhiteboardEnabled = exports.getCollabDetails = exports.getWhiteboardConfig = void 0;
const js_md5_1 = __importDefault(require("js-md5"));
const functions_1 = require("../../features/base/participants/functions");
const functions_2 = require("../base/conference/functions");
const functions_3 = require("../base/participants/functions");
const httpUtils_1 = require("../base/util/httpUtils");
const uri_1 = require("../base/util/uri");
const functions_4 = require("../breakout-rooms/functions");
const constants_1 = require("./constants");
const getWhiteboardState = (state) => state['features/whiteboard'];
const getWhiteboardConfig = (state) => state['features/base/config'].whiteboard || {};
exports.getWhiteboardConfig = getWhiteboardConfig;
const getWhiteboardUserLimit = (state) => {
    const userLimit = (0, exports.getWhiteboardConfig)(state).userLimit || Infinity;
    return userLimit === Infinity
        ? userLimit
        : Math.max(Number((0, exports.getWhiteboardConfig)(state).userLimit || 1), constants_1.MIN_USER_LIMIT);
};
/**
 * Returns the whiteboard collaboration details.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {{ roomId: string, roomKey: string}|undefined}
 */
const getCollabDetails = (state) => getWhiteboardState(state).collabDetails;
exports.getCollabDetails = getCollabDetails;
/**
 * Indicates whether the whiteboard collaboration details are available.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
const hasCollabDetails = (state) => Boolean((0, exports.getCollabDetails)(state)?.roomId && (0, exports.getCollabDetails)(state)?.roomKey);
/**
 * Indicates whether the whiteboard is enabled.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
const isWhiteboardEnabled = (state) => ((0, exports.getWhiteboardConfig)(state).enabled || hasCollabDetails(state))
    && (0, exports.getWhiteboardConfig)(state).collabServerBaseUrl
    && (0, functions_2.getCurrentConference)(state)?.getMetadataHandler()
        ?.isSupported();
exports.isWhiteboardEnabled = isWhiteboardEnabled;
/**
 * Indicates whether the whiteboard is open.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
const isWhiteboardOpen = (state) => getWhiteboardState(state).isOpen;
exports.isWhiteboardOpen = isWhiteboardOpen;
/**
 * Indicates whether the whiteboard button is visible.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
const isWhiteboardButtonVisible = (state) => (0, exports.isWhiteboardEnabled)(state) && ((0, functions_3.isLocalParticipantModerator)(state) || (0, exports.isWhiteboardOpen)(state));
exports.isWhiteboardButtonVisible = isWhiteboardButtonVisible;
/**
 * Indicates whether the whiteboard is present as a meeting participant.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
const isWhiteboardPresent = (state) => (0, functions_3.getRemoteParticipants)(state).has(constants_1.WHITEBOARD_ID);
exports.isWhiteboardPresent = isWhiteboardPresent;
/**
 * Builds the whiteboard collaboration server url.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {string}
 */
const generateCollabServerUrl = (state) => {
    const collabServerBaseUrl = (0, exports.getWhiteboardConfig)(state).collabServerBaseUrl;
    if (!collabServerBaseUrl) {
        return;
    }
    const { locationURL } = state['features/base/connection'];
    const inBreakoutRoom = (0, functions_4.isInBreakoutRoom)(state);
    const roomId = (0, functions_4.getCurrentRoomId)(state);
    const room = js_md5_1.default.hex(`${locationURL?.origin}${(0, uri_1.getBackendSafePath)(locationURL?.pathname)}${inBreakoutRoom ? `|${roomId}` : ''}`);
    return (0, uri_1.appendURLParam)(collabServerBaseUrl, 'room', room);
};
exports.generateCollabServerUrl = generateCollabServerUrl;
/**
 * Returns the whiteboard collaboration server url.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {string}
 */
const getCollabServerUrl = (state) => getWhiteboardState(state).collabServerUrl;
exports.getCollabServerUrl = getCollabServerUrl;
/**
 * Whether the whiteboard is visible on stage.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
const isWhiteboardVisible = (state) => (0, functions_1.getPinnedParticipant)(state)?.id === constants_1.WHITEBOARD_ID
    || state['features/large-video'].participantId === constants_1.WHITEBOARD_ID;
exports.isWhiteboardVisible = isWhiteboardVisible;
/**
* Indicates whether the whiteboard is accessible to a participant that has a moderator role.
*
* @param {IReduxState} state - The state from the Redux store.
* @returns {boolean}
*/
const isWhiteboardAllowed = (state) => (0, exports.isWhiteboardEnabled)(state) && (0, functions_3.isLocalParticipantModerator)(state);
exports.isWhiteboardAllowed = isWhiteboardAllowed;
/**
 * Whether to enforce the whiteboard user limit.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
const shouldEnforceUserLimit = (state) => {
    const userLimit = getWhiteboardUserLimit(state);
    if (userLimit === Infinity) {
        return false;
    }
    const participantCount = (0, functions_1.getParticipantCount)(state);
    return participantCount > userLimit;
};
exports.shouldEnforceUserLimit = shouldEnforceUserLimit;
/**
 * Whether to show a warning about the whiteboard user limit.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
const shouldNotifyUserLimit = (state) => {
    const userLimit = getWhiteboardUserLimit(state);
    if (userLimit === Infinity) {
        return false;
    }
    const participantCount = (0, functions_1.getParticipantCount)(state);
    return participantCount + constants_1.USER_LIMIT_THRESHOLD > userLimit;
};
exports.shouldNotifyUserLimit = shouldNotifyUserLimit;
/**
 * Generates the URL for the static whiteboard page.
 *
 * @param {string} locationUrl - The window location href.
 * @param {string} collabServerUrl - The whiteboard collaboration server url.
 * @param {Object} collabDetails - The whiteboard collaboration details.
 * @param {string} localParticipantName - The local participant name.
 * @returns {string}
 */
function getWhiteboardInfoForURIString(locationUrl, collabServerUrl, collabDetails, localParticipantName) {
    if (!collabServerUrl || !locationUrl) {
        return undefined;
    }
    let state = {};
    let url = `${locationUrl.substring(0, locationUrl.lastIndexOf('/'))}/${constants_1.WHITEBOARD_PATH_NAME}`;
    if (collabDetails?.roomId) {
        state = {
            ...state,
            roomId: collabDetails.roomId
        };
    }
    if (collabDetails?.roomKey) {
        state = {
            ...state,
            roomKey: collabDetails.roomKey
        };
    }
    state = {
        ...state,
        collabServerUrl,
        localParticipantName
    };
    url = (0, uri_1.appendURLHashParam)(url, 'state', (0, httpUtils_1.encodeToBase64URL)(JSON.stringify(state)));
    return url;
}
exports.getWhiteboardInfoForURIString = getWhiteboardInfoForURIString;
