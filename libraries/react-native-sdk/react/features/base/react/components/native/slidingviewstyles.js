"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const constants_1 = require("../../constants");
exports.default = {
    /**
     * The topmost container of the side bar.
     */
    sliderViewContainer: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        zIndex: constants_1.OVERLAY_Z_INDEX
    },
    /**
     * The container of the actual content of the side menu.
     */
    sliderViewContent: {
        position: 'absolute'
    },
    /**
     * The opaque area that covers the rest of the screen, when the side bar is
     * open.
     */
    sliderViewShadow: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
};
