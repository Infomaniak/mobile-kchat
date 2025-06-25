"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTheme_native_1 = __importDefault(require("../../../../base/ui/components/BaseTheme.native"));
/**
 * The size of the microphone icon.
 */
const MICROPHONE_SIZE = 180;
/**
 * The styles of the safe area view that contains the title bar.
 */
const titleBarSafeView = {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
};
/**
 * The styles of the native components of Carmode.
 */
exports.default = {
    bottomContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bottom: BaseTheme_native_1.default.spacing[8]
    },
    /**
     * {@code Conference} Style.
     */
    conference: {
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
        flex: 1,
        justifyContent: 'center'
    },
    microphoneStyles: {
        container: {
            borderRadius: MICROPHONE_SIZE / 2,
            height: MICROPHONE_SIZE,
            maxHeight: MICROPHONE_SIZE,
            justifyContent: 'center',
            overflow: 'hidden',
            width: MICROPHONE_SIZE,
            maxWidth: MICROPHONE_SIZE,
            flex: 1,
            zIndex: 1,
            elevation: 1
        },
        icon: {
            color: BaseTheme_native_1.default.palette.text01,
            fontSize: MICROPHONE_SIZE * 0.45,
            fontWeight: '100'
        },
        iconContainer: {
            alignItems: 'center',
            alignSelf: 'stretch',
            flex: 1,
            justifyContent: 'center',
            backgroundColor: BaseTheme_native_1.default.palette.ui03
        },
        unmuted: {
            borderWidth: 4,
            borderColor: BaseTheme_native_1.default.palette.success01
        }
    },
    qualityLabelContainer: {
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        flexShrink: 1,
        paddingHorizontal: 2,
        justifyContent: 'center',
        marginTop: BaseTheme_native_1.default.spacing[2]
    },
    roomTimer: {
        ...BaseTheme_native_1.default.typography.bodyShortBold,
        color: BaseTheme_native_1.default.palette.text01,
        textAlign: 'center'
    },
    titleView: {
        width: 152,
        height: 28,
        backgroundColor: BaseTheme_native_1.default.palette.ui02,
        borderRadius: 12,
        alignSelf: 'center'
    },
    title: {
        margin: 'auto',
        textAlign: 'center',
        paddingVertical: BaseTheme_native_1.default.spacing[1],
        paddingHorizontal: BaseTheme_native_1.default.spacing[3],
        color: BaseTheme_native_1.default.palette.text02
    },
    soundDeviceButton: {
        marginBottom: BaseTheme_native_1.default.spacing[3],
        width: 240
    },
    endMeetingButton: {
        width: 240
    },
    headerLabels: {
        borderBottomLeftRadius: 3,
        borderTopLeftRadius: 3,
        flexShrink: 1,
        paddingHorizontal: 2,
        justifyContent: 'center'
    },
    titleBarSafeViewColor: {
        ...titleBarSafeView,
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground
    },
    microphoneContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleBarWrapper: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    roomNameWrapper: {
        flexDirection: 'row',
        marginRight: BaseTheme_native_1.default.spacing[2],
        flexShrink: 1,
        flexGrow: 1
    },
    roomNameView: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexShrink: 1,
        justifyContent: 'center',
        paddingHorizontal: BaseTheme_native_1.default.spacing[2]
    },
    roomName: {
        color: BaseTheme_native_1.default.palette.text01,
        ...BaseTheme_native_1.default.typography.bodyShortBold
    },
    titleBar: {
        alignSelf: 'center',
        marginTop: BaseTheme_native_1.default.spacing[1]
    },
    videoStoppedLabel: {
        ...BaseTheme_native_1.default.typography.bodyShortRegularLarge,
        color: BaseTheme_native_1.default.palette.text01,
        marginBottom: BaseTheme_native_1.default.spacing[3],
        textAlign: 'center',
        width: '100%'
    },
    connectionIndicatorIcon: {
        fontSize: 20
    }
};
