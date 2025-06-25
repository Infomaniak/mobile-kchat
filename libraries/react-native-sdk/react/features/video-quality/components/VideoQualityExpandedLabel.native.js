"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../../base/i18n/functions");
const ExpandedLabel_1 = __importDefault(require("../../base/label/components/native/ExpandedLabel"));
const styles_1 = require("./styles");
/**
 * A react {@code Component} that implements an expanded label as tooltip-like
 * component to explain the meaning of the {@code VideoQualityLabel}.
 */
class VideoQualityExpandedLabel extends ExpandedLabel_1.default {
    /**
     * Returns the color this expanded label should be rendered with.
     *
     * @returns {string}
     */
    _getColor() {
        return styles_1.AUD_LABEL_COLOR;
    }
    /**
     * Returns the label specific text of this {@code ExpandedLabel}.
     *
     * @returns {string}
     */
    _getLabel() {
        return this.props.t('videoStatus.audioOnlyExpanded');
    }
}
exports.default = (0, functions_1.translate)(VideoQualityExpandedLabel);
