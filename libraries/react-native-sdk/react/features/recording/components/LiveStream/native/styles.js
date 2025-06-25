"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOUCHABLE_UNDERLAY = exports.ACTIVE_OPACITY = void 0;
const functions_native_1 = require("../../../../base/styles/functions.native");
const BaseTheme_native_1 = __importDefault(require("../../../../base/ui/components/BaseTheme.native"));
/**
 * Opacity of the TouchableHighlight.
 */
exports.ACTIVE_OPACITY = 0.3;
/**
 * Underlay of the TouchableHighlight.
 */
exports.TOUCHABLE_UNDERLAY = BaseTheme_native_1.default.palette.ui06;
/**
 * The styles of the React {@code Components} of LiveStream.
 */
exports.default = (0, functions_native_1.createStyleSheet)({
    /**
     * Generic component to wrap form sections into achieving a unified look.
     */
    formWrapper: {
        alignItems: 'stretch',
        flexDirection: 'column',
        paddingHorizontal: BaseTheme_native_1.default.spacing[2]
    },
    formValidationItem: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        height: BaseTheme_native_1.default.spacing[4],
        marginTop: BaseTheme_native_1.default.spacing[2]
    },
    formButtonsWrapper: {
        alignSelf: 'center',
        display: 'flex',
        maxWidth: 200
    },
    buttonLabelStyle: {
        color: BaseTheme_native_1.default.palette.link01
    },
    /**
     * Explaining text on the top of the sign in form.
     */
    helpText: {
        marginBottom: BaseTheme_native_1.default.spacing[2]
    },
    /**
     * Container for the live stream screen.
     */
    startLiveStreamContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingHorizontal: BaseTheme_native_1.default.spacing[2],
        paddingVertical: BaseTheme_native_1.default.spacing[3]
    },
    /**
     * Helper link text.
     */
    streamKeyHelp: {
        alignSelf: 'flex-end'
    },
    /**
     * Input field to manually enter stream key.
     */
    streamKeyInput: {
        alignSelf: 'stretch',
        color: BaseTheme_native_1.default.palette.text01,
        textAlign: 'left'
    },
    streamKeyContainer: {
        marginTop: BaseTheme_native_1.default.spacing[3]
    },
    /**
     * Custom component to pick a broadcast from the list fetched from Google.
     */
    streamKeyPicker: {
        alignSelf: 'stretch',
        flex: 1,
        height: 40,
        marginHorizontal: BaseTheme_native_1.default.spacing[1],
        width: 300
    },
    /**
     * CTA (label) of the picker.
     */
    streamKeyPickerCta: {
        marginBottom: BaseTheme_native_1.default.spacing[2]
    },
    /**
     * Style of a single item in the list.
     */
    streamKeyPickerItem: {
        padding: BaseTheme_native_1.default.spacing[1]
    },
    /**
     * Additional style for the selected item.
     */
    streamKeyPickerItemHighlight: {
        backgroundColor: BaseTheme_native_1.default.palette.ui04
    },
    /**
     * Overall wrapper for the picker.
     */
    streamKeyPickerWrapper: {
        borderColor: BaseTheme_native_1.default.palette.ui07,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        borderWidth: 1,
        flexDirection: 'column'
    },
    /**
     * Terms and Conditions texts.
     */
    tcText: {
        textAlign: 'right'
    },
    text: {
        color: BaseTheme_native_1.default.palette.text01,
        fontSize: 14,
        textAlign: 'left'
    },
    /**
     * A different colored text to indicate information needing attention.
     */
    warningText: {
        color: BaseTheme_native_1.default.palette.warning02
    }
});
