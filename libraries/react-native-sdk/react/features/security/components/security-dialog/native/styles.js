"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTheme_native_1 = __importDefault(require("../../../../base/ui/components/BaseTheme.native"));
/**
 * The styles of the feature security.
 */
exports.default = {
    securityDialogContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        flex: 1
    },
    headerCloseButton: {
        marginLeft: 12
    },
    lobbyModeContainer: {
        borderBottomColor: BaseTheme_native_1.default.palette.ui07,
        borderBottomWidth: 1,
        marginTop: BaseTheme_native_1.default.spacing[4]
    },
    lobbyModeContent: {
        marginHorizontal: BaseTheme_native_1.default.spacing[3],
        marginBottom: BaseTheme_native_1.default.spacing[4]
    },
    lobbyModeText: {
        color: BaseTheme_native_1.default.palette.text01
    },
    lobbyModeLabel: {
        color: BaseTheme_native_1.default.palette.text01,
        fontWeight: 'bold',
        marginTop: BaseTheme_native_1.default.spacing[2]
    },
    lobbyModeSection: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: BaseTheme_native_1.default.spacing[1]
    },
    passwordContainer: {
        marginHorizontal: BaseTheme_native_1.default.spacing[3],
        marginTop: BaseTheme_native_1.default.spacing[4]
    },
    passwordContainerText: {
        color: BaseTheme_native_1.default.palette.text01
    },
    passwordContainerControls: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    savedPasswordContainer: {
        flexDirection: 'row',
        width: 208
    },
    savedPasswordLabel: {
        color: BaseTheme_native_1.default.palette.text01,
        fontWeight: 'bold'
    },
    savedPassword: {
        color: BaseTheme_native_1.default.palette.text01
    },
    customContainer: {
        width: 208
    },
    passwordSetupButtonLabel: {
        color: BaseTheme_native_1.default.palette.link01
    },
    passwordSetRemotelyContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    passwordSetRemotelyText: {
        color: BaseTheme_native_1.default.palette.text01
    },
    passwordSetRemotelyTextDisabled: {
        color: BaseTheme_native_1.default.palette.text02
    }
};
