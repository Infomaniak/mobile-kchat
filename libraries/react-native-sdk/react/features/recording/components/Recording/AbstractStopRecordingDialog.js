"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const react_1 = require("react");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const actions_1 = require("../../../base/media/actions");
const actions_any_1 = require("../../../subtitles/actions.any");
const actions_2 = require("../../actions");
const constants_1 = require("../../constants");
const functions_2 = require("../../functions");
const LocalRecordingManager_1 = __importDefault(require("./LocalRecordingManager"));
/**
 * Abstract React Component for getting confirmation to stop a file recording
 * session in progress.
 *
 * @augments Component
 */
class AbstractStopRecordingDialog extends react_1.Component {
    /**
     * Initializes a new {@code AbstrStopRecordingDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        // Bind event handler so it is only bound once for every instance.
        this._onSubmit = this._onSubmit.bind(this);
        this._toggleScreenshotCapture = this._toggleScreenshotCapture.bind(this);
    }
    /**
     * Stops the recording session.
     *
     * @private
     * @returns {boolean} - True (to note that the modal should be closed).
     */
    _onSubmit() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRecordingDialogEvent)('stop', 'confirm.button'));
        const { _conference, _displaySubtitles, _fileRecordingSession, _localRecording, _subtitlesLanguage, dispatch, localRecordingVideoStop } = this.props;
        if (_localRecording) {
            dispatch((0, actions_2.stopLocalVideoRecording)());
            if (localRecordingVideoStop) {
                dispatch((0, actions_1.setVideoMuted)(true));
            }
        }
        else if (_fileRecordingSession) {
            _conference?.stopRecording(_fileRecordingSession.id);
            this._toggleScreenshotCapture();
        }
        // TODO: this should be an action in transcribing. -saghul
        this.props.dispatch((0, actions_any_1.setRequestingSubtitles)(Boolean(_displaySubtitles), _displaySubtitles, _subtitlesLanguage));
        this.props._conference?.getMetadataHandler().setMetadata(constants_1.RECORDING_METADATA_ID, {
            isTranscribingEnabled: false
        });
        return true;
    }
    /**
     * Toggles screenshot capture feature.
     *
     * @returns {void}
     */
    _toggleScreenshotCapture() {
        // To be implemented by subclass.
    }
}
exports.default = AbstractStopRecordingDialog;
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code StopRecordingDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { _displaySubtitles, _language: _subtitlesLanguage } = state['features/subtitles'];
    return {
        _conference: state['features/base/conference'].conference,
        _displaySubtitles,
        _fileRecordingSession: (0, functions_2.getActiveSession)(state, lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE),
        _localRecording: LocalRecordingManager_1.default.isRecordingLocally(),
        _subtitlesLanguage
    };
}
exports._mapStateToProps = _mapStateToProps;
