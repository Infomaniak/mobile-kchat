"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = exports.Audio = void 0;
var Audio_1 = require("./native/Audio");
Object.defineProperty(exports, "Audio", { enumerable: true, get: function () { return __importDefault(Audio_1).default; } });
var Video_1 = require("./native/Video");
Object.defineProperty(exports, "Video", { enumerable: true, get: function () { return __importDefault(Video_1).default; } });
