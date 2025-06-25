"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preJoinStyles = void 0;
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
exports.preJoinStyles = {
    joinButton: {
        marginTop: BaseTheme_native_1.default.spacing[3],
        width: 352
    },
    buttonStylesBorderless: {
        iconStyle: {
            color: BaseTheme_native_1.default.palette.icon01,
            fontSize: 24
        },
        style: {
            flexDirection: 'row',
            justifyContent: 'center',
            margin: BaseTheme_native_1.default.spacing[3],
            height: 24,
            width: 24
        },
        underlayColor: 'transparent'
    },
    contentWrapper: {
        flex: 1,
        flexDirection: 'row'
    },
    contentWrapperWide: {
        flex: 1,
        flexDirection: 'row'
    },
    largeVideoContainer: {
        height: '60%'
    },
    largeVideoContainerWide: {
        height: '100%',
        marginRight: 'auto',
        position: 'absolute',
        width: '50%'
    },
    contentContainer: {
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
        bottom: 0,
        display: 'flex',
        height: 280,
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        zIndex: 1
    },
    contentContainerWide: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        left: '50%',
        padding: BaseTheme_native_1.default.spacing[3],
        position: 'absolute',
        width: '50%'
    },
    toolboxContainer: {
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-between',
        marginBottom: BaseTheme_native_1.default.spacing[3],
        paddingHorizontal: BaseTheme_native_1.default.spacing[2],
        width: 148
    },
    customInput: {
        textAlign: 'center',
        width: 352
    },
    errorContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.actionDanger,
        borderBottomRightRadius: BaseTheme_native_1.default.shape.borderRadius,
        borderBottomLeftRadius: BaseTheme_native_1.default.shape.borderRadius,
        boxSizing: 'border-box',
        marginTop: -BaseTheme_native_1.default.spacing[2],
        overflow: 'visible',
        wordBreak: 'normal',
        width: 352
    },
    error: {
        padding: BaseTheme_native_1.default.spacing[1],
        color: BaseTheme_native_1.default.palette.text01,
        textAlign: 'center'
    },
    preJoinRoomName: {
        ...BaseTheme_native_1.default.typography.heading5,
        color: BaseTheme_native_1.default.palette.text01,
        textAlign: 'center'
    },
    conferenceInfo: {
        alignSelf: 'center',
        marginTop: BaseTheme_native_1.default.spacing[3],
        paddingHorizontal: BaseTheme_native_1.default.spacing[3],
        paddingVertical: BaseTheme_native_1.default.spacing[1],
        position: 'absolute',
        maxWidth: 273,
        zIndex: 1
    },
    displayRoomNameBackdrop: {
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        opacity: 0.7,
        paddingHorizontal: BaseTheme_native_1.default.spacing[3],
        paddingVertical: BaseTheme_native_1.default.spacing[1]
    },
    recordingWarning: {
        display: 'flex',
        justifyContent: 'center',
        lineHeight: 22,
        marginBottom: BaseTheme_native_1.default.spacing[2],
        marginTop: BaseTheme_native_1.default.spacing[1],
        width: 'auto'
    },
    recordingWarningText: {
        color: BaseTheme_native_1.default.palette.text03
    },
    unsafeRoomWarningContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
    },
    unsafeRoomContentContainer: {
        justifySelf: 'center',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: BaseTheme_native_1.default.spacing[4]
    },
    unsafeRoomContentContainerWide: {
        alignItems: 'center',
        justifySelf: 'center',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginLeft: BaseTheme_native_1.default.spacing[7],
        paddingHorizontal: BaseTheme_native_1.default.spacing[6]
    },
    warningText: {
        ...BaseTheme_native_1.default.typography.bodyLongRegularLarge,
        color: BaseTheme_native_1.default.palette.text01,
        textAlign: 'center',
        marginBottom: BaseTheme_native_1.default.spacing[4]
    },
    warningIconWrapper: {
        backgroundColor: BaseTheme_native_1.default.palette.warning01,
        borderRadius: BaseTheme_native_1.default.shape.circleRadius,
        padding: BaseTheme_native_1.default.spacing[4],
        marginBottom: BaseTheme_native_1.default.spacing[4],
        zIndex: 0
    },
    warningIcon: {
        color: BaseTheme_native_1.default.palette.ui01,
        fontSize: 40
    }
};
