"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.button = void 0;
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
/**
 * The style for participant list description.
 */
const participantListDescription = {
    ...BaseTheme_native_1.default.typography.heading6,
    color: BaseTheme_native_1.default.palette.text01,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: BaseTheme_native_1.default.spacing[2],
    paddingVertical: BaseTheme_native_1.default.spacing[2],
    position: 'relative',
    width: '70%'
};
/**
 * The style for content.
 */
const flexContent = {
    alignItems: 'center',
    color: BaseTheme_native_1.default.palette.icon01,
    display: 'flex',
    flex: 1
};
/**
 * The style for the context menu items text.
 */
const contextMenuItemText = {
    ...BaseTheme_native_1.default.typography.bodyShortRegularLarge,
    color: BaseTheme_native_1.default.palette.text01
};
/**
 * The style of the participants pane buttons.
 */
exports.button = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
};
/**
 * The style of the context menu pane items.
 */
const contextMenuItem = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: BaseTheme_native_1.default.spacing[7],
    marginLeft: BaseTheme_native_1.default.spacing[3]
};
const participantNameContainer = {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    paddingLeft: BaseTheme_native_1.default.spacing[3]
};
/**
 * The styles of the native components of the feature {@code participants}.
 */
exports.default = {
    participantsBadge: {
        backgroundColor: BaseTheme_native_1.default.palette.ui03,
        borderRadius: BaseTheme_native_1.default.spacing[2],
        borderColor: 'white',
        overflow: 'hidden',
        height: BaseTheme_native_1.default.spacing[3],
        minWidth: BaseTheme_native_1.default.spacing[3],
        color: BaseTheme_native_1.default.palette.text01,
        ...BaseTheme_native_1.default.typography.labelBold,
        position: 'absolute',
        right: -3,
        top: -3,
        textAlign: 'center',
        paddingHorizontal: 2
    },
    participantsButtonBadge: {
        display: 'flex',
        position: 'relative'
    },
    participantContainer: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        height: BaseTheme_native_1.default.spacing[9],
        paddingLeft: BaseTheme_native_1.default.spacing[3],
        paddingRight: BaseTheme_native_1.default.spacing[3],
        width: '100%'
    },
    participantContent: {
        alignItems: 'center',
        borderBottomColor: BaseTheme_native_1.default.palette.ui02,
        borderBottomWidth: 2.4,
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    },
    participantDetailsContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '73%'
    },
    participantDetailsContainerRaisedHand: {
        width: '65%'
    },
    participantNameContainer: {
        ...participantNameContainer,
        width: '100%'
    },
    lobbyParticipantNameContainer: {
        ...participantNameContainer,
        width: '40%'
    },
    participantName: {
        color: BaseTheme_native_1.default.palette.text01,
        overflow: 'hidden'
    },
    moderatorLabel: {
        color: BaseTheme_native_1.default.palette.text03,
        alignSelf: 'flex-start',
        paddingLeft: BaseTheme_native_1.default.spacing[3],
        paddingTop: BaseTheme_native_1.default.spacing[1]
    },
    participantStatesContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 'auto',
        width: '15%'
    },
    participantStateVideo: {
        paddingRight: BaseTheme_native_1.default.spacing[3]
    },
    raisedHandIndicator: {
        backgroundColor: BaseTheme_native_1.default.palette.warning02,
        borderRadius: BaseTheme_native_1.default.shape.borderRadius / 2,
        height: BaseTheme_native_1.default.spacing[4],
        width: BaseTheme_native_1.default.spacing[4],
        marginLeft: 'auto',
        marginRight: BaseTheme_native_1.default.spacing[2]
    },
    raisedHandIcon: {
        ...flexContent,
        top: BaseTheme_native_1.default.spacing[1],
        color: BaseTheme_native_1.default.palette.uiBackground
    },
    buttonAdmit: {
        position: 'absolute',
        right: 16
    },
    buttonReject: {
        position: 'absolute',
        right: 112
    },
    lobbyListDescription: {
        ...participantListDescription
    },
    listDetails: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    meetingListContainer: {
        paddingHorizontal: BaseTheme_native_1.default.spacing[3]
    },
    meetingListDescription: {
        ...participantListDescription
    },
    participantsPaneContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        flex: 1,
        flexDirection: 'column',
        paddingVertical: BaseTheme_native_1.default.spacing[2]
    },
    participantsPaneFooterContainer: {
        alignItems: 'center',
        bottom: 0,
        height: 128,
        left: 0,
        paddingHorizontal: BaseTheme_native_1.default.spacing[4],
        right: 0
    },
    participantsPaneFooter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingBottom: BaseTheme_native_1.default.spacing[3],
        width: '100%'
    },
    inviteButton: {
        marginLeft: BaseTheme_native_1.default.spacing[3],
        marginRight: BaseTheme_native_1.default.spacing[3],
        marginVertical: BaseTheme_native_1.default.spacing[2]
    },
    breakoutRoomsButton: {
        marginBottom: BaseTheme_native_1.default.spacing[2],
        width: '100%'
    },
    moreButton: {
        marginLeft: BaseTheme_native_1.default.spacing[2]
    },
    contextMenuItem: {
        ...contextMenuItem
    },
    contextMenuItemSection: {
        ...contextMenuItem
    },
    contextMenuItemSectionAvatar: {
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        borderBottomColor: BaseTheme_native_1.default.palette.ui07,
        borderBottomWidth: 1,
        borderTopLeftRadius: BaseTheme_native_1.default.spacing[3],
        borderTopRightRadius: BaseTheme_native_1.default.spacing[3],
        flexDirection: 'row',
        height: BaseTheme_native_1.default.spacing[7],
        paddingLeft: BaseTheme_native_1.default.spacing[3]
    },
    contextMenuItemText: {
        ...contextMenuItemText,
        marginLeft: BaseTheme_native_1.default.spacing[3]
    },
    contextMenuItemTextNoIcon: {
        ...contextMenuItemText,
        marginLeft: BaseTheme_native_1.default.spacing[6]
    },
    contextMenuItemName: {
        color: BaseTheme_native_1.default.palette.text04,
        flexShrink: 1,
        fontSize: BaseTheme_native_1.default.spacing[3],
        marginLeft: BaseTheme_native_1.default.spacing[3],
        opacity: 0.90
    },
    divider: {
        backgroundColor: BaseTheme_native_1.default.palette.ui07
    },
    inputContainer: {
        marginLeft: BaseTheme_native_1.default.spacing[3],
        marginRight: BaseTheme_native_1.default.spacing[3],
        marginBottom: BaseTheme_native_1.default.spacing[4]
    },
    centerInput: {
        paddingRight: BaseTheme_native_1.default.spacing[3],
        textAlign: 'center'
    },
    visitorsLabel: {
        ...BaseTheme_native_1.default.typography.heading6,
        color: BaseTheme_native_1.default.palette.warning02,
        marginLeft: BaseTheme_native_1.default.spacing[2]
    }
};
