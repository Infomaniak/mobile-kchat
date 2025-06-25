"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
exports.default = {
    customContainer: {
        marginVertical: BaseTheme_native_1.default.spacing[2]
    },
    speakerStatsContainer: {
        flexDirection: 'column',
        flex: 1,
        height: 'auto',
        paddingHorizontal: BaseTheme_native_1.default.spacing[3],
        backgroundColor: BaseTheme_native_1.default.palette.ui01
    },
    speakerStatsItemContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        height: BaseTheme_native_1.default.spacing[9],
        alignItems: 'center'
    },
    speakerStatsAvatar: {
        width: BaseTheme_native_1.default.spacing[5],
        height: BaseTheme_native_1.default.spacing[5],
        marginRight: BaseTheme_native_1.default.spacing[3]
    },
    speakerStatsNameTime: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    speakerStatsText: {
        ...BaseTheme_native_1.default.typography.bodyShortRegularLarge,
        color: BaseTheme_native_1.default.palette.text01
    },
    speakerStatsTime: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4
    },
    speakerStatsDominant: {
        backgroundColor: BaseTheme_native_1.default.palette.success02
    },
    speakerStatsLeft: {
        color: BaseTheme_native_1.default.palette.text03
    }
};
