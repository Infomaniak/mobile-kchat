"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const contentColumn = {
    flex: 1,
    flexDirection: 'column',
    marginLeft: BaseTheme_native_1.default.spacing[2]
};
const notification = {
    backgroundColor: BaseTheme_native_1.default.palette.ui10,
    borderRadius: BaseTheme_native_1.default.shape.borderRadius,
    borderLeftColor: BaseTheme_native_1.default.palette.link01Active,
    borderLeftWidth: BaseTheme_native_1.default.spacing[1],
    display: 'flex',
    flexDirection: 'row',
    height: 'auto',
    marginBottom: BaseTheme_native_1.default.spacing[2],
    marginHorizontal: BaseTheme_native_1.default.spacing[2],
    maxWidth: 400,
    width: 'auto'
};
/**
 * The styles of the React {@code Components} of the feature notifications.
 */
exports.default = {
    /**
     * The content (left) column of the notification.
     */
    interactiveContentColumn: {
        ...contentColumn
    },
    contentColumn: {
        ...contentColumn,
        justifyContent: 'center'
    },
    /**
     * Test style of the notification.
     */
    contentContainer: {
        marginHorizontal: BaseTheme_native_1.default.spacing[2]
    },
    contentText: {
        color: BaseTheme_native_1.default.palette.text04,
        marginLeft: BaseTheme_native_1.default.spacing[5],
        marginTop: BaseTheme_native_1.default.spacing[1]
    },
    contentTextTitle: {
        color: BaseTheme_native_1.default.palette.text04,
        fontWeight: 'bold',
        marginLeft: BaseTheme_native_1.default.spacing[5],
        marginTop: BaseTheme_native_1.default.spacing[2]
    },
    /**
     * Dismiss icon style.
     */
    dismissIcon: {
        color: BaseTheme_native_1.default.palette.icon04,
        fontSize: 20
    },
    notification: {
        ...notification
    },
    notificationWithDescription: {
        ...notification,
        paddingBottom: BaseTheme_native_1.default.spacing[2]
    },
    /**
     * Wrapper for the message.
     */
    notificationContent: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    participantName: {
        color: BaseTheme_native_1.default.palette.text04,
        overflow: 'hidden'
    },
    iconContainer: {
        left: BaseTheme_native_1.default.spacing[1],
        position: 'absolute',
        top: BaseTheme_native_1.default.spacing[2]
    },
    btn: {
        marginLeft: BaseTheme_native_1.default.spacing[4]
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: BaseTheme_native_1.default.spacing[3]
    },
    withToolbox: {
        bottom: 56,
        position: 'absolute',
        width: '100%'
    },
    withToolboxTileView: {
        bottom: 56,
        position: 'absolute',
        width: '100%'
    },
    withoutToolbox: {
        position: 'absolute',
        width: '100%'
    },
    withoutToolboxTileView: {
        bottom: 0,
        position: 'absolute',
        width: '100%'
    }
};
