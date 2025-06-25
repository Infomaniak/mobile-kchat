"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIGHT_GREY = exports.DARK_GREY = exports.AVATAR_SIZE = void 0;
const BoxModel_1 = require("../../../../base/styles/components/styles/BoxModel");
const BaseTheme_native_1 = __importDefault(require("../../../../base/ui/components/BaseTheme.native"));
exports.AVATAR_SIZE = 40;
exports.DARK_GREY = 'rgb(28, 32, 37)';
exports.LIGHT_GREY = 'rgb(209, 219, 232)';
exports.default = {
    addPeopleContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        flex: 1
    },
    avatar: {
        backgroundColor: exports.LIGHT_GREY
    },
    customContainer: {
        marginHorizontal: BaseTheme_native_1.default.spacing[3],
        marginVertical: BaseTheme_native_1.default.spacing[2]
    },
    avatarText: {
        color: exports.DARK_GREY,
        fontSize: 12
    },
    bottomBar: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.ui01
    },
    clearButton: {
        paddingTop: 7
    },
    clearIcon: {
        color: BaseTheme_native_1.default.palette.ui02,
        fontSize: 18,
        textAlign: 'center'
    },
    /**
     * A special padding to avoid issues on some devices (such as Android devices with custom suggestions bar).
     */
    extraBarPadding: {
        paddingBottom: 30
    },
    headerCloseIcon: {
        marginLeft: 12
    },
    headerSendInvite: {
        color: BaseTheme_native_1.default.palette.text01,
        marginRight: 12
    },
    invitedList: {
        padding: 3
    },
    itemLinesStyle: {
        color: 'rgb(118, 136, 152)',
        fontSize: 13
    },
    itemText: {
        color: BaseTheme_native_1.default.palette.text01,
        fontSize: 14,
        fontWeight: 'normal'
    },
    itemWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 5
    },
    resultList: {
        flex: 1,
        padding: 5
    },
    selectedIcon: {
        color: BaseTheme_native_1.default.palette.icon01,
        fontSize: 20,
        marginRight: BoxModel_1.BoxModel.margin,
        padding: 2
    },
    separator: {
        borderBottomColor: BaseTheme_native_1.default.palette.ui07,
        borderBottomWidth: 1,
        marginLeft: 85
    },
    searchIcon: {
        color: BaseTheme_native_1.default.palette.icon01,
        fontSize: 22
    },
    shareIcon: {
        fontSize: 42
    },
    unselectIcon: {
        color: BaseTheme_native_1.default.palette.ui01,
        fontSize: 16,
        left: exports.AVATAR_SIZE / -3,
        position: 'relative',
        top: exports.AVATAR_SIZE / -3
    },
    sendBtn: {
        marginRight: BaseTheme_native_1.default.spacing[3]
    }
};
