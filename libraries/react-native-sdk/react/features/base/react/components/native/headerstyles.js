"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const ColorSchemeRegistry_1 = __importDefault(require("../../../color-scheme/ColorSchemeRegistry"));
const functions_1 = require("../../../color-scheme/functions");
const BoxModel_1 = require("../../../styles/components/styles/BoxModel");
const HEADER_FONT_SIZE = 18;
const HEADER_HEIGHT = 48;
const HEADER_PADDING = BoxModel_1.BoxModel.padding / 2;
ColorSchemeRegistry_1.default.register('Header', {
    /**
     * Style of a disabled button in the header (e.g. Next).
     */
    disabledButtonText: {
        opacity: 0.6
    },
    /**
     * Platform specific header button (e.g. Back, menu, etc).
     */
    headerButtonIcon: {
        alignSelf: 'center',
        color: (0, functions_1.schemeColor)('icon'),
        fontSize: 22,
        marginRight: 12,
        padding: 8
    },
    headerButtonText: {
        color: (0, functions_1.schemeColor)('text'),
        fontSize: HEADER_FONT_SIZE
    },
    /**
     * Style of the header overlay to cover the unsafe areas.
     */
    headerOverlay: {
        backgroundColor: (0, functions_1.schemeColor)('background')
    },
    /**
     * Generic style for a label placed in the header.
     */
    headerText: {
        color: (0, functions_1.schemeColor)('text'),
        fontSize: HEADER_FONT_SIZE
    },
    headerTextWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0
    },
    /**
     * The top-level element of a page.
     */
    page: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        alignItems: 'stretch',
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden'
    },
    /**
     * Base style of Header.
     */
    screenHeader: {
        alignItems: 'center',
        backgroundColor: (0, functions_1.schemeColor)('background'),
        flexDirection: 'row',
        height: HEADER_HEIGHT,
        justifyContent: 'space-between',
        paddingHorizontal: BoxModel_1.BoxModel.padding,
        paddingVertical: HEADER_PADDING
    },
    statusBar: (0, functions_1.schemeColor)('statusBar'),
    statusBarContent: (0, functions_1.schemeColor)('statusBarContent')
});
