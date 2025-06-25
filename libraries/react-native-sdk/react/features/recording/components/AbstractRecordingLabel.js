"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const react_1 = require("react");
const lib_jitsi_meet_1 = require("../../base/lib-jitsi-meet");
const functions_1 = require("../../transcribing/functions");
const functions_2 = require("../functions");
/**
 * Abstract class for the {@code RecordingLabel} component.
 */
class AbstractRecordingLabel extends react_1.Component {
    /**
     * Implements React {@code Component}'s render.
     *
     * @inheritdoc
     */
    render() {
        const { _iAmRecorder, _isVisible } = this.props;
        return _isVisible && !_iAmRecorder ? this._renderLabel() : null;
    }
    /**
     * Renders the platform specific label component.
     *
     * @protected
     * @returns {React$Element}
     */
    _renderLabel() {
        return null;
    }
}
exports.default = AbstractRecordingLabel;
/**
 * Maps (parts of) the Redux state to the associated
 * {@code AbstractRecordingLabel}'s props.
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
    const isLiveStreamingLabel = mode === lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM;
    const _isTranscribing = (0, functions_1.isRecorderTranscriptionsRunning)(state);
    const isLivestreamingRunning = Boolean((0, functions_2.getActiveSession)(state, lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM));
    const _isVisible = isLiveStreamingLabel
        ? isLivestreamingRunning // this is the livestreaming label
        : (0, functions_2.isRecordingRunning)(state) || (0, functions_2.isRemoteParticipantRecordingLocally)(state)
            || _isTranscribing; // this is the recording label
    return {
        _isVisible,
        _iAmRecorder: Boolean(state['features/base/config'].iAmRecorder),
        _isTranscribing,
        _status: (0, functions_2.getSessionStatusToShow)(state, mode)
    };
}
exports._mapStateToProps = _mapStateToProps;
