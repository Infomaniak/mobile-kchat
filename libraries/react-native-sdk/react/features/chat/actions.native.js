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
Object.defineProperty(exports, "__esModule", { value: true });
exports.openChat = void 0;
const ConferenceNavigationContainerRef_1 = require("../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../mobile/navigation/routes");
const actionTypes_1 = require("./actionTypes");
__exportStar(require("./actions.any"), exports);
/**
 * Displays the chat panel.
 *
 * @param {Object} participant - The recipient for the private chat.
 * @param {boolean} disablePolls - Checks if polls are disabled.
 *
 * @returns {{
 *     participant: participant,
 *     type: OPEN_CHAT
 * }}
 */
function openChat(participant, disablePolls) {
    if (disablePolls) {
        (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.chat);
    }
    (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.chatandpolls.main);
    return {
        participant,
        type: actionTypes_1.OPEN_CHAT
    };
}
exports.openChat = openChat;
