"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../../../base/i18n/functions");
const ExpandedLabel_1 = __importDefault(require("../../../base/label/components/native/ExpandedLabel"));
/**
 * A react {@code Component} that implements an expanded label as tooltip-like
 * component to explain the meaning of the {@code RaisedHandsCountExpandedLabel}.
 */
class RaisedHandsCountExpandedLabel extends ExpandedLabel_1.default {
    /**
     * Returns the label specific text of this {@code ExpandedLabel}.
     *
     * @returns {string}
     */
    _getLabel() {
        return this.props.t('raisedHandsLabel');
    }
}
exports.default = (0, functions_1.translate)(RaisedHandsCountExpandedLabel);
