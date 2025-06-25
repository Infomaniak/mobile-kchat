"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.THUMB_COLOR = exports.DISABLED_TRACK_COLOR = exports.ENABLED_TRACK_COLOR = void 0;
const BaseTheme_native_1 = __importDefault(require("../BaseTheme.native"));
exports.ENABLED_TRACK_COLOR = BaseTheme_native_1.default.palette.action01;
exports.DISABLED_TRACK_COLOR = BaseTheme_native_1.default.palette.ui05;
exports.THUMB_COLOR = BaseTheme_native_1.default.palette.icon01;
