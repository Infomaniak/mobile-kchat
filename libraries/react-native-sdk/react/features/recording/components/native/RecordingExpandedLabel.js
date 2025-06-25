"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const ExpandedLabel_1 = __importDefault(require("../../../base/label/components/native/ExpandedLabel"));
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const functions_2 = require("../../../transcribing/functions");
const functions_3 = require("../../functions");
/**
 * A react {@code Component} that implements an expanded label as tooltip-like
 * component to explain the meaning of the {@code RecordingLabel}.
 */
class RecordingExpandedLabel extends ExpandedLabel_1.default {
    /**
     * Returns the label specific text of this {@code ExpandedLabel}.
     *
     * @returns {string}
     */
    _getLabel() {
        const { _status, mode, t } = this.props;
        let postfix = 'expandedOn', prefix = 'recording'; // Default values.
        switch (mode) {
            case lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM:
                prefix = 'liveStreaming';
                break;
            case lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE:
                prefix = 'recording';
                break;
        }
        switch (_status) {
            case lib_jitsi_meet_1.JitsiRecordingConstants.status.OFF:
                postfix = 'expandedOff';
                break;
            case lib_jitsi_meet_1.JitsiRecordingConstants.status.PENDING:
                postfix = 'expandedPending';
                break;
            case lib_jitsi_meet_1.JitsiRecordingConstants.status.ON:
                postfix = 'expandedOn';
                break;
        }
        let content = t(`${prefix}.${postfix}`);
        if (_status === lib_jitsi_meet_1.JitsiRecordingConstants.status.ON && this.props._isTranscribing) {
            content += ` \u00B7 ${t('transcribing.labelToolTip')}`;
        }
        return content;
    }
}
/**
 * Maps (parts of) the Redux state to the associated
 * {@code RecordingExpandedLabel}'s props.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The component's own props.
 * @private
 * @returns {{
 *     _status: ?string
 * }}
 */
function _mapStateToProps(state, ownProps) {
    const { mode } = ownProps;
    return {
        _isTranscribing: (0, functions_2.isRecorderTranscriptionsRunning)(state),
        _status: (0, functions_3.getSessionStatusToShow)(state, mode)
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(RecordingExpandedLabel));
