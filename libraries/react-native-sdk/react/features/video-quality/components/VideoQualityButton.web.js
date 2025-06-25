"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actions_1 = require("../../base/dialog/actions");
const functions_2 = require("../../base/i18n/functions");
const svg_1 = require("../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const VideoQualityDialog_web_1 = __importDefault(require("./VideoQualityDialog.web"));
/**
 * React {@code Component} responsible for displaying a button in the overflow
 * menu of the toolbar, including an icon showing the currently selected
 * max receive quality.
 *
 * @augments Component
 */
class VideoQualityButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.callQuality';
        this.label = 'videoStatus.performanceSettings';
        this.tooltip = 'videoStatus.performanceSettings';
        this.icon = svg_1.IconPerformance;
    }
    /**
    * Handles clicking the button, and opens the video quality dialog.
    *
    * @private
    * @returns {void}
    */
    _handleClick() {
        const { dispatch } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('video.quality'));
        dispatch((0, actions_1.openDialog)(VideoQualityDialog_web_1.default));
    }
}
exports.default = (0, react_redux_1.connect)()((0, functions_2.translate)(VideoQualityButton));
