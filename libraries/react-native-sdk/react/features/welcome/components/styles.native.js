"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVATAR_SIZE = void 0;
const react_native_1 = require("react-native");
const BoxModel_1 = require("../../base/styles/components/styles/BoxModel");
const BaseTheme_native_1 = __importDefault(require("../../base/ui/components/BaseTheme.native"));
exports.AVATAR_SIZE = 104;
/**
 * The default color of text on the WelcomePage.
 */
const TEXT_COLOR = BaseTheme_native_1.default.palette.text01;
/**
 * The styles of the React {@code Components} of the feature welcome including
 * {@code WelcomePage} and {@code BlankPage}.
 */
exports.default = {
    blankPageText: {
        color: TEXT_COLOR,
        fontSize: 18
    },
    /**
     * View that is rendered when there is no welcome page.
     */
    blankPageWrapper: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    /**
     * Join button style.
     */
    button: {
        backgroundColor: BaseTheme_native_1.default.palette.action01,
        borderColor: BaseTheme_native_1.default.palette.action01,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        borderWidth: 1,
        height: BaseTheme_native_1.default.spacing[7],
        justifyContent: 'center',
        paddingHorizontal: BaseTheme_native_1.default.spacing[4]
    },
    joinButtonLabel: {
        textTransform: 'uppercase'
    },
    joinButtonText: {
        alignSelf: 'center',
        color: BaseTheme_native_1.default.palette.text01,
        fontSize: 14
    },
    enterRoomText: {
        color: TEXT_COLOR,
        fontSize: 18,
        marginBottom: BoxModel_1.BoxModel.margin
    },
    /**
     * Container for the button on the hint box.
     */
    hintButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    /**
     * Container for the hint box.
     */
    hintContainer: {
        flexDirection: 'column',
        overflow: 'hidden'
    },
    /**
     * The text of the hint box.
     */
    hintText: {
        color: BaseTheme_native_1.default.palette.text01,
        textAlign: 'center'
    },
    /**
     * Container for the text on the hint box.
     */
    hintTextContainer: {
        marginBottom: 2 * BoxModel_1.BoxModel.margin
    },
    /**
     * Container for the items in the side bar.
     */
    itemContainer: {
        flexDirection: 'column',
        paddingTop: 10
    },
    /**
     * A view that contains the field and hint box.
     */
    joinControls: {
        padding: BoxModel_1.BoxModel.padding
    },
    messageContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.ui03,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        marginVertical: BaseTheme_native_1.default.spacing[1],
        paddingHorizontal: BaseTheme_native_1.default.spacing[2],
        paddingVertical: 2 * BaseTheme_native_1.default.spacing[2]
    },
    roomNameInputContainer: {
        height: '0%'
    },
    /**
     * Top-level screen style.
     */
    page: {
        flex: 1,
        flexDirection: 'column'
    },
    /**
     * The styles for reduced UI mode.
     */
    reducedUIContainer: {
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.link01,
        flex: 1,
        justifyContent: 'center'
    },
    reducedUIText: {
        color: TEXT_COLOR,
        fontSize: 12
    },
    /**
     * Container for room name input box and 'join' button.
     */
    roomContainer: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        marginHorizontal: BaseTheme_native_1.default.spacing[2]
    },
    /**
     * The container of the label of the audio-video switch.
     */
    switchLabel: {
        paddingHorizontal: 3
    },
    /**
     * Room input style.
     */
    textInput: {
        backgroundColor: 'transparent',
        borderColor: BaseTheme_native_1.default.palette.ui10,
        borderRadius: 4,
        borderWidth: 1,
        color: TEXT_COLOR,
        fontSize: 23,
        height: 50,
        padding: 4,
        textAlign: 'center'
    },
    /**
     * Application title style.
     */
    title: {
        color: TEXT_COLOR,
        fontSize: 25,
        marginBottom: 2 * BoxModel_1.BoxModel.margin,
        textAlign: 'center'
    },
    insecureRoomNameWarningContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: BaseTheme_native_1.default.spacing[1]
    },
    insecureRoomNameWarningIcon: {
        color: BaseTheme_native_1.default.palette.warning02,
        fontSize: 24,
        marginRight: 10
    },
    insecureRoomNameWarningText: {
        color: BaseTheme_native_1.default.palette.text01,
        flex: 1
    },
    /**
     * The style of the top-level container of {@code WelcomePage}.
     */
    welcomePage: {
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
        flex: 1,
        overflow: 'hidden'
    },
    customInput: {
        fontSize: 18,
        letterSpacing: 0,
        textAlign: 'center'
    },
    recentList: {
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
        flex: 1,
        overflow: 'hidden'
    },
    recentListDisabled: {
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
        flex: 1,
        opacity: 0.8,
        overflow: 'hidden'
    }
};
