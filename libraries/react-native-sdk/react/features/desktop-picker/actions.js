"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showDesktopPicker = void 0;
const actions_1 = require("../base/dialog/actions");
const DesktopPicker_1 = __importDefault(require("./components/DesktopPicker"));
/**
 * Signals to open a dialog with the DesktopPicker component.
 *
 * @param {Object} options - Desktop sharing settings.
 * @param {Function} onSourceChoose - The callback to invoke when
 * a DesktopCapturerSource has been chosen.
 * @returns {Object}
 */
function showDesktopPicker(options = {}, onSourceChoose) {
    const { desktopSharingSources } = options;
    return (0, actions_1.openDialog)(DesktopPicker_1.default, {
        desktopSharingSources,
        onSourceChoose
    });
}
exports.showDesktopPicker = showDesktopPicker;
