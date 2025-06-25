"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_native_1 = require("../../../base/styles/functions.native");
const BaseTheme_1 = __importDefault(require("../../../base/ui/components/BaseTheme"));
/**
 * The styles of the React {@code Components} of the feature recording.
 */
exports.default = (0, functions_native_1.createStyleSheet)({
    /**
     * Style for the recording indicator.
     */
    indicatorStyle: {
        marginRight: 4,
        marginLeft: 0,
        marginBottom: 0,
        backgroundColor: BaseTheme_1.default.palette.iconError
    }
});
