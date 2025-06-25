"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tokens_1 = require("../Tokens");
const functions_native_1 = require("../functions.native");
const updateTheme_native_1 = __importDefault(require("./updateTheme.native"));
exports.default = (0, functions_native_1.createNativeTheme)((0, updateTheme_native_1.default)({
    font: Tokens_1.font,
    colors: Tokens_1.colors,
    colorMap: Tokens_1.colorMap,
    spacing: Tokens_1.spacing,
    shape: Tokens_1.shape,
    typography: Tokens_1.typography
}));
