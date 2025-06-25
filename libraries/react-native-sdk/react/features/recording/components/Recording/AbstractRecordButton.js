"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const svg_1 = require("../../../base/icons/svg");
const constants_1 = require("../../../base/jwt/constants");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_1 = require("../../../jaas/actions");
const functions_2 = require("../../functions");
/**
 * An abstract implementation of a button for starting and stopping recording.
 */
class AbstractRecordButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'dialog.startRecording';
        this.toggledAccessibilityLabel = 'dialog.stopRecording';
        this.icon = svg_1.IconRecord;
        this.label = 'dialog.startRecording';
        this.toggledLabel = 'dialog.stopRecording';
        this.toggledIcon = svg_1.IconStop;
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
     * to handle the start recoding button being clicked / pressed.
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
        const { _isRecordingRunning, dispatch } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('recording.button', {
            'is_recording': _isRecordingRunning,
            type: lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE
        }));
        const dialogShown = await dispatch((0, actions_1.maybeShowPremiumFeatureDialog)(constants_1.MEET_FEATURES.RECORDING));
        if (!dialogShown) {
            this._onHandleClick();
        }
    }
    /**
     * Helper function to be implemented by subclasses, which must return a
     * boolean value indicating if this button is disabled or not.
     *
     * @override
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
        return this.props._isRecordingRunning;
    }
}
exports.default = AbstractRecordButton;
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code RecordButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _disabled: boolean,
 *     _isRecordingRunning: boolean,
 *     _tooltip: string,
 *     visible: boolean
 * }}
 */
function _mapStateToProps(state) {
    const { disabled: _disabled, tooltip: _tooltip, visible } = (0, functions_2.getRecordButtonProps)(state);
    return {
        _disabled,
        _isRecordingRunning: (0, functions_2.canStopRecording)(state),
        _tooltip,
        visible
    };
}
exports._mapStateToProps = _mapStateToProps;
