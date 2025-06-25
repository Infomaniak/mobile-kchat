"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_INDICATOR = exports.TINTED_VIEW_DEFAULT = exports.UNDERLAY_COLOR = exports.AVATAR_SIZE = void 0;
const BaseTheme_native_1 = __importDefault(require("../../../ui/components/BaseTheme.native"));
const OVERLAY_FONT_COLOR = 'rgba(255, 255, 255, 0.6)';
const BUTTON_HEIGHT = BaseTheme_native_1.default.spacing[7];
const BUTTON_WIDTH = BaseTheme_native_1.default.spacing[7];
exports.AVATAR_SIZE = 65;
exports.UNDERLAY_COLOR = 'rgba(255, 255, 255, 0.2)';
const SECTION_LIST_STYLES = {
    /**
     * The style of the avatar container that makes the avatar rounded.
     */
    avatarContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 5
    },
    /**
     * Simple {@code Text} content of the avatar (the actual initials).
     */
    avatarContent: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: OVERLAY_FONT_COLOR,
        fontSize: Math.floor(exports.AVATAR_SIZE / 2),
        fontWeight: '100',
        textAlign: 'center'
    },
    /**
     * The top level container style of the list.
     */
    container: {
        flex: 1,
        width: '100%'
    },
    list: {
        flex: 1,
        flexDirection: 'column'
    },
    listItem: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: BaseTheme_native_1.default.spacing[3],
        marginVertical: BaseTheme_native_1.default.spacing[2]
    },
    listItemDetails: {
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
        paddingHorizontal: 5
    },
    listItemText: {
        color: OVERLAY_FONT_COLOR,
        fontSize: 14
    },
    listItemTitle: {
        fontWeight: 'bold',
        fontSize: 16
    },
    listSection: {
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.ui02,
        flex: 1,
        flexDirection: 'row',
        paddingVertical: BaseTheme_native_1.default.spacing[1],
        paddingHorizontal: BaseTheme_native_1.default.spacing[2]
    },
    listSectionText: {
        color: OVERLAY_FONT_COLOR,
        fontSize: 14,
        fontWeight: 'normal',
        marginLeft: BaseTheme_native_1.default.spacing[2]
    },
    pullToRefresh: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 20
    },
    pullToRefreshIcon: {
        backgroundColor: 'transparent',
        color: OVERLAY_FONT_COLOR,
        fontSize: 20
    },
    pullToRefreshText: {
        backgroundColor: 'transparent',
        color: OVERLAY_FONT_COLOR
    },
    touchableView: {
        flexDirection: 'row'
    }
};
exports.TINTED_VIEW_DEFAULT = {
    backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
    opacity: 0.8
};
exports.BASE_INDICATOR = {
    alignItems: 'center',
    justifyContent: 'center'
};
const iconButtonContainer = {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: BaseTheme_native_1.default.shape.borderRadius,
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH
};
/**
 * The styles of the generic React {@code Component}s implemented by the feature
 * base/react.
 */
exports.default = {
    ...SECTION_LIST_STYLES,
    iconButtonContainer: {
        ...iconButtonContainer
    },
    iconButtonContainerPrimary: {
        ...iconButtonContainer,
        backgroundColor: BaseTheme_native_1.default.palette.action01
    },
    iconButtonContainerSecondary: {
        ...iconButtonContainer,
        backgroundColor: BaseTheme_native_1.default.palette.action02
    },
    iconButtonContainerDisabled: {
        ...iconButtonContainer,
        backgroundColor: BaseTheme_native_1.default.palette.disabled01
    }
};
