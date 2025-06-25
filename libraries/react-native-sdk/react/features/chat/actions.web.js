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
exports.toggleChat = exports.openChat = void 0;
// @ts-expect-error
const VideoLayout_1 = __importDefault(require("../../../modules/UI/videolayout/VideoLayout"));
const actionTypes_1 = require("./actionTypes");
const actions_any_1 = require("./actions.any");
__exportStar(require("./actions.any"), exports);
/**
 * Displays the chat panel.
 *
 * @param {Object} participant - The recipient for the private chat.
 * @param {Object} _disablePolls - Used on native.
 * @returns {{
 *     participant: Participant,
 *     type: OPEN_CHAT
 * }}
 */
function openChat(participant, _disablePolls) {
    return function (dispatch) {
        dispatch({
            participant,
            type: actionTypes_1.OPEN_CHAT
        });
    };
}
exports.openChat = openChat;
/**
 * Toggles display of the chat panel.
 *
 * @returns {Function}
 */
function toggleChat() {
    return (dispatch, getState) => {
        const isOpen = getState()['features/chat'].isOpen;
        if (isOpen) {
            dispatch((0, actions_any_1.closeChat)());
        }
        else {
            dispatch(openChat());
        }
        // Recompute the large video size whenever we toggle the chat, as it takes chat state into account.
        VideoLayout_1.default.onResize();
    };
}
exports.toggleChat = toggleChat;
