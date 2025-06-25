"use strict";
// Re-export JitsiMeetJS from the library lib-jitsi-meet to (the other features
// of) the project jitsi-meet.
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
// @ts-ignore
const lib_jitsi_meet_1 = __importDefault(require("lib-jitsi-meet"));
exports.default = lib_jitsi_meet_1.default;
