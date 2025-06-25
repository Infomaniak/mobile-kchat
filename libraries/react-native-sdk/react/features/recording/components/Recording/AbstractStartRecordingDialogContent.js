"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapStateToProps = void 0;
const react_1 = require("react");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const ColorSchemeRegistry_1 = __importDefault(require("../../../base/color-scheme/ColorSchemeRegistry"));
const functions_2 = require("../../../base/dialog/functions");
const functions_3 = require("../../../base/participants/functions");
const actions_1 = require("../../../dropbox/actions");
const functions_4 = require("../../../jaas/functions");
const functions_5 = require("../../../transcribing/functions");
const constants_1 = require("../../constants");
const functions_6 = require("../../functions");
/**
 * React Component for getting confirmation to start a recording session.
 *
 * @augments Component
 */
class AbstractStartRecordingDialogContent extends react_1.Component {
    /**
     * Initializes a new {@code AbstractStartRecordingDialogContent} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        // Bind event handler; it bounds once for every instance.
        this._onSignIn = this._onSignIn.bind(this);
        this._onSignOut = this._onSignOut.bind(this);
        this._onDropboxSwitchChange = this._onDropboxSwitchChange.bind(this);
        this._onRecordingServiceSwitchChange = this._onRecordingServiceSwitchChange.bind(this);
        this._onLocalRecordingSwitchChange = this._onLocalRecordingSwitchChange.bind(this);
        this._onTranscriptionSwitchChange = this._onTranscriptionSwitchChange.bind(this);
        this._onRecordAudioAndVideoSwitchChange = this._onRecordAudioAndVideoSwitchChange.bind(this);
        this._onToggleShowOptions = this._onToggleShowOptions.bind(this);
        this.state = {
            showAdvancedOptions: true
        };
    }
    /**
     * Implements the Component's componentDidMount method.
     *
     * @inheritdoc
     */
    componentDidMount() {
        if (!this._shouldRenderNoIntegrationsContent()
            && !this._shouldRenderIntegrationsContent()
            && !this._shouldRenderFileSharingContent()) {
            this._onLocalRecordingSwitchChange();
        }
    }
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps) {
        // Auto sign-out when the use chooses another recording service.
        if (prevProps.selectedRecordingService === constants_1.RECORDING_TYPES.DROPBOX
            && this.props.selectedRecordingService !== constants_1.RECORDING_TYPES.DROPBOX && this.props.isTokenValid) {
            this._onSignOut();
        }
    }
    /**
     * Returns whether the advanced options should be rendered.
     *
     * @returns {boolean}
     */
    _onToggleShowOptions() {
        this.setState({ showAdvancedOptions: !this.state.showAdvancedOptions });
    }
    /**
     * Whether the file sharing content should be rendered or not.
     *
     * @returns {boolean}
     */
    _shouldRenderFileSharingContent() {
        const { fileRecordingsServiceEnabled, fileRecordingsServiceSharingEnabled, isVpaas, selectedRecordingService } = this.props;
        if (!fileRecordingsServiceEnabled
            || !fileRecordingsServiceSharingEnabled
            || isVpaas
            || selectedRecordingService !== constants_1.RECORDING_TYPES.JITSI_REC_SERVICE) {
            return false;
        }
        return true;
    }
    /**
     * Whether the save transcription content should be rendered or not.
     *
     * @returns {boolean}
     */
    _canStartTranscribing() {
        return this.props._canStartTranscribing;
    }
    /**
     * Whether the no integrations content should be rendered or not.
     *
     * @returns {boolean}
     */
    _shouldRenderNoIntegrationsContent() {
        // show the non integrations part only if fileRecordingsServiceEnabled
        // is enabled
        if (!this.props.fileRecordingsServiceEnabled) {
            return false;
        }
        return true;
    }
    /**
     * Whether the integrations content should be rendered or not.
     *
     * @returns {boolean}
     */
    _shouldRenderIntegrationsContent() {
        if (!this.props.integrationsEnabled) {
            return false;
        }
        return true;
    }
    /**
     * Handler for transcription switch change.
     *
     * @param {boolean} value - The new value.
     * @returns {void}
     */
    _onTranscriptionSwitchChange(value) {
        this.props.onTranscriptionChange(value);
    }
    /**
     * Handler for audio and video switch change.
     *
     * @param {boolean} value - The new value.
     * @returns {void}
     */
    _onRecordAudioAndVideoSwitchChange(value) {
        this.props.onRecordAudioAndVideoChange(value);
    }
    /**
     * Handler for onValueChange events from the Switch component.
     *
     * @returns {void}
     */
    _onRecordingServiceSwitchChange() {
        const { onChange, selectedRecordingService } = this.props;
        // act like group, cannot toggle off
        if (selectedRecordingService === constants_1.RECORDING_TYPES.JITSI_REC_SERVICE) {
            return;
        }
        onChange(constants_1.RECORDING_TYPES.JITSI_REC_SERVICE);
    }
    /**
     * Handler for onValueChange events from the Switch component.
     *
     * @returns {void}
     */
    _onDropboxSwitchChange() {
        const { isTokenValid, onChange, selectedRecordingService } = this.props;
        // act like group, cannot toggle off
        if (selectedRecordingService === constants_1.RECORDING_TYPES.DROPBOX) {
            return;
        }
        onChange(constants_1.RECORDING_TYPES.DROPBOX);
        if (!isTokenValid) {
            this._onSignIn();
        }
    }
    /**
     * Handler for onValueChange events from the Switch component.
     *
     * @returns {void}
     */
    _onLocalRecordingSwitchChange() {
        const { _localRecordingAvailable, onChange, selectedRecordingService } = this.props;
        if (!_localRecordingAvailable) {
            return;
        }
        // act like group, cannot toggle off
        if (selectedRecordingService
            === constants_1.RECORDING_TYPES.LOCAL) {
            return;
        }
        onChange(constants_1.RECORDING_TYPES.LOCAL);
    }
    /**
     * Sings in a user.
     *
     * @returns {void}
     */
    _onSignIn() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRecordingDialogEvent)('start', 'signIn.button'));
        this.props.dispatch((0, actions_1.authorizeDropbox)());
    }
    /**
     * Sings out an user from dropbox.
     *
     * @returns {void}
     */
    _onSignOut() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRecordingDialogEvent)('start', 'signOut.button'));
        this.props.dispatch((0, actions_1.updateDropboxToken)());
    }
}
/**
 * Maps part of the redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function mapStateToProps(state) {
    const { localRecording, recordingService } = state['features/base/config'];
    const _localRecordingAvailable = !localRecording?.disable && (0, functions_6.supportsLocalRecording)();
    return {
        ...(0, functions_2._abstractMapStateToProps)(state),
        isVpaas: (0, functions_4.isVpaasMeeting)(state),
        _canStartTranscribing: (0, functions_5.canAddTranscriber)(state),
        _hideStorageWarning: Boolean(recordingService?.hideStorageWarning),
        _isModerator: (0, functions_3.isLocalParticipantModerator)(state),
        _localRecordingAvailable,
        _localRecordingEnabled: !localRecording?.disable,
        _localRecordingSelfEnabled: !localRecording?.disableSelfRecording,
        _localRecordingNoNotification: !localRecording?.notifyAllParticipants,
        _styles: ColorSchemeRegistry_1.default.get(state, 'StartRecordingDialogContent')
    };
}
exports.mapStateToProps = mapStateToProps;
exports.default = AbstractStartRecordingDialogContent;
