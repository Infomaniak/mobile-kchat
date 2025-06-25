"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.open = exports.showRoomParticipantMenu = exports.setVolume = exports.showSharedVideoMenu = exports.showContextMenuDetails = exports.showConnectionStatus = void 0;
const actions_1 = require("../base/dialog/actions");
const ConferenceNavigationContainerRef_1 = require("../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../mobile/navigation/routes");
const ConnectionStatusComponent_1 = __importDefault(require("../video-menu/components/native/ConnectionStatusComponent"));
// @ts-ignore
const LocalVideoMenu_1 = __importDefault(require("../video-menu/components/native/LocalVideoMenu"));
// @ts-ignore
const RemoteVideoMenu_1 = __importDefault(require("../video-menu/components/native/RemoteVideoMenu"));
// @ts-ignore
const SharedVideoMenu_1 = __importDefault(require("../video-menu/components/native/SharedVideoMenu"));
const actionTypes_1 = require("./actionTypes");
const RoomParticipantMenu_1 = __importDefault(require("./components/native/RoomParticipantMenu"));
__exportStar(require("./actions.any"), exports);
/**
 * Displays the connection status for the local meeting participant.
 *
 * @param {string} participantID - The selected meeting participant id.
 * @returns {Function}
 */
function showConnectionStatus(participantID) {
    return (0, actions_1.openSheet)(ConnectionStatusComponent_1.default, { participantID });
}
exports.showConnectionStatus = showConnectionStatus;
/**
 * Displays the context menu for the selected meeting participant.
 *
 * @param {string} participantId - The ID of the selected meeting participant.
 * @param {boolean} local - Whether the participant is local or not.
 * @returns {Function}
 */
function showContextMenuDetails(participantId, local = false) {
    return (dispatch, getState) => {
        const { remoteVideoMenu } = getState()['features/base/config'];
        if (local) {
            dispatch((0, actions_1.openSheet)(LocalVideoMenu_1.default));
        }
        else if (!remoteVideoMenu?.disabled) {
            dispatch((0, actions_1.openSheet)(RemoteVideoMenu_1.default, { participantId }));
        }
    };
}
exports.showContextMenuDetails = showContextMenuDetails;
/**
 * Displays the shared video menu.
 *
 * @param {string} participantId - The ID of the selected meeting participant.
 * @returns {Function}
 */
function showSharedVideoMenu(participantId) {
    return (0, actions_1.openSheet)(SharedVideoMenu_1.default, { participantId });
}
exports.showSharedVideoMenu = showSharedVideoMenu;
/**
 * Sets the volume.
 *
 * @param {string} participantId - The participant ID associated with the audio.
 * @param {string} volume - The volume level.
 * @returns {{
 *     type: SET_VOLUME,
 *     participantId: string,
 *     volume: number
 * }}
 */
function setVolume(participantId, volume) {
    return {
        type: actionTypes_1.SET_VOLUME,
        participantId,
        volume
    };
}
exports.setVolume = setVolume;
/**
 * Displays the breakout room participant menu.
 *
 * @param {Object} room - The room the participant is in.
 * @param {string} participantJid - The jid of the participant.
 * @param {string} participantName - The display name of the participant.
 * @returns {Function}
 */
function showRoomParticipantMenu(room, participantJid, participantName) {
    // @ts-ignore
    return (0, actions_1.openSheet)(RoomParticipantMenu_1.default, { room,
        participantJid,
        participantName });
}
exports.showRoomParticipantMenu = showRoomParticipantMenu;
/**
 * Action to open the participants pane.
 *
 * @returns {Object}
 */
const open = () => {
    (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.participants);
    return {
        type: actionTypes_1.PARTICIPANTS_PANE_OPEN
    };
};
exports.open = open;
