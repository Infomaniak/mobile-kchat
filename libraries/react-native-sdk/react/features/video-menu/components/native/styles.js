"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styles_1 = require("../../../base/dialog/components/native/styles");
const ColorPalette_1 = require("../../../base/styles/components/styles/ColorPalette");
const functions_native_1 = require("../../../base/styles/functions.native");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
exports.default = (0, functions_native_1.createStyleSheet)({
    participantNameContainer: {
        alignItems: 'center',
        borderBottomColor: BaseTheme_native_1.default.palette.ui07,
        borderBottomWidth: 0.4,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        flexDirection: 'row',
        height: styles_1.MD_ITEM_HEIGHT,
        paddingLeft: styles_1.MD_ITEM_MARGIN_PADDING
    },
    participantNameLabel: {
        color: ColorPalette_1.ColorPalette.lightGrey,
        flexShrink: 1,
        fontSize: styles_1.MD_FONT_SIZE,
        marginLeft: styles_1.MD_ITEM_MARGIN_PADDING,
        opacity: 0.90
    },
    statsTitleText: {
        color: BaseTheme_native_1.default.palette.text01,
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 3
    },
    statsInfoText: {
        color: BaseTheme_native_1.default.palette.text01,
        fontSize: 16,
        marginRight: 2,
        marginLeft: 2
    },
    statsInfoCell: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 30,
        justifyContent: 'flex-start'
    },
    statsWrapper: {
        margin: BaseTheme_native_1.default.spacing[3]
    },
    volumeSliderContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: BaseTheme_native_1.default.spacing[3],
        marginVertical: BaseTheme_native_1.default.spacing[2]
    },
    sliderContainer: {
        marginLeft: BaseTheme_native_1.default.spacing[3],
        minWidth: '80%'
    },
    divider: {
        backgroundColor: BaseTheme_native_1.default.palette.ui07
    },
    dividerDialog: {
        backgroundColor: BaseTheme_native_1.default.palette.ui07,
        marginBottom: BaseTheme_native_1.default.spacing[3]
    },
    contextMenuItem: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        height: BaseTheme_native_1.default.spacing[7],
        marginLeft: BaseTheme_native_1.default.spacing[3]
    },
    contextMenuItemText: {
        ...BaseTheme_native_1.default.typography.bodyShortRegularLarge,
        color: BaseTheme_native_1.default.palette.text01,
        marginLeft: BaseTheme_native_1.default.spacing[4]
    }
});
