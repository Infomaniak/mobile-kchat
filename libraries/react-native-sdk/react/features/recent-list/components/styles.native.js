"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ColorPalette_1 = require("../../base/styles/components/styles/ColorPalette");
const functions_native_1 = require("../../base/styles/functions.native");
/**
 * The styles of the React {@code Component}s of the feature recent-list i.e.
 * {@code CalendarList}.
 */
exports.default = (0, functions_native_1.createStyleSheet)({
    /**
     * Text style of the empty recent list message.
     */
    emptyListText: {
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center'
    },
    /**
     * The style of the empty recent list container.
     */
    emptyListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    entryNameContainer: {
        alignItems: 'center',
        borderBottomColor: ColorPalette_1.ColorPalette.lightGrey,
        borderBottomWidth: 1,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 48
    },
    entryNameLabel: {
        color: ColorPalette_1.ColorPalette.lightGrey,
        flexShrink: 1,
        fontSize: 16,
        opacity: 0.90
    }
});
