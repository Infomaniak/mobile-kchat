"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const uuid_1 = require("uuid");
const zxcvbn_1 = __importDefault(require("zxcvbn"));
// The null UUID.
const NIL_UUID = (0, uuid_1.parse)(uuid_1.NIL);
const _zxcvbnCache = new Map();
/**
 * Checks if the given string is a valid UUID or not.
 *
 * @param {string} str - The string to be checked.
 * @returns {boolean} - Whether the string is a valid UUID or not.
 */
function isValidUUID(str) {
    let uuid;
    try {
        uuid = (0, uuid_1.parse)(str);
    }
    catch (e) {
        return false;
    }
    return !lodash_1.default.isEqual(uuid, NIL_UUID);
}
/**
 * Checks a room name and caches the result.
 *
 * @param {string} roomName - The room name.
 * @returns {Object}
 */
function _checkRoomName(roomName = '') {
    if (_zxcvbnCache.has(roomName)) {
        return _zxcvbnCache.get(roomName);
    }
    const result = (0, zxcvbn_1.default)(roomName);
    _zxcvbnCache.set(roomName, result);
    return result;
}
/**
 * Returns true if the room name is considered a weak (insecure) one.
 *
 * @param {string} roomName - The room name.
 * @returns {boolean}
 */
function isInsecureRoomName(roomName = '') {
    // room names longer than 200 chars we consider secure
    return !isValidUUID(roomName) && (roomName.length < 200 && _checkRoomName(roomName).score < 3);
}
exports.default = isInsecureRoomName;
