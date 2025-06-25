"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uri_1 = require("../util/uri");
/**
 * Builds and returns the room name.
 *
 * @returns {string}
 */
function getRoomName() {
    const path = window.location.pathname;
    // The last non-directory component of the path (name) is the room.
    const roomName = path.substring(path.lastIndexOf('/') + 1) || undefined;
    return (0, uri_1.getBackendSafeRoomName)(roomName);
}
exports.default = getRoomName;
