"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BoxModel_1 = require("../../../base/styles/components/styles/BoxModel");
const ColorPalette_1 = require("../../../base/styles/components/styles/ColorPalette");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
/**
 * The styles of the React {@code Component}s of the feature subtitles.
 */
exports.default = {
    languageItemWrapper: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row'
    },
    iconWrapper: {
        width: 32
    },
    activeLanguageItemText: {
        ...BaseTheme_native_1.default.typography.bodyShortBoldLarge
    },
    languageItemText: {
        ...BaseTheme_native_1.default.typography.bodyShortRegularLarge,
        color: BaseTheme_native_1.default.palette.text01,
        marginLeft: BaseTheme_native_1.default.spacing[2],
        marginVertical: BaseTheme_native_1.default.spacing[2]
    },
    subtitlesContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        flex: 1
    },
    /**
     * Style for subtitle paragraph.
     */
    captionsSubtitles: {
        backgroundColor: ColorPalette_1.ColorPalette.black,
        borderRadius: BoxModel_1.BoxModel.margin / 4,
        color: ColorPalette_1.ColorPalette.white,
        marginBottom: BoxModel_1.BoxModel.margin,
        padding: BoxModel_1.BoxModel.padding / 2
    },
    /**
     * Style for the subtitles container.
     */
    captionsSubtitlesContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        flexGrow: 0,
        justifyContent: 'flex-end',
        margin: BoxModel_1.BoxModel.margin
    },
    itemsContainer: {
        marginHorizontal: BaseTheme_native_1.default.spacing[4],
        marginVertical: BaseTheme_native_1.default.spacing[4]
    }
};
