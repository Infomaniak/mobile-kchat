"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigationStyles = exports.TEXT_COLOR = void 0;
const BoxModel_1 = require("../../../base/styles/components/styles/BoxModel");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
exports.TEXT_COLOR = BaseTheme_native_1.default.palette.text01;
const unreadCounterDescription = {
    ...BaseTheme_native_1.default.typography.bodyShortBoldLarge,
    color: BaseTheme_native_1.default.palette.text03
};
const HEADER_ACTION_BUTTON_SIZE = 16;
const headerNavigationButtonLabel = {
    color: BaseTheme_native_1.default.palette.link01,
    fontSize: HEADER_ACTION_BUTTON_SIZE,
    lineHeight: BaseTheme_native_1.default.spacing[3]
};
const headerNavigationButton = {
    borderRadius: BaseTheme_native_1.default.shape.borderRadius,
    height: BaseTheme_native_1.default.spacing[6],
    marginLeft: BaseTheme_native_1.default.spacing[3]
};
/**
 * Styles of the navigation feature.
 */
exports.navigationStyles = {
    connectingScreenContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
        flex: 1
    },
    connectingScreenContent: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    connectingScreenIndicator: {
        margin: BoxModel_1.BoxModel.margin
    },
    connectingScreenText: {
        color: exports.TEXT_COLOR
    },
    headerNavigationButton: {
        ...headerNavigationButton
    },
    headerNavigationButtonIcon: {
        ...headerNavigationButton,
        padding: BaseTheme_native_1.default.spacing[2]
    },
    headerNavigationButtonDisabled: {
        backgroundColor: 'transparent',
        marginLeft: BaseTheme_native_1.default.spacing[2]
    },
    headerNavigationButtonLabel: {
        ...headerNavigationButtonLabel
    },
    headerNavigationButtonLabelDisabled: {
        ...headerNavigationButtonLabel,
        color: BaseTheme_native_1.default.palette.text03
    },
    headerNavigationButtonLabelBold: {
        ...headerNavigationButtonLabel,
        ...BaseTheme_native_1.default.typography.bodyShortRegularLarge
    },
    headerNavigationButtonLabelBoldDisabled: {
        ...headerNavigationButtonLabel,
        ...BaseTheme_native_1.default.typography.bodyShortRegularLarge,
        color: BaseTheme_native_1.default.palette.text03
    },
    unreadCounterContainer: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row'
    },
    unreadCounterDescription: {
        ...unreadCounterDescription
    },
    unreadCounterDescriptionFocused: {
        ...unreadCounterDescription,
        color: BaseTheme_native_1.default.palette.text01
    },
    unreadCounterCircle: {
        backgroundColor: BaseTheme_native_1.default.palette.warning01,
        borderRadius: BaseTheme_native_1.default.spacing[4] / 2,
        height: BaseTheme_native_1.default.spacing[4],
        justifyContent: 'center',
        marginLeft: BaseTheme_native_1.default.spacing[2],
        width: BaseTheme_native_1.default.spacing[4]
    },
    unreadCounter: {
        ...BaseTheme_native_1.default.typography.bodyShortBold,
        alignSelf: 'center',
        color: BaseTheme_native_1.default.palette.text04
    }
};
