"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const svg_1 = require("../../icons/svg");
const AbstractButton_1 = __importDefault(require("./AbstractButton"));
/**
 * An abstract implementation of a button for disconnecting a conference.
 */
class AbstractHangupButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.icon = svg_1.IconHangup;
    }
    /**
     * Handles clicking / pressing the button, and disconnects the conference.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this._doHangup();
    }
    /**
     * Helper function to perform the actual hangup action.
     *
     * @protected
     * @returns {void}
     */
    _doHangup() {
        // To be implemented by subclass.
    }
}
exports.default = AbstractHangupButton;
