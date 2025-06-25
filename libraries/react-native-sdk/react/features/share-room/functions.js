"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInviteOthersControl = void 0;
const BaseTheme_native_1 = __importDefault(require("../base/ui/components/BaseTheme.native"));
/**
 * Control for invite others button enabling.
 *
 * @param {IReduxState} state - State object.
 * @returns {Object}
 */
function getInviteOthersControl(state) {
    const { shareDialogVisible } = state['features/share-room'];
    const { icon01, icon03 } = BaseTheme_native_1.default.palette;
    return {
        color: shareDialogVisible ? icon03 : icon01,
        shareDialogVisible
    };
}
exports.getInviteOthersControl = getInviteOthersControl;
