"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iconStyle = exports.CONNECTOR_INDICATOR_COLORS = exports.CONNECTOR_INDICATOR_OTHER = exports.CONNECTOR_INDICATOR_LOST = void 0;
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const AbstractConnectionIndicator_1 = require("../AbstractConnectionIndicator");
exports.CONNECTOR_INDICATOR_LOST = BaseTheme_native_1.default.palette.ui05;
exports.CONNECTOR_INDICATOR_OTHER = BaseTheme_native_1.default.palette.action01;
exports.CONNECTOR_INDICATOR_COLORS = [
    // Full (3 bars)
    {
        color: BaseTheme_native_1.default.palette.success01,
        percent: AbstractConnectionIndicator_1.INDICATOR_DISPLAY_THRESHOLD
    },
    // 2 bars.
    {
        color: BaseTheme_native_1.default.palette.warning01,
        percent: 10
    },
    // 1 bar.
    {
        color: BaseTheme_native_1.default.palette.iconError,
        percent: 0
    }
];
exports.iconStyle = {
    fontSize: 14
};
