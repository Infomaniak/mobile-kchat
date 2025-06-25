"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/dialog/actions");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const AudioRoutePickerDialog_1 = __importDefault(require("./AudioRoutePickerDialog"));
/**
 * Implements an {@link AbstractButton} to open the audio device list.
 */
class AudioDeviceToggleButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.audioRoute';
        this.icon = svg_1.IconVolumeUp;
        this.label = 'toolbar.accessibilityLabel.audioRoute';
    }
    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        this.props.dispatch((0, actions_1.openSheet)(AudioRoutePickerDialog_1.default));
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(AudioDeviceToggleButton));
