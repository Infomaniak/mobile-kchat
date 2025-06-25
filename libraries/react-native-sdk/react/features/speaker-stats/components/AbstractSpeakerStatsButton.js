"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const svg_1 = require("../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
/**
 * Implementation of a button for opening speaker stats dialog.
 */
class AbstractSpeakerStatsButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.speakerStats';
        this.icon = svg_1.IconConnection;
        this.label = 'toolbar.speakerStats';
        this.tooltip = 'toolbar.speakerStats';
    }
}
exports.default = AbstractSpeakerStatsButton;
