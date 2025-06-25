"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
exports.default = {
    lobbyChatWrapper: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        flex: 1
    },
    passwordJoinButtons: {
        top: 40
    },
    contentContainer: {
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.uiBackground,
        bottom: 0,
        display: 'flex',
        height: 388,
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        zIndex: 1
    },
    formWrapper: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    customInput: {
        position: 'relative',
        textAlign: 'center',
        top: BaseTheme_native_1.default.spacing[6],
        width: 352
    },
    joiningMessage: {
        color: BaseTheme_native_1.default.palette.text01,
        marginHorizontal: BaseTheme_native_1.default.spacing[3],
        textAlign: 'center'
    },
    loadingIndicator: {
        marginBottom: BaseTheme_native_1.default.spacing[3]
    },
    // KnockingParticipantList
    knockingParticipantList: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01
    },
    knockingParticipantListDetails: {
        flex: 1,
        marginLeft: BaseTheme_native_1.default.spacing[2]
    },
    knockingParticipantListEntry: {
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        flexDirection: 'row'
    },
    knockingParticipantListText: {
        color: 'white'
    },
    lobbyButtonAdmit: {
        position: 'absolute',
        right: 184,
        top: 6
    },
    lobbyButtonChat: {
        position: 'absolute',
        right: 104,
        top: 6
    },
    lobbyButtonReject: {
        position: 'absolute',
        right: 16,
        top: 6
    },
    lobbyTitle: {
        ...BaseTheme_native_1.default.typography.heading5,
        color: BaseTheme_native_1.default.palette.text01,
        marginBottom: BaseTheme_native_1.default.spacing[3],
        textAlign: 'center'
    },
    lobbyWaitingFragmentContainer: {
        height: 260
    }
};
