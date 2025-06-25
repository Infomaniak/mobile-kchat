"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldShowModeratorSettings = exports.getShortcutsTabProps = void 0;
const functions_1 = require("../base/participants/functions");
const functions_2 = require("../base/redux/functions");
const functions_3 = require("../participants-pane/functions");
__exportStar(require("./functions.any"), exports);
/**
 * Used on web.
 *
 * @param {(Function|Object)} _stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {boolean} _isDisplayedOnWelcomePage - Indicates whether the shortcuts dialog is displayed on the
 * welcome page or not.
 * @returns {Object} - The properties for the "Shortcuts" tab from settings
 * dialog.
 */
function getShortcutsTabProps(_stateful, _isDisplayedOnWelcomePage) {
    // needed to fix lint error.
    return {
        keyboardShortcutsEnabled: false
    };
}
exports.getShortcutsTabProps = getShortcutsTabProps;
/**
 * Returns true if moderator tab in settings should be visible/accessible.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {boolean} True to indicate that moderator tab should be visible, false otherwise.
 */
function shouldShowModeratorSettings(stateful) {
    const state = (0, functions_2.toState)(stateful);
    const { hideModeratorSettingsTab } = (0, functions_3.getParticipantsPaneConfig)(state);
    const hasModeratorRights = (0, functions_1.isLocalParticipantModerator)(state);
    return hasModeratorRights && !hideModeratorSettingsTab;
}
exports.shouldShowModeratorSettings = shouldShowModeratorSettings;
