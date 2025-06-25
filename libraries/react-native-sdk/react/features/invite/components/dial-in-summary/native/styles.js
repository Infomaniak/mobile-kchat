"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INDICATOR_COLOR = void 0;
const BaseTheme_native_1 = __importDefault(require("../../../../base/ui/components/BaseTheme.native"));
exports.INDICATOR_COLOR = BaseTheme_native_1.default.palette.ui07;
const WV_BACKGROUND = BaseTheme_native_1.default.palette.ui03;
exports.default = {
    backDrop: {
        backgroundColor: WV_BACKGROUND,
        flex: 1
    },
    indicatorWrapper: {
        alignItems: 'center',
        backgroundColor: BaseTheme_native_1.default.palette.ui10,
        height: '100%',
        justifyContent: 'center'
    },
    webView: {
        backgroundColor: WV_BACKGROUND,
        flex: 1
    }
};
