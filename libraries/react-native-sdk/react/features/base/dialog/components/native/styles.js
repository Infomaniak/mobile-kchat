"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandedDialog = exports.bottomSheetStyles = exports.inputDialog = exports.MD_ITEM_MARGIN_PADDING = exports.MD_ITEM_HEIGHT = exports.MD_FONT_SIZE = void 0;
const react_native_1 = require("react-native");
const ColorSchemeRegistry_1 = __importDefault(require("../../../color-scheme/ColorSchemeRegistry"));
const functions_1 = require("../../../color-scheme/functions");
const BoxModel_1 = require("../../../styles/components/styles/BoxModel");
const BaseTheme_native_1 = __importDefault(require("../../../ui/components/BaseTheme.native"));
const constants_1 = require("../../constants");
const BORDER_RADIUS = 5;
/**
 * NOTE: These Material guidelines based values are currently only used in
 * dialogs (and related) but later on it would be nice to export it into a base
 * Material feature.
 */
exports.MD_FONT_SIZE = 16;
exports.MD_ITEM_HEIGHT = 48;
exports.MD_ITEM_MARGIN_PADDING = BaseTheme_native_1.default.spacing[3];
/**
 * Reusable (colored) style for text in any branded dialogs.
 */
const brandedDialogText = {
    color: (0, functions_1.schemeColor)('text'),
    fontSize: exports.MD_FONT_SIZE,
    textAlign: 'center'
};
const brandedDialogLabelStyle = {
    color: BaseTheme_native_1.default.palette.text01,
    flexShrink: 1,
    fontSize: exports.MD_FONT_SIZE,
    opacity: 0.90
};
const brandedDialogItemContainerStyle = {
    alignItems: 'center',
    flexDirection: 'row',
    height: exports.MD_ITEM_HEIGHT
};
const brandedDialogIconStyle = {
    color: BaseTheme_native_1.default.palette.icon01,
    fontSize: 24
};
exports.inputDialog = {
    formMessage: {
        alignSelf: 'flex-start',
        fontStyle: 'italic',
        fontWeight: 'bold',
        marginTop: BaseTheme_native_1.default.spacing[3]
    }
};
/**
 * The React {@code Component} styles of {@code BottomSheet}. These have
 * been implemented as per the Material Design guidelines:
 * {@link https://material.io/guidelines/components/bottom-sheets.html}.
 */
exports.bottomSheetStyles = {
    sheetAreaCover: {
        backgroundColor: 'transparent',
        flex: 1
    },
    scrollView: {
        paddingHorizontal: 0
    },
    /**
     * Style for the container of the sheet.
     */
    sheetContainer: {
        alignItems: 'stretch',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        maxWidth: 500,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
    },
    sheetItemContainer: {
        flex: -1,
        maxHeight: '75%'
    },
    buttons: {
        /**
         * Style for the {@code Icon} element in a generic item of the menu.
         */
        iconStyle: {
            ...brandedDialogIconStyle
        },
        /**
         * Style for the label in a generic item rendered in the menu.
         */
        labelStyle: {
            ...brandedDialogLabelStyle,
            marginLeft: 16
        },
        /**
         * Container style for a generic item rendered in the menu.
         */
        style: {
            ...brandedDialogItemContainerStyle,
            paddingHorizontal: exports.MD_ITEM_MARGIN_PADDING
        },
        /**
         * Additional style that is not directly used as a style object.
         */
        underlayColor: BaseTheme_native_1.default.palette.ui04
    },
    /**
     * Bottom sheet's base style.
     */
    sheet: {
        backgroundColor: BaseTheme_native_1.default.palette.ui02,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },
    /**
     * Bottom sheet's base style with header.
     */
    sheetHeader: {
        backgroundColor: BaseTheme_native_1.default.palette.ui02
    },
    /**
     * Bottom sheet's background color with footer.
     */
    sheetFooter: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01
    }
};
exports.default = {
    dialogButton: {
        ...BaseTheme_native_1.default.typography.bodyLongBold
    },
    destructiveDialogButton: {
        ...BaseTheme_native_1.default.typography.bodyLongBold,
        color: BaseTheme_native_1.default.palette.actionDanger
    }
};
exports.brandedDialog = {
    /**
     * The style of bold {@code Text} rendered by the {@code Dialog}s of the
     * feature authentication.
     */
    boldDialogText: {
        fontWeight: 'bold'
    },
    buttonFarRight: {
        borderBottomRightRadius: BORDER_RADIUS
    },
    buttonWrapper: {
        alignItems: 'stretch',
        borderRadius: BORDER_RADIUS,
        flexDirection: 'row'
    },
    mainWrapper: {
        alignSelf: 'stretch',
        padding: BoxModel_1.BoxModel.padding * 2,
        // The added bottom padding is to compensate the empty space around the
        // close icon.
        paddingBottom: BoxModel_1.BoxModel.padding * 3
    },
    overlayTouchable: {
        ...react_native_1.StyleSheet.absoluteFillObject
    }
};
/**
 * Color schemed styles for all the component based on the abstract dialog.
 */
ColorSchemeRegistry_1.default.register('Dialog', {
    button: {
        backgroundColor: '#44A5FF',
        flex: 1,
        padding: BoxModel_1.BoxModel.padding * 1.5
    },
    /**
     * Separator line for the buttons in a dialog.
     */
    buttonSeparator: {
        borderRightColor: (0, functions_1.schemeColor)('border'),
        borderRightWidth: 1
    },
    buttonLabel: {
        color: (0, functions_1.schemeColor)('buttonLabel'),
        fontSize: exports.MD_FONT_SIZE,
        textAlign: 'center'
    },
    /**
     * Style of the close icon on a dialog.
     */
    closeStyle: {
        color: (0, functions_1.schemeColor)('icon'),
        fontSize: exports.MD_FONT_SIZE
    },
    /**
     * Base style of the dialogs.
     */
    dialog: {
        alignItems: 'stretch',
        backgroundColor: (0, functions_1.schemeColor)('background'),
        borderColor: (0, functions_1.schemeColor)('border'),
        borderRadius: BORDER_RADIUS,
        borderWidth: 1,
        flex: 1,
        flexDirection: 'column',
        maxWidth: constants_1.PREFERRED_DIALOG_SIZE
    },
    /**
     * Field on an input dialog.
     */
    field: {
        ...brandedDialogText,
        borderBottomWidth: 1,
        borderColor: (0, functions_1.schemeColor)('border'),
        margin: BoxModel_1.BoxModel.margin,
        textAlign: 'left'
    },
    /**
     * Style for the field label on an input dialog.
     */
    fieldLabel: {
        ...brandedDialogText,
        margin: BoxModel_1.BoxModel.margin,
        textAlign: 'left'
    },
    text: {
        ...brandedDialogText,
        color: BaseTheme_native_1.default.palette.text01
    },
    topBorderContainer: {
        borderTopColor: BaseTheme_native_1.default.palette.ui07,
        borderTopWidth: 1
    }
});
