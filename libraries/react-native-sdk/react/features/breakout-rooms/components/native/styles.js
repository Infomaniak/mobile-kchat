"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
/**
 * The styles of the native components of the feature {@code breakout rooms}.
 */
exports.default = {
    button: {
        marginBottom: BaseTheme_native_1.default.spacing[4],
        marginHorizontal: BaseTheme_native_1.default.spacing[2]
    },
    collapsibleList: {
        alignItems: 'center',
        borderRadius: BaseTheme_native_1.default.shape.borderRadius,
        display: 'flex',
        flexDirection: 'row',
        height: BaseTheme_native_1.default.spacing[7],
        marginHorizontal: BaseTheme_native_1.default.spacing[2],
        marginTop: BaseTheme_native_1.default.spacing[3]
    },
    arrowIcon: {
        backgroundColor: BaseTheme_native_1.default.palette.ui03,
        height: BaseTheme_native_1.default.spacing[5],
        width: BaseTheme_native_1.default.spacing[5],
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    roomName: {
        fontSize: 15,
        color: BaseTheme_native_1.default.palette.text01,
        fontWeight: 'bold',
        marginLeft: BaseTheme_native_1.default.spacing[2]
    },
    listTile: {
        fontSize: 15,
        color: BaseTheme_native_1.default.palette.text01,
        fontWeight: 'bold',
        marginLeft: BaseTheme_native_1.default.spacing[2]
    },
    autoAssignLabel: {
        color: BaseTheme_native_1.default.palette.link01
    },
    autoAssignButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: BaseTheme_native_1.default.spacing[3]
    },
    breakoutRoomsContainer: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        flex: 1,
        flexDirection: 'column',
        height: 'auto',
        paddingHorizontal: BaseTheme_native_1.default.spacing[3]
    },
    inputContainer: {
        marginLeft: BaseTheme_native_1.default.spacing[2],
        marginRight: BaseTheme_native_1.default.spacing[2],
        marginTop: BaseTheme_native_1.default.spacing[4]
    },
    centerInput: {
        paddingRight: BaseTheme_native_1.default.spacing[3],
        textAlign: 'center'
    }
};
