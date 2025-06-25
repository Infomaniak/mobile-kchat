"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ColorPalette_1 = require("../../../styles/components/styles/ColorPalette");
exports.default = {
    /**
     * Base indicator style.
     */
    indicator: {
        backgroundColor: ColorPalette_1.ColorPalette.transparent,
        padding: 2,
        color: ColorPalette_1.ColorPalette.white,
        fontSize: 16,
        textShadowColor: ColorPalette_1.ColorPalette.black,
        textShadowOffset: {
            height: -1,
            width: 0
        }
    }
};
