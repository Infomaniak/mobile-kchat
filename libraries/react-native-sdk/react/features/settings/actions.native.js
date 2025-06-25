"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openLogoutDialog = void 0;
const react_native_1 = require("react-native");
const functions_1 = require("../authentication/functions");
const actions_native_1 = require("../base/connection/actions.native");
const actions_1 = require("../base/dialog/actions");
const LogoutDialog_1 = __importDefault(require("./components/native/LogoutDialog"));
/**
 * Opens {@code LogoutDialog}.
 *
 * @returns {Function}
 */
function openLogoutDialog() {
    return (dispatch, getState) => {
        const state = getState();
        const { conference } = state['features/base/conference'];
        const config = state['features/base/config'];
        const logoutUrl = config.tokenLogoutUrl;
        dispatch((0, actions_1.openDialog)(LogoutDialog_1.default, {
            onLogout() {
                if ((0, functions_1.isTokenAuthEnabled)(config)) {
                    if (logoutUrl) {
                        react_native_1.Linking.openURL(logoutUrl);
                    }
                    dispatch((0, actions_native_1.hangup)(true));
                }
                else {
                    conference?.room.xmpp.moderator.logout(() => dispatch((0, actions_native_1.hangup)(true)));
                }
            }
        }));
    };
}
exports.openLogoutDialog = openLogoutDialog;
