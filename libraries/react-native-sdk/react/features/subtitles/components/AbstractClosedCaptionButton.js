"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._abstractMapStateToProps = exports.AbstractClosedCaptionButton = void 0;
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const constants_1 = require("../../base/jwt/constants");
const AbstractButton_1 = __importDefault(require("../../base/toolbox/components/AbstractButton"));
const actions_1 = require("../../jaas/actions");
const functions_any_1 = require("../functions.any");
/**
 * The button component which starts/stops the transcription.
 */
class AbstractClosedCaptionButton extends AbstractButton_1.default {
    /**
     * Helper function to be implemented by subclasses, which should be used
     * to handle the closed caption button being clicked / pressed.
     *
     * @protected
     * @returns {void}
     */
    _handleClickOpenLanguageSelector() {
        // To be implemented by subclass.
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    async _handleClick() {
        const { _requestingSubtitles, dispatch } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('transcribing.ccButton', {
            'requesting_subtitles': Boolean(_requestingSubtitles)
        }));
        const dialogShown = await dispatch((0, actions_1.maybeShowPremiumFeatureDialog)(constants_1.MEET_FEATURES.RECORDING));
        if (!dialogShown) {
            this._handleClickOpenLanguageSelector();
        }
    }
    /**
     * Indicates whether this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
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
        return this.props._requestingSubtitles;
    }
}
exports.AbstractClosedCaptionButton = AbstractClosedCaptionButton;
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code AbstractClosedCaptionButton} component.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component
 * instance.
 * @private
 * @returns {{
 *     _requestingSubtitles: boolean,
 *     _language: string,
 *     visible: boolean
 * }}
 */
function _abstractMapStateToProps(state, ownProps) {
    const { _requestingSubtitles, _language } = state['features/subtitles'];
    // if the participant is moderator, it can enable transcriptions and if
    // transcriptions are already started for the meeting, guests can just show them
    const { visible = (0, functions_any_1.canStartSubtitles)(state) } = ownProps;
    return {
        _requestingSubtitles,
        _language,
        visible
    };
}
exports._abstractMapStateToProps = _abstractMapStateToProps;
