"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../../base/icons/components/Icon"));
const svg_1 = require("../../../../base/icons/svg");
const Container_1 = __importDefault(require("../../../../base/react/components/web/Container"));
const Image_1 = __importDefault(require("../../../../base/react/components/web/Image"));
const LoadingIndicator_1 = __importDefault(require("../../../../base/react/components/web/LoadingIndicator"));
const Text_1 = __importDefault(require("../../../../base/react/components/web/Text"));
const Button_1 = __importDefault(require("../../../../base/ui/components/web/Button"));
const Switch_1 = __importDefault(require("../../../../base/ui/components/web/Switch"));
const constants_web_1 = require("../../../../base/ui/constants.web");
const constants_1 = require("../../../constants");
const functions_2 = require("../../../functions");
const AbstractStartRecordingDialogContent_1 = __importStar(require("../AbstractStartRecordingDialogContent"));
const styles_web_1 = require("../styles.web");
const EMPTY_FUNCTION = () => {
    // empty
};
/**
 * The start recording dialog content for the mobile application.
 */
class StartRecordingDialogContent extends AbstractStartRecordingDialogContent_1.default {
    /**
     * Renders the component.
     *
     * @protected
     * @returns {React$Component}
     */
    render() {
        return (react_1.default.createElement(Container_1.default, { className: 'recording-dialog' },
            this.props._isModerator && (react_1.default.createElement(react_1.default.Fragment, null,
                this._renderNoIntegrationsContent(),
                this._renderFileSharingContent(),
                this._renderUploadToTheCloudInfo(),
                this._renderIntegrationsContent())),
            this._renderLocalRecordingContent(),
            this._renderAdvancedOptions()));
    }
    /**
     * Renders the switch for saving the transcription.
     *
     * @returns {React$Component}
     */
    _renderAdvancedOptions() {
        const { selectedRecordingService } = this.props;
        if (selectedRecordingService !== constants_1.RECORDING_TYPES.JITSI_REC_SERVICE || !this._canStartTranscribing()) {
            return null;
        }
        const { showAdvancedOptions } = this.state;
        const { shouldRecordAudioAndVideo, shouldRecordTranscription, t } = this.props;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: 'recording-header-line' }),
            react_1.default.createElement("div", { className: 'recording-header', onClick: this._onToggleShowOptions },
                react_1.default.createElement("label", { className: 'recording-title-no-space' }, t('recording.showAdvancedOptions')),
                react_1.default.createElement(Icon_1.default, { ariaPressed: showAdvancedOptions, onClick: this._onToggleShowOptions, role: 'button', size: 24, src: showAdvancedOptions ? svg_1.IconArrowDown : svg_1.IconArrowRight })),
            showAdvancedOptions && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: 'recording-header space-top' },
                    react_1.default.createElement("label", { className: 'recording-title', htmlFor: 'recording-switch-transcription' }, t('recording.recordTranscription')),
                    react_1.default.createElement(Switch_1.default, { checked: shouldRecordTranscription, className: 'recording-switch', id: 'recording-switch-transcription', onChange: this._onTranscriptionSwitchChange })),
                react_1.default.createElement("div", { className: 'recording-header space-top' },
                    react_1.default.createElement("label", { className: 'recording-title', htmlFor: 'recording-switch-transcription' }, t('recording.recordAudioAndVideo')),
                    react_1.default.createElement(Switch_1.default, { checked: shouldRecordAudioAndVideo, className: 'recording-switch', id: 'recording-switch-transcription', onChange: this._onRecordAudioAndVideoSwitchChange }))))));
    }
    /**
     * Renders the content in case no integrations were enabled.
     *
     * @returns {React$Component}
     */
    _renderNoIntegrationsContent() {
        if (!this._shouldRenderNoIntegrationsContent()) {
            return null;
        }
        const { _localRecordingAvailable, integrationsEnabled, isValidating, isVpaas, selectedRecordingService, t } = this.props;
        const switchContent = integrationsEnabled || _localRecordingAvailable
            ? (react_1.default.createElement(Switch_1.default, { checked: selectedRecordingService === constants_1.RECORDING_TYPES.JITSI_REC_SERVICE, className: 'recording-switch', disabled: isValidating || !this.props.shouldRecordAudioAndVideo, id: 'recording-switch-jitsi', onChange: this._onRecordingServiceSwitchChange })) : null;
        const label = isVpaas ? t('recording.serviceDescriptionCloud') : t('recording.serviceDescription');
        const jitsiContentRecordingIconContainer = integrationsEnabled || _localRecordingAvailable
            ? 'jitsi-content-recording-icon-container-with-switch'
            : 'jitsi-content-recording-icon-container-without-switch';
        const contentRecordingClass = isVpaas
            ? 'cloud-content-recording-icon-container'
            : jitsiContentRecordingIconContainer;
        const jitsiRecordingHeaderClass = !isVpaas && 'jitsi-recording-header';
        return (react_1.default.createElement(Container_1.default, { className: `recording-header ${jitsiRecordingHeaderClass}`, key: 'noIntegrationSetting' },
            react_1.default.createElement(Container_1.default, { className: contentRecordingClass },
                react_1.default.createElement(Image_1.default, { alt: '', className: 'content-recording-icon', src: styles_web_1.ICON_CLOUD })),
            react_1.default.createElement("label", { className: 'recording-title', htmlFor: 'recording-switch-jitsi' }, label),
            switchContent));
    }
    /**
     * Renders the file recording service sharing options, if enabled.
     *
     * @returns {React$Component}
     */
    _renderFileSharingContent() {
        if (!this._shouldRenderFileSharingContent()) {
            return null;
        }
        const { isValidating, onSharingSettingChanged, sharingSetting, t } = this.props;
        return (react_1.default.createElement(Container_1.default, { className: 'recording-header', key: 'fileSharingSetting' },
            react_1.default.createElement(Container_1.default, { className: 'recording-icon-container file-sharing-icon-container' },
                react_1.default.createElement(Image_1.default, { alt: '', className: 'recording-file-sharing-icon', src: styles_web_1.ICON_USERS })),
            react_1.default.createElement("label", { className: 'recording-title', htmlFor: 'recording-switch-share' }, t('recording.fileSharingdescription')),
            react_1.default.createElement(Switch_1.default, { checked: sharingSetting, className: 'recording-switch', disabled: isValidating || !this.props.shouldRecordAudioAndVideo, id: 'recording-switch-share', onChange: onSharingSettingChanged })));
    }
    /**
     * Renders the info in case recording is uploaded to the cloud.
     *
     * @returns {React$Component}
     */
    _renderUploadToTheCloudInfo() {
        const { _hideStorageWarning, isVpaas, selectedRecordingService, t } = this.props;
        if (!(isVpaas && selectedRecordingService === constants_1.RECORDING_TYPES.JITSI_REC_SERVICE) || _hideStorageWarning) {
            return null;
        }
        return (react_1.default.createElement(Container_1.default, { className: 'recording-info', key: 'cloudUploadInfo' },
            react_1.default.createElement(Image_1.default, { alt: '', className: 'recording-info-icon', src: styles_web_1.ICON_INFO }),
            react_1.default.createElement(Text_1.default, { className: 'recording-info-title' }, t('recording.serviceDescriptionCloudInfo'))));
    }
    /**
     * Renders a spinner component.
     *
     * @returns {React$Component}
     */
    _renderSpinner() {
        return (react_1.default.createElement(LoadingIndicator_1.default, { size: 'small' }));
    }
    /**
     * Renders the screen with the account information of a logged in user.
     *
     * @returns {React$Component}
     */
    _renderSignOut() {
        const { spaceLeft, t, userName } = this.props;
        const duration = (0, functions_2.getRecordingDurationEstimation)(spaceLeft);
        return (react_1.default.createElement(Container_1.default, null,
            react_1.default.createElement(Container_1.default, { className: 'logged-in-panel' },
                react_1.default.createElement(Container_1.default, null,
                    react_1.default.createElement(Text_1.default, null, t('recording.loggedIn', { userName }))),
                react_1.default.createElement(Container_1.default, null,
                    react_1.default.createElement(Text_1.default, null, t('recording.availableSpace', {
                        spaceLeft,
                        duration
                    }))))));
    }
    /**
     * Renders the content in case integrations were enabled.
     *
     * @protected
     * @returns {React$Component}
     */
    _renderIntegrationsContent() {
        if (!this._shouldRenderIntegrationsContent()) {
            return null;
        }
        const { _localRecordingAvailable, fileRecordingsServiceEnabled, isTokenValid, isValidating, selectedRecordingService, t } = this.props;
        let content = null;
        let switchContent = null;
        let labelContent = (react_1.default.createElement(Text_1.default, { className: 'recording-title' }, t('recording.authDropboxText')));
        if (isValidating) {
            content = this._renderSpinner();
            switchContent = react_1.default.createElement(Container_1.default, { className: 'recording-switch' });
        }
        else if (isTokenValid) {
            content = this._renderSignOut();
            switchContent = (react_1.default.createElement(Container_1.default, { className: 'recording-switch' },
                react_1.default.createElement(Button_1.default, { accessibilityLabel: t('recording.signOut'), labelKey: 'recording.signOut', onClick: this._onSignOut, type: constants_web_1.BUTTON_TYPES.SECONDARY })));
        }
        else {
            switchContent = (react_1.default.createElement(Container_1.default, { className: 'recording-switch' },
                react_1.default.createElement(Button_1.default, { accessibilityLabel: t('recording.signIn'), labelKey: 'recording.signIn', onClick: this._onSignIn, type: constants_web_1.BUTTON_TYPES.PRIMARY })));
        }
        if (fileRecordingsServiceEnabled || _localRecordingAvailable) {
            switchContent = (react_1.default.createElement(Switch_1.default, { checked: selectedRecordingService
                    === constants_1.RECORDING_TYPES.DROPBOX, className: 'recording-switch', disabled: isValidating || !this.props.shouldRecordAudioAndVideo, id: 'recording-switch-integration', onChange: this._onDropboxSwitchChange }));
            labelContent = (react_1.default.createElement("label", { className: 'recording-title', htmlFor: 'recording-switch-integration' }, t('recording.authDropboxText')));
        }
        return (react_1.default.createElement(Container_1.default, null,
            react_1.default.createElement(Container_1.default, { className: `recording-header ${this._shouldRenderNoIntegrationsContent()
                    ? 'recording-header-line' : ''}` },
                react_1.default.createElement(Container_1.default, { className: 'recording-icon-container' },
                    react_1.default.createElement(Image_1.default, { alt: '', className: 'recording-icon', src: styles_web_1.DROPBOX_LOGO })),
                labelContent,
                switchContent),
            react_1.default.createElement(Container_1.default, { className: 'authorization-panel' }, content)));
    }
    /**
     * Renders the content for local recordings.
     *
     * @protected
     * @returns {React$Component}
     */
    _renderLocalRecordingContent() {
        const { _localRecordingAvailable, _localRecordingNoNotification, _localRecordingSelfEnabled, isValidating, localRecordingOnlySelf, onLocalRecordingSelfChange, t, selectedRecordingService } = this.props;
        if (!_localRecordingAvailable) {
            return null;
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Container_1.default, null,
                react_1.default.createElement(Container_1.default, { className: 'recording-header recording-header-line' },
                    react_1.default.createElement(Container_1.default, { className: 'recording-icon-container' },
                        react_1.default.createElement(Image_1.default, { alt: '', className: 'recording-icon', src: styles_web_1.LOCAL_RECORDING })),
                    react_1.default.createElement("label", { className: 'recording-title', htmlFor: 'recording-switch-local' }, t('recording.saveLocalRecording')),
                    react_1.default.createElement(Switch_1.default, { checked: selectedRecordingService
                            === constants_1.RECORDING_TYPES.LOCAL, className: 'recording-switch', disabled: isValidating || !this.props.shouldRecordAudioAndVideo, id: 'recording-switch-local', onChange: this._onLocalRecordingSwitchChange }))),
            selectedRecordingService === constants_1.RECORDING_TYPES.LOCAL && (react_1.default.createElement(react_1.default.Fragment, null,
                _localRecordingSelfEnabled && (react_1.default.createElement(Container_1.default, null,
                    react_1.default.createElement(Container_1.default, { className: 'recording-header space-top' },
                        react_1.default.createElement(Container_1.default, { className: 'recording-icon-container file-sharing-icon-container' },
                            react_1.default.createElement(Image_1.default, { alt: '', className: 'recording-file-sharing-icon', src: styles_web_1.ICON_USERS })),
                        react_1.default.createElement("label", { className: 'recording-title', htmlFor: 'recording-switch-myself' }, t('recording.onlyRecordSelf')),
                        react_1.default.createElement(Switch_1.default, { checked: Boolean(localRecordingOnlySelf), className: 'recording-switch', disabled: isValidating || !this.props.shouldRecordAudioAndVideo, id: 'recording-switch-myself', onChange: onLocalRecordingSelfChange ?? EMPTY_FUNCTION })))),
                react_1.default.createElement(Text_1.default, { className: 'local-recording-warning text' }, t('recording.localRecordingWarning')),
                _localRecordingNoNotification && !localRecordingOnlySelf
                    && react_1.default.createElement(Text_1.default, { className: 'local-recording-warning notification' }, t('recording.localRecordingNoNotificationWarning'))))));
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractStartRecordingDialogContent_1.mapStateToProps)(StartRecordingDialogContent));
