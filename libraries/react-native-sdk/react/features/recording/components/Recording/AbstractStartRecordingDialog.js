"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapStateToProps = void 0;
const react_1 = require("react");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const actions_1 = require("../../../dropbox/actions");
const functions_any_1 = require("../../../dropbox/functions.any");
const actions_2 = require("../../../notifications/actions");
const constants_1 = require("../../../notifications/constants");
const actions_any_1 = require("../../../subtitles/actions.any");
const actions_3 = require("../../actions");
const constants_2 = require("../../constants");
const functions_2 = require("../../functions");
/**
 * Component for the recording start dialog.
 */
class AbstractStartRecordingDialog extends react_1.Component {
    /**
     * Initializes a new {@code StartRecordingDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        // Bind event handler so it is only bound once for every instance.
        this._onSubmit = this._onSubmit.bind(this);
        this._onSelectedRecordingServiceChanged
            = this._onSelectedRecordingServiceChanged.bind(this);
        this._onSharingSettingChanged = this._onSharingSettingChanged.bind(this);
        this._toggleScreenshotCapture = this._toggleScreenshotCapture.bind(this);
        this._onLocalRecordingSelfChange = this._onLocalRecordingSelfChange.bind(this);
        this._onTranscriptionChange = this._onTranscriptionChange.bind(this);
        this._onRecordAudioAndVideoChange = this._onRecordAudioAndVideoChange.bind(this);
        let selectedRecordingService = '';
        // TODO: Potentially check if we need to handle changes of
        // _fileRecordingsServiceEnabled and _areIntegrationsEnabled()
        if (this.props._fileRecordingsServiceEnabled
            || !this._areIntegrationsEnabled()) {
            selectedRecordingService = constants_2.RECORDING_TYPES.JITSI_REC_SERVICE;
        }
        else if (this._areIntegrationsEnabled()) {
            if (props._localRecordingEnabled && (0, functions_2.supportsLocalRecording)()) {
                selectedRecordingService = constants_2.RECORDING_TYPES.LOCAL;
            }
            else {
                selectedRecordingService = constants_2.RECORDING_TYPES.DROPBOX;
            }
        }
        this.state = {
            isTokenValid: false,
            isValidating: false,
            userName: undefined,
            sharingEnabled: true,
            shouldRecordAudioAndVideo: this.props._recordAudioAndVideo,
            shouldRecordTranscription: this.props._autoTranscribeOnRecord,
            spaceLeft: undefined,
            selectedRecordingService,
            localRecordingOnlySelf: false
        };
    }
    /**
     * Validates the oauth access token.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        if (typeof this.props._token !== 'undefined') {
            this._onTokenUpdated();
        }
    }
    /**
     * Validates the oauth access token.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        if (this.props._token !== prevProps._token) {
            this._onTokenUpdated();
        }
    }
    /**
     * Returns true if the integrations with third party services are enabled
     * and false otherwise.
     *
     * @returns {boolean} - True if the integrations with third party services
     * are enabled and false otherwise.
     */
    _areIntegrationsEnabled() {
        return this.props._isDropboxEnabled;
    }
    /**
     * Callback to handle sharing setting change from the dialog.
     *
     * @returns {void}
     */
    _onSharingSettingChanged() {
        this.setState({
            sharingEnabled: !this.state.sharingEnabled
        });
    }
    /**
     * Callback to handle local recording only self setting change.
     *
     * @returns {void}
     */
    _onLocalRecordingSelfChange() {
        this.setState({
            localRecordingOnlySelf: !this.state.localRecordingOnlySelf
        });
    }
    /**
     * Handles selected recording service changes.
     *
     * @param {string} selectedRecordingService - The new selected recording
     * service.
     * @returns {void}
     */
    _onSelectedRecordingServiceChanged(selectedRecordingService) {
        this.setState({ selectedRecordingService }, () => {
            this.props.dispatch((0, actions_3.setSelectedRecordingService)(selectedRecordingService));
        });
    }
    /**
     * Handles transcription switch change.
     *
     * @param {boolean} value - The new value.
     * @returns {void}
     */
    _onTranscriptionChange(value) {
        this.setState({
            shouldRecordTranscription: value
        });
    }
    /**
     * Handles audio and video switch change.
     *
     * @param {boolean} value - The new value.
     * @returns {void}
     */
    _onRecordAudioAndVideoChange(value) {
        this.setState({
            shouldRecordAudioAndVideo: value
        });
    }
    /**
     * Validates the dropbox access token and fetches account information.
     *
     * @returns {void}
     */
    _onTokenUpdated() {
        const { _appKey, _isDropboxEnabled, _token, _rToken, _tokenExpireDate, dispatch } = this.props;
        if (!_isDropboxEnabled) {
            return;
        }
        if (typeof _token === 'undefined') {
            this.setState({
                isTokenValid: false,
                isValidating: false
            });
        }
        else { // @ts-ignore
            if (_tokenExpireDate && Date.now() > new Date(_tokenExpireDate)) {
                (0, functions_any_1.getNewAccessToken)(_appKey, _rToken)
                    .then((resp) => dispatch((0, actions_1.updateDropboxToken)(resp.token, resp.rToken, resp.expireDate)));
                return;
            }
            this.setState({
                isTokenValid: false,
                isValidating: true
            });
            (0, functions_any_1.getDropboxData)(_token, _appKey).then(data => {
                if (typeof data === 'undefined') {
                    this.setState({
                        isTokenValid: false,
                        isValidating: false
                    });
                }
                else {
                    this.setState({
                        isTokenValid: true,
                        isValidating: false,
                        ...data
                    });
                }
            });
        }
    }
    /**
     * Starts a file recording session.
     *
     * @private
     * @returns {boolean} - True (to note that the modal should be closed).
     */
    _onSubmit() {
        const { _appKey, _conference, _displaySubtitles, _isDropboxEnabled, _rToken, _subtitlesLanguage, _token, dispatch } = this.props;
        let appData;
        const attributes = {};
        if (this.state.shouldRecordAudioAndVideo) {
            switch (this.state.selectedRecordingService) {
                case constants_2.RECORDING_TYPES.DROPBOX: {
                    if (_isDropboxEnabled && _token) {
                        appData = JSON.stringify({
                            'file_recording_metadata': {
                                'upload_credentials': {
                                    'service_name': constants_2.RECORDING_TYPES.DROPBOX,
                                    'token': _token,
                                    'r_token': _rToken,
                                    'app_key': _appKey
                                }
                            }
                        });
                        attributes.type = constants_2.RECORDING_TYPES.DROPBOX;
                    }
                    else {
                        dispatch((0, actions_2.showErrorNotification)({
                            titleKey: 'dialog.noDropboxToken'
                        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
                        return;
                    }
                    break;
                }
                case constants_2.RECORDING_TYPES.JITSI_REC_SERVICE: {
                    appData = JSON.stringify({
                        'file_recording_metadata': {
                            'share': this.state.sharingEnabled
                        }
                    });
                    attributes.type = constants_2.RECORDING_TYPES.JITSI_REC_SERVICE;
                    break;
                }
                case constants_2.RECORDING_TYPES.LOCAL: {
                    dispatch((0, actions_3.startLocalVideoRecording)(this.state.localRecordingOnlySelf));
                    return true;
                }
            }
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRecordingDialogEvent)('start', 'confirm.button', attributes));
            this._toggleScreenshotCapture();
            _conference?.startRecording({
                mode: lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE,
                appData
            });
        }
        if (this.state.selectedRecordingService === constants_2.RECORDING_TYPES.JITSI_REC_SERVICE
            && this.state.shouldRecordTranscription) {
            dispatch((0, actions_any_1.setRequestingSubtitles)(true, _displaySubtitles, _subtitlesLanguage));
        }
        _conference?.getMetadataHandler().setMetadata(constants_2.RECORDING_METADATA_ID, {
            isTranscribingEnabled: this.state.shouldRecordTranscription
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
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code StartRecordingDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @param {any} _ownProps - Component's own props.
 * @private
 * @returns {IProps}
 */
function mapStateToProps(state, _ownProps) {
    const { recordingService, dropbox = { appKey: undefined }, localRecording, recordings = { recordAudioAndVideo: true } } = state['features/base/config'];
    const { _displaySubtitles, _language: _subtitlesLanguage } = state['features/subtitles'];
    return {
        _appKey: dropbox.appKey ?? '',
        _autoTranscribeOnRecord: (0, functions_2.shouldAutoTranscribeOnRecord)(state),
        _conference: state['features/base/conference'].conference,
        _displaySubtitles,
        _fileRecordingsServiceEnabled: recordingService?.enabled ?? false,
        _fileRecordingsServiceSharingEnabled: (0, functions_2.isRecordingSharingEnabled)(state),
        _isDropboxEnabled: (0, functions_any_1.isEnabled)(state),
        _localRecordingEnabled: !localRecording?.disable,
        _rToken: state['features/dropbox'].rToken ?? '',
        _recordAudioAndVideo: recordings?.recordAudioAndVideo ?? true,
        _subtitlesLanguage,
        _tokenExpireDate: state['features/dropbox'].expireDate,
        _token: state['features/dropbox'].token ?? ''
    };
}
exports.mapStateToProps = mapStateToProps;
exports.default = AbstractStartRecordingDialog;
