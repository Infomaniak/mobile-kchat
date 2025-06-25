"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSecurityDialog = void 0;
const actions_1 = require("../base/dialog/actions");
const security_dialog_1 = require("./components/security-dialog");
/**
 * Action that triggers toggle of the security options dialog.
 *
 * @returns {Function}
 */
function toggleSecurityDialog() {
    return function (dispatch) {
        dispatch((0, actions_1.toggleDialog)(security_dialog_1.SecurityDialog));
    };
}
exports.toggleSecurityDialog = toggleSecurityDialog;
