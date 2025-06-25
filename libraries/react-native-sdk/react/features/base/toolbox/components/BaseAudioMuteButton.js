"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const svg_1 = require("../../icons/svg");
const AbstractButton_1 = __importDefault(require("./AbstractButton"));
/**
 * An abstract implementation of a button for toggling audio mute.
 */
class BaseAudioMuteButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.icon = svg_1.IconMic;
        this.toggledIcon = svg_1.IconMicSlash;
    }
    /**
     * Handles clicking / pressing the button, and toggles the audio mute state
     * accordingly.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this._setAudioMuted(!this._isAudioMuted());
    }
    /**
     * Helper function to be implemented by subclasses, which must return a
     * boolean value indicating if audio is muted or not.
     *
     * @protected
     * @returns {boolean}
     */
    _isAudioMuted() {
        // To be implemented by subclass.
        return false;
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this._isAudioMuted();
    }
    /**
     * Helper function to perform the actual setting of the audio mute / unmute
     * action.
     *
     * @param {boolean} _audioMuted - Whether audio should be muted or not.
     * @protected
     * @returns {void}
     */
    _setAudioMuted(_audioMuted) {
        // To be implemented by subclass.
    }
}
exports.default = BaseAudioMuteButton;
