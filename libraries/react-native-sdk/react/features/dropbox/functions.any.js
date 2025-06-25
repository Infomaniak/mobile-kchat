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
exports.getDropboxData = void 0;
__exportStar(require("./functions"), exports);
const functions_1 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Fetches information about the user's dropbox account.
 *
 * @param {string} token - The dropbox access token.
 * @param {string} appKey - The Jitsi Recorder dropbox app key.
 * @returns {Promise<DropboxUserData|undefined>}
 */
function getDropboxData(token, appKey) {
    return Promise.all([(0, functions_1.getDisplayName)(token, appKey), (0, functions_1.getSpaceUsage)(token, appKey)]).then(([userName, space]) => {
        const { allocated, used } = space;
        return {
            userName,
            spaceLeft: Math.floor((allocated - used) / 1048576) // 1MiB=1048576B
        };
    }, error => {
        logger_1.default.error(error);
        return undefined;
    });
}
exports.getDropboxData = getDropboxData;
