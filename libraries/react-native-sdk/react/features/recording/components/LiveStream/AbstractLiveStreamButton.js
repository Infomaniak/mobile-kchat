"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const svg_1 = require("../../../base/icons/svg");
const constants_1 = require("../../../base/jwt/constants");
const functions_1 = require("../../../base/jwt/functions");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const functions_2 = require("../../../base/participants/functions");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const functions_3 = require("../../../breakout-rooms/functions");
const actions_1 = require("../../../jaas/actions");
const functions_4 = require("../../../transcribing/functions");
const functions_5 = require("../../functions");
const functions_6 = require("./functions");
/**
 * An abstract class of a button for starting and stopping live streaming.
 */
class AbstractLiveStreamButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'dialog.startLiveStreaming';
        this.toggledAccessibilityLabel = 'dialog.stopLiveStreaming';
        this.icon = svg_1.IconSites;
        this.label = 'dialog.startLiveStreaming';
        this.toggledLabel = 'dialog.stopLiveStreaming';
    }
    /**
     * Returns the tooltip that should be displayed when the button is disabled.
     *
     * @private
     * @returns {string}
     */
    _getTooltip() {
        return this.props._tooltip ?? '';
    }
    /**
     * Helper function to be implemented by subclasses, which should be used
     * to handle the live stream button being clicked / pressed.
     *
     * @protected
     * @returns {void}
     */
    _onHandleClick() {
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
        const { dispatch } = this.props;
        const dialogShown = await dispatch((0, actions_1.maybeShowPremiumFeatureDialog)(constants_1.MEET_FEATURES.RECORDING));
        if (!dialogShown) {
            this._onHandleClick();
        }
    }
    /**
     * Returns a boolean value indicating if this button is disabled or not.
     *
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return this.props._disabled;
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._isLiveStreamRunning;
    }
}
exports.default = AbstractLiveStreamButton;
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code AbstractLiveStreamButton} component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the Component.
 * @private
 * @returns {{
 *     _disabled: boolean,
 *     _isLiveStreamRunning: boolean,
 *     visible: boolean
 * }}
 */
function _mapStateToProps(state, ownProps) {
    let { visible } = ownProps;
    // A button can be disabled/enabled only if enableFeaturesBasedOnToken
    // is on or if the recording is running.
    let _disabled = false;
    let _tooltip = '';
    if (typeof visible === 'undefined') {
        // If the containing component provides the visible prop, that is one
        // above all, but if not, the button should be autonomous and decide on
        // its own to be visible or not.
        const isModerator = (0, functions_2.isLocalParticipantModerator)(state);
        const liveStreaming = (0, functions_6.getLiveStreaming)(state);
        if (isModerator) {
            visible = liveStreaming.enabled ? (0, functions_1.isJwtFeatureEnabled)(state, 'livestreaming', true) : false;
        }
        else {
            visible = false;
        }
    }
    // disable the button if the recording is running.
    if (visible && ((0, functions_5.isCloudRecordingRunning)(state) || (0, functions_4.isRecorderTranscriptionsRunning)(state))) {
        _disabled = true;
        _tooltip = 'dialog.liveStreamingDisabledBecauseOfActiveRecordingTooltip';
    }
    // disable the button if we are in a breakout room.
    if ((0, functions_3.isInBreakoutRoom)(state)) {
        _disabled = true;
        visible = false;
    }
    return {
        _disabled,
        _isLiveStreamRunning: Boolean((0, functions_5.getActiveSession)(state, lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM)),
        _tooltip,
        visible
    };
}
exports._mapStateToProps = _mapStateToProps;
