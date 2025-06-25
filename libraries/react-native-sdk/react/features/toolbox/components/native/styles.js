"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ColorSchemeRegistry_1 = __importDefault(require("../../../base/color-scheme/ColorSchemeRegistry"));
const functions_1 = require("../../../base/color-scheme/functions");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const BUTTON_SIZE = 48;
// Toolbox, toolbar:
/**
 * The style of toolbar buttons.
 */
const toolbarButton = {
    borderRadius: BaseTheme_native_1.default.shape.borderRadius,
    borderWidth: 0,
    flex: 0,
    flexDirection: 'row',
    height: BUTTON_SIZE,
    justifyContent: 'center',
    marginHorizontal: 6,
    marginVertical: 6,
    width: BUTTON_SIZE
};
/**
 * The icon style of the toolbar buttons.
 */
const toolbarButtonIcon = {
    alignSelf: 'center',
    color: BaseTheme_native_1.default.palette.icon04,
    fontSize: 24
};
/**
 * The icon style of toolbar buttons which display white icons.
 */
const whiteToolbarButtonIcon = {
    ...toolbarButtonIcon,
    color: BaseTheme_native_1.default.palette.icon01
};
/**
 * The style of reaction buttons.
 */
const reactionButton = {
    ...toolbarButton,
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginTop: 0,
    marginHorizontal: 0
};
const gifButton = {
    ...reactionButton,
    backgroundColor: '#000'
};
/**
 * The style of the emoji on the reaction buttons.
 */
const reactionEmoji = {
    fontSize: 20,
    color: BaseTheme_native_1.default.palette.icon01
};
const reactionMenu = {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BaseTheme_native_1.default.palette.ui01,
    padding: BaseTheme_native_1.default.spacing[3]
};
/**
 * The Toolbox and toolbar related styles.
 */
const styles = {
    sheetGestureRecognizer: {
        alignItems: 'stretch',
        flexDirection: 'column'
    },
    /**
     * The style of the toolbar.
     */
    toolbox: {
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    /**
     * The style of the root/top-level container of {@link Toolbox}.
     */
    toolboxContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
        flexDirection: 'column',
        maxWidth: 580,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
    },
    iconImageStyles: {
        height: BaseTheme_native_1.default.spacing[4],
        width: BaseTheme_native_1.default.spacing[4]
    }
};
exports.default = styles;
/**
 * Color schemed styles for the @{Toolbox} component.
 */
ColorSchemeRegistry_1.default.register('Toolbox', {
    /**
     * Styles for buttons in the toolbar.
     */
    buttonStyles: {
        iconStyle: toolbarButtonIcon,
        style: toolbarButton
    },
    buttonStylesBorderless: {
        iconStyle: whiteToolbarButtonIcon,
        style: {
            ...toolbarButton,
            backgroundColor: 'transparent'
        },
        underlayColor: 'transparent'
    },
    backgroundToggle: {
        backgroundColor: BaseTheme_native_1.default.palette.ui04
    },
    hangupMenuContainer: {
        marginHorizontal: BaseTheme_native_1.default.spacing[2],
        marginVertical: BaseTheme_native_1.default.spacing[2]
    },
    hangupButton: {
        flex: 1,
        marginHorizontal: BaseTheme_native_1.default.spacing[2],
        marginVertical: BaseTheme_native_1.default.spacing[2]
    },
    hangupButtonStyles: {
        iconStyle: whiteToolbarButtonIcon,
        style: {
            ...toolbarButton,
            backgroundColor: (0, functions_1.schemeColor)('hangup')
        },
        underlayColor: BaseTheme_native_1.default.palette.ui04
    },
    reactionDialog: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent'
    },
    overflowReactionMenu: reactionMenu,
    reactionMenu: {
        ...reactionMenu,
        borderRadius: 3,
        width: 360
    },
    reactionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    reactionButton: {
        gifButton,
        style: reactionButton,
        underlayColor: BaseTheme_native_1.default.palette.ui04,
        emoji: reactionEmoji
    },
    emojiAnimation: {
        color: BaseTheme_native_1.default.palette.icon01,
        position: 'absolute',
        zIndex: 1001,
        elevation: 2,
        fontSize: 20,
        left: '50%',
        top: '100%'
    },
    /**
     * Styles for toggled buttons in the toolbar.
     */
    toggledButtonStyles: {
        iconStyle: whiteToolbarButtonIcon,
        style: {
            ...toolbarButton
        },
        underlayColor: 'transparent'
    }
});
