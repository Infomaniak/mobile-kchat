"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const constants_1 = require("../../../base/flags/constants");
const functions_2 = require("../../../base/flags/functions");
const functions_3 = require("../../../base/i18n/functions");
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const AbstractSpeakerStatsButton_1 = __importDefault(require("../AbstractSpeakerStatsButton"));
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
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('speaker.stats'));
        return (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.speakerStats);
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code SpeakerStatsButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     visible: boolean
 * }}
 */
function _mapStateToProps(state) {
    const enabled = (0, functions_2.getFeatureFlag)(state, constants_1.SPEAKERSTATS_ENABLED, true);
    return {
        visible: enabled
    };
}
exports.default = (0, functions_3.translate)((0, react_redux_1.connect)(_mapStateToProps)(SpeakerStatsButton));
