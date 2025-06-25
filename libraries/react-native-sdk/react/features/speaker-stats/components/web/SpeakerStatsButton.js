"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const actions_1 = require("../../../base/dialog/actions");
const functions_2 = require("../../../base/i18n/functions");
const functions_3 = require("../../functions");
const AbstractSpeakerStatsButton_1 = __importDefault(require("../AbstractSpeakerStatsButton"));
const SpeakerStats_1 = __importDefault(require("./SpeakerStats"));
/**
 * Implementation of a button for opening speaker stats dialog.
 */
class SpeakerStatsButton extends AbstractSpeakerStatsButton_1.default {
    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { dispatch } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('speaker.stats'));
        dispatch((0, actions_1.openDialog)(SpeakerStats_1.default));
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
const mapStateToProps = (state) => {
    return {
        visible: !(0, functions_3.isSpeakerStatsDisabled)(state)
    };
};
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(SpeakerStatsButton));
