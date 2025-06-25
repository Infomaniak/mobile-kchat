"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveLogs = void 0;
const getRoomName_1 = __importDefault(require("../base/config/getRoomName"));
const downloadJSON_1 = require("../base/util/downloadJSON");
/**
 * Create an action for saving the conference logs.
 *
 * @returns {Function}
 */
function saveLogs() {
    return (dispatch, getState) => {
        const logs = getState()['features/base/connection'].connection?.getLogs();
        const roomName = (0, getRoomName_1.default)() || '';
        (0, downloadJSON_1.downloadJSON)(logs ?? {}, `meetlog-${roomName}.json`);
    };
}
exports.saveLogs = saveLogs;
