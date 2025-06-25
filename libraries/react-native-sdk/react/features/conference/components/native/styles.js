"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSECURE_ROOM_NAME_LABEL_COLOR = void 0;
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
exports.INSECURE_ROOM_NAME_LABEL_COLOR = BaseTheme_native_1.default.palette.actionDanger;
const TITLE_BAR_BUTTON_SIZE = 24;
/**
 * The styles of the safe area view that contains the title bar.
 */
const titleBarSafeView = {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
};
const alwaysOnTitleBar = {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    borderRadius: BaseTheme_native_1.default.shape.borderRadius,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: BaseTheme_native_1.default.spacing[3],
    paddingRight: BaseTheme_native_1.default.spacing[0],
    '&:not(:empty)': {
        padding: BaseTheme_native_1.default.spacing[1]
    }
};
/**
 * The styles of the feature conference.
 */
exports.default = {
    /**
     * {@code Conference} Style.
     */
    conference: {
        alignSelf: 'stretch',
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
        flex: 1
    },
    displayNameContainer: {
        margin: 10
    },
    /**
     * View that contains the indicators.
     */
    indicatorContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    titleBarButtonContainer: {
        borderRadius: 3,
        height: BaseTheme_native_1.default.spacing[7],
        marginTop: BaseTheme_native_1.default.spacing[1],
        marginRight: BaseTheme_native_1.default.spacing[1],
        zIndex: 1,
        width: BaseTheme_native_1.default.spacing[7]
    },
    titleBarButton: {
        iconStyle: {
            color: BaseTheme_native_1.default.palette.icon01,
            padding: 12,
            fontSize: TITLE_BAR_BUTTON_SIZE
        },
        underlayColor: 'transparent'
    },
    lonelyMeetingContainer: {
        alignSelf: 'stretch',
        alignItems: 'center',
        padding: BaseTheme_native_1.default.spacing[3]
    },
    lonelyMessage: {
        color: BaseTheme_native_1.default.palette.text01,
        paddingVertical: BaseTheme_native_1.default.spacing[2]
    },
    pipButtonContainer: {
        '&:not(:empty)': {
            borderRadius: 3,
            height: BaseTheme_native_1.default.spacing[7],
            marginTop: BaseTheme_native_1.default.spacing[1],
            marginLeft: BaseTheme_native_1.default.spacing[1],
            zIndex: 1,
            width: BaseTheme_native_1.default.spacing[7]
        }
    },
    pipButton: {
        iconStyle: {
            color: BaseTheme_native_1.default.palette.icon01,
            padding: 12,
            fontSize: TITLE_BAR_BUTTON_SIZE
        },
        underlayColor: 'transparent'
    },
    titleBarSafeViewColor: {
        ...titleBarSafeView,
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground
    },
    titleBarSafeViewTransparent: {
        ...titleBarSafeView
    },
    titleBarWrapper: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        height: BaseTheme_native_1.default.spacing[8],
        justifyContent: 'center'
    },
    alwaysOnTitleBar: {
        ...alwaysOnTitleBar,
        marginRight: BaseTheme_native_1.default.spacing[2]
    },
    alwaysOnTitleBarWide: {
        ...alwaysOnTitleBar,
        marginRight: BaseTheme_native_1.default.spacing[12]
    },
    expandedLabelWrapper: {
        zIndex: 1
    },
    roomTimer: {
        ...BaseTheme_native_1.default.typography.bodyShortBold,
        color: BaseTheme_native_1.default.palette.text01,
        lineHeight: 14,
        textAlign: 'center'
    },
    roomTimerView: {
        backgroundColor: BaseTheme_native_1.default.palette.ui03,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        height: 32,
        justifyContent: 'center',
        paddingHorizontal: BaseTheme_native_1.default.spacing[2],
        paddingVertical: BaseTheme_native_1.default.spacing[1],
        minWidth: 50
    },
    roomName: {
        color: BaseTheme_native_1.default.palette.text01,
        ...BaseTheme_native_1.default.typography.bodyShortBold,
        paddingVertical: 6
    },
    roomNameView: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderBottomLeftRadius: 3,
        borderTopLeftRadius: 3,
        flexShrink: 1,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    roomNameWrapper: {
        flexDirection: 'row',
        marginRight: 10,
        marginLeft: 8,
        flexShrink: 1,
        flexGrow: 1
    },
    /**
     * The style of the {@link View} which expands over the whole
     * {@link Conference} area and splits it between the {@link Filmstrip} and
     * the {@link Toolbox}.
     */
    toolboxAndFilmstripContainer: {
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },
    insecureRoomNameLabel: {
        backgroundColor: exports.INSECURE_ROOM_NAME_LABEL_COLOR,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        height: 32
    },
    raisedHandsCountLabel: {
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.warning02,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        flexDirection: 'row',
        marginBottom: BaseTheme_native_1.default.spacing[0],
        marginLeft: BaseTheme_native_1.default.spacing[0]
    },
    raisedHandsCountLabelText: {
        color: BaseTheme_native_1.default.palette.uiBackground,
        paddingLeft: BaseTheme_native_1.default.spacing[2]
    }
};
