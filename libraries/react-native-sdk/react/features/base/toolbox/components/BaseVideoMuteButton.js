"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const svg_1 = require("../../icons/svg");
const AbstractButton_1 = __importDefault(require("./AbstractButton"));
/**
 * An abstract implementation of a button for toggling video mute.
 */
class BaseVideoMuteButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.icon = svg_1.IconVideo;
        this.toggledIcon = svg_1.IconVideoOff;
    }
    /**
     * Handles clicking / pressing the button, and toggles the video mute state
     * accordingly.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this._setVideoMuted(!this._isVideoMuted());
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this._isVideoMuted();
    }
    /**
     * Helper function to be implemented by subclasses, which must return a
     * {@code boolean} value indicating if video is muted or not.
     *
     * @protected
     * @returns {boolean}
     */
    _isVideoMuted() {
        // To be implemented by subclass.
        return false;
    }
    /**
     * Helper function to perform the actual setting of the video mute / unmute
     * action.
     *
     * @param {boolean} _videoMuted - Whether video should be muted or not.
     * @protected
     * @returns {void}
     */
    _setVideoMuted(_videoMuted) {
        // To be implemented by subclass.
    }
}
exports.default = BaseVideoMuteButton;
