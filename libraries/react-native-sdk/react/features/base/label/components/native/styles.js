"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LABEL_SIZE = exports.LABEL_MARGIN = exports.DEFAULT_COLOR = void 0;
const ColorPalette_1 = require("../../../styles/components/styles/ColorPalette");
const BaseTheme_native_1 = __importDefault(require("../../../ui/components/BaseTheme.native"));
/**
 * The default color of the {@code Label} and {@code ExpandedLabel}.
 */
exports.DEFAULT_COLOR = '#36383C';
/**
 * Margin of the {@Label} - to be reused when rendering the
 * {@code ExpandedLabel}.
 */
exports.LABEL_MARGIN = 8;
/**
 * Size of the {@Label} - to be reused when rendering the
 * {@code ExpandedLabel}.
 */
exports.LABEL_SIZE = 28;
/**
 * The styles of the native base/label feature.
 */
exports.default = {
    expandedLabelContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 36,
        flexDirection: 'row',
        justifyContent: 'center',
        zIndex: 1
    },
    expandedLabelTextContainer: {
        borderRadius: 3,
        paddingHorizontal: exports.LABEL_MARGIN,
        paddingVertical: exports.LABEL_MARGIN / 2
    },
    expandedLabelText: {
        color: ColorPalette_1.ColorPalette.white
    },
    /**
     * The outermost view.
     */
    labelContainer: {
        alignItems: 'space-between',
        backgroundColor: exports.DEFAULT_COLOR,
        borderRadius: 3,
        flex: 0,
        height: exports.LABEL_SIZE,
        justifyContent: 'center',
        marginLeft: exports.LABEL_MARGIN,
        marginBottom: exports.LABEL_MARGIN,
        paddingHorizontal: 8
    },
    labelText: {
        color: ColorPalette_1.ColorPalette.white,
        ...BaseTheme_native_1.default.typography.labelBold
    },
    labelOff: {
        opacity: 0.3
    }
};
