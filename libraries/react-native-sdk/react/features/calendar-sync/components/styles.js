"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ColorPalette_1 = require("../../base/styles/components/styles/ColorPalette");
const functions_any_1 = require("../../base/styles/functions.any");
const BaseTheme_1 = __importDefault(require("../../base/ui/components/BaseTheme"));
const NOTIFICATION_SIZE = 55;
/**
 * The styles of the React {@code Component}s of the feature meeting-list i.e.
 * {@code CalendarList}.
 */
exports.default = (0, functions_any_1.createStyleSheet)({
    /**
     * Button style of the open settings button.
     */
    noPermissionMessageButton: {
        backgroundColor: ColorPalette_1.ColorPalette.blue,
        borderColor: ColorPalette_1.ColorPalette.blue,
        borderRadius: 4,
        borderWidth: 1,
        height: 30,
        justifyContent: 'center',
        margin: 15,
        paddingHorizontal: 20
    },
    /**
     * Text style of the open settings button.
     */
    noPermissionMessageButtonText: {
        color: ColorPalette_1.ColorPalette.white
    },
    /**
     * Text style of the no permission message.
     */
    noPermissionMessageText: {
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center'
    },
    /**
     * Top level view of the no permission message.
     */
    noPermissionMessageView: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 20
    },
    /**
     * The top level container of the notification.
     */
    notificationContainer: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'absolute'
    },
    /**
     * Additional style for the container when the notification is displayed
     * on the side (narrow view).
     */
    notificationContainerSide: {
        top: 100
    },
    /**
     * Additional style for the container when the notification is displayed
     * on the top (wide view).
     */
    notificationContainerTop: {
        justifyContent: 'center',
        left: 0,
        right: 0,
        top: 0
    },
    /**
     * The top level container of the notification.
     */
    notificationContent: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        height: NOTIFICATION_SIZE,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    /**
     * Color for upcoming meeting notification.
     */
    notificationContentNext: {
        backgroundColor: '#eeb231'
    },
    /**
     * Color for already ongoing meeting notifications.
     */
    notificationContentPast: {
        backgroundColor: 'red'
    },
    /**
     * Additional style for the content when the notification is displayed
     * on the side (narrow view).
     */
    notificationContentSide: {
        borderBottomRightRadius: NOTIFICATION_SIZE,
        borderTopRightRadius: NOTIFICATION_SIZE
    },
    /**
     * Additional style for the content when the notification is displayed
     * on the top (wide view).
     */
    notificationContentTop: {
        borderBottomLeftRadius: NOTIFICATION_SIZE / 2,
        borderBottomRightRadius: NOTIFICATION_SIZE / 2,
        paddingHorizontal: 20
    },
    /**
     * The icon of the notification.
     */
    notificationIcon: {
        color: 'white',
        fontSize: 25
    },
    /**
     * The container that contains the icon.
     */
    notificationIconContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        height: NOTIFICATION_SIZE,
        justifyContent: 'center'
    },
    /**
     * A single line of text of the notification.
     */
    notificationText: {
        color: 'white',
        fontSize: 13
    },
    /**
     * The container for all the lines if the norification.
     */
    notificationTextContainer: {
        flexDirection: 'column',
        height: NOTIFICATION_SIZE,
        justifyContent: 'center'
    },
    /**
     * The touchable component.
     */
    touchableView: {
        flexDirection: 'row'
    },
    calendarSync: {
        backgroundColor: BaseTheme_1.default.palette.uiBackground,
        flex: 1,
        overflow: 'hidden'
    },
    calendarSyncDisabled: {
        backgroundColor: BaseTheme_1.default.palette.uiBackground,
        flex: 1,
        opacity: 0.8,
        overflow: 'hidden'
    }
});
