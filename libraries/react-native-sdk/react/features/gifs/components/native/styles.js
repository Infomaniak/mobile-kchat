"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
exports.default = {
    container: {
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        flex: 1
    },
    customContainer: {
        marginHorizontal: BaseTheme_native_1.default.spacing[3],
        marginVertical: BaseTheme_native_1.default.spacing[2]
    },
    grid: {
        flex: 1,
        marginLeft: BaseTheme_native_1.default.spacing[3],
        marginRight: BaseTheme_native_1.default.spacing[3]
    },
    credit: {
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.ui01,
        display: 'flex',
        flexDirection: 'row',
        height: 56,
        justifyContent: 'center',
        marginBottom: BaseTheme_native_1.default.spacing[0],
        paddingBottom: BaseTheme_native_1.default.spacing[4],
        width: '100%'
    },
    creditText: {
        color: BaseTheme_native_1.default.palette.text01,
        fontWeight: 'bold'
    }
};
