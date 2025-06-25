"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const react_1 = require("react");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const functions_2 = require("../../functions");
/**
 * A React Component for confirming the participant wishes to stop the currently
 * active live stream of the conference.
 *
 * @augments Component
 */
class AbstractStopLiveStreamDialog extends react_1.Component {
    /**
     * Initializes a new {@code StopLiveStreamDialog} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handler so it is only bound once for every instance.
        this._onSubmit = this._onSubmit.bind(this);
    }
    /**
     * Callback invoked when stopping of live streaming is confirmed.
     *
     * @private
     * @returns {boolean} True to close the modal.
     */
    _onSubmit() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createLiveStreamingDialogEvent)('stop', 'confirm.button'));
        const { _session } = this.props;
        if (_session) {
            this.props._conference?.stopRecording(_session.id);
        }
        return true;
    }
}
exports.default = AbstractStopLiveStreamDialog;
/**
 * Maps (parts of) the redux state to the React {@code Component} props of
 * {@code StopLiveStreamDialog}.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {{
 *     _conference: Object,
 *     _session: Object
 * }}
 */
function _mapStateToProps(state) {
    return {
        _conference: state['features/base/conference'].conference,
        _session: (0, functions_2.getActiveSession)(state, lib_jitsi_meet_1.JitsiRecordingConstants.mode.STREAM)
    };
}
exports._mapStateToProps = _mapStateToProps;
