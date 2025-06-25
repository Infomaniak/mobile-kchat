"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tokens_1 = require("../Tokens");
const functions_web_1 = require("../functions.web");
exports.default = (0, functions_web_1.createWebTheme)({
    font: Tokens_1.font,
    colors: Tokens_1.colors,
    colorMap: Tokens_1.colorMap,
    spacing: Tokens_1.spacing,
    shape: Tokens_1.shape,
    typography: Tokens_1.typography,
    breakpoints: Tokens_1.breakpoints
});
