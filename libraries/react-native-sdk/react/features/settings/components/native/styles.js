"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLACEHOLDER_COLOR = exports.ANDROID_UNDERLINE_COLOR = void 0;
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
exports.ANDROID_UNDERLINE_COLOR = 'transparent';
exports.PLACEHOLDER_COLOR = BaseTheme_native_1.default.palette.focus01;
/**
 * The styles of the native components of the feature {@code settings}.
 */
exports.default = {
    profileContainerWrapper: {
        margin: BaseTheme_native_1.default.spacing[4]
    },
    profileContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.ui02,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: BaseTheme_native_1.default.spacing[3]
    },
    profileView: {
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    applyProfileSettingsButton: {
        marginHorizontal: BaseTheme_native_1.default.spacing[4],
        marginVertical: BaseTheme_native_1.default.spacing[3]
    },
    avatarContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: BaseTheme_native_1.default.spacing[3],
        margin: BaseTheme_native_1.default.spacing[4]
    },
    gavatarMessageContainer: {
        marginHorizontal: BaseTheme_native_1.default.spacing[4],
        color: BaseTheme_native_1.default.palette.text02,
        marginTop: -BaseTheme_native_1.default.spacing[2],
        ...BaseTheme_native_1.default.typography.bodyShortRegular
    },
    displayName: {
        ...BaseTheme_native_1.default.typography.bodyLongRegularLarge,
        color: BaseTheme_native_1.default.palette.text01,
        marginLeft: BaseTheme_native_1.default.spacing[3],
        position: 'relative'
    },
    profileViewArrow: {
        position: 'absolute',
        right: BaseTheme_native_1.default.spacing[3]
    },
    /**
     * Style for screen container.
     */
    settingsViewContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        flex: 1
    },
    /**
     * Standardized style for a field container {@code View}.
     */
    fieldContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: BaseTheme_native_1.default.spacing[8],
        paddingHorizontal: BaseTheme_native_1.default.spacing[2],
        justifyContent: 'space-between'
    },
    /**
     * * Appended style for column layout fields.
     */
    fieldContainerColumn: {
        alignItems: 'flex-start',
        flexDirection: 'column'
    },
    /**
     * Standard container for a {@code View} containing a field label.
     */
    fieldLabelContainer: {
        alignItems: 'center',
        flexShrink: 1,
        flexDirection: 'row',
        paddingLeft: BaseTheme_native_1.default.spacing[3],
        paddingRight: BaseTheme_native_1.default.spacing[1]
    },
    /**
     * Text of the field labels on the form.
     */
    fieldLabelText: {
        ...BaseTheme_native_1.default.typography.bodyShortRegularLarge
    },
    /**
     * Field container style for all but last row {@code View}.
     */
    fieldSeparator: {
        marginHorizontal: BaseTheme_native_1.default.spacing[4],
        borderBottomWidth: 1,
        borderColor: BaseTheme_native_1.default.palette.ui05,
        marginVertical: BaseTheme_native_1.default.spacing[3]
    },
    /**
     * Style for the {@code View} containing each
     * field values (the actual field).
     */
    fieldValueContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 1,
        justifyContent: 'flex-end',
        paddingRight: BaseTheme_native_1.default.spacing[3]
    },
    /**
     * Style for the form section separator titles.
     */
    formSectionTitleContent: {
        backgroundColor: BaseTheme_native_1.default.palette.ui02,
        paddingVertical: BaseTheme_native_1.default.spacing[1]
    },
    formSectionTitleText: {
        ...BaseTheme_native_1.default.typography.bodyShortBold,
        color: BaseTheme_native_1.default.palette.text02,
        marginHorizontal: BaseTheme_native_1.default.spacing[4],
        marginVertical: BaseTheme_native_1.default.spacing[3]
    },
    /**
     * Global {@code Text} color for the components.
     */
    text: {
        color: BaseTheme_native_1.default.palette.text01
    },
    /**
     * Text input container style.
     */
    customContainer: {
        marginBottom: BaseTheme_native_1.default.spacing[3],
        marginHorizontal: BaseTheme_native_1.default.spacing[4],
        marginTop: BaseTheme_native_1.default.spacing[2]
    },
    languageButtonContainer: {
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        overflow: 'hidden'
    },
    languageButton: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        height: BaseTheme_native_1.default.spacing[7],
        justifyContent: 'center'
    },
    languageOption: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: BaseTheme_native_1.default.spacing[6],
        marginHorizontal: BaseTheme_native_1.default.spacing[4],
        borderBottomWidth: 1,
        borderColor: BaseTheme_native_1.default.palette.ui05
    },
    selectedLanguage: {
        color: BaseTheme_native_1.default.palette.text03
    },
    languageText: {
        ...BaseTheme_native_1.default.typography.bodyShortRegularLarge,
        color: BaseTheme_native_1.default.palette.text01,
        marginHorizontal: BaseTheme_native_1.default.spacing[2]
    },
    /**
     * Standard text input field style.
     */
    textInputField: {
        color: BaseTheme_native_1.default.palette.field01,
        flex: 1,
        ...BaseTheme_native_1.default.typography.bodyShortRegularLarge,
        textAlign: 'right'
    },
    /**
     * Appended style for column layout fields.
     */
    textInputFieldColumn: {
        backgroundColor: 'rgb(245, 245, 245)',
        borderRadius: 8,
        marginVertical: 5,
        paddingVertical: 3,
        textAlign: 'left'
    },
    /**
     * Style for screen container.
     */
    screenContainer: {
        flex: 1
    },
    linksSection: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: BaseTheme_native_1.default.spacing[3]
    },
    linksButton: {
        width: '33%',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        ...BaseTheme_native_1.default.typography.bodyShortBoldLarge
    },
    logBtn: {
        marginRight: BaseTheme_native_1.default.spacing[3]
    },
    backBtn: {
        marginLeft: BaseTheme_native_1.default.spacing[3]
    }
};
