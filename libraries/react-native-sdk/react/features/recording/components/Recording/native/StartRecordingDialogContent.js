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
const react_native_1 = require("react-native");
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../../base/icons/components/Icon"));
const svg_1 = require("../../../../base/icons/svg");
const LoadingIndicator_1 = __importDefault(require("../../../../base/react/components/native/LoadingIndicator"));
const Button_1 = __importDefault(require("../../../../base/ui/components/native/Button"));
const Switch_1 = __importDefault(require("../../../../base/ui/components/native/Switch"));
const constants_native_1 = require("../../../../base/ui/constants.native");
const constants_1 = require("../../../constants");
const functions_2 = require("../../../functions");
const AbstractStartRecordingDialogContent_1 = __importStar(require("../AbstractStartRecordingDialogContent"));
const styles_native_1 = require("../styles.native");
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
        const { _styles: styles } = this.props;
        return (<react_native_1.View style={styles.container}>
                {this._renderNoIntegrationsContent()}
                {this._renderFileSharingContent()}
                {this._renderUploadToTheCloudInfo()}
                {this._renderIntegrationsContent()}
                {this._renderAdvancedOptions()}
            </react_native_1.View>);
    }
    /**
     * Renders the save transcription switch.
     *
     * @returns {React$Component}
     */
    _renderAdvancedOptions() {
        const { selectedRecordingService } = this.props;
        if (selectedRecordingService !== constants_1.RECORDING_TYPES.JITSI_REC_SERVICE || !this._canStartTranscribing()) {
            return null;
        }
        const { showAdvancedOptions } = this.state;
        const { _dialogStyles, _styles: styles, shouldRecordAudioAndVideo, shouldRecordTranscription, t } = this.props;
        return (<>
                <react_native_1.View style={styles.header}>
                    <react_native_paper_1.Text style={{
                ..._dialogStyles.text,
                ...styles.title
            }}>
                        {t('recording.showAdvancedOptions')}
                    </react_native_paper_1.Text>
                    <Icon_1.default ariaPressed={showAdvancedOptions} onClick={this._onToggleShowOptions} role='button' size={24} src={showAdvancedOptions ? svg_1.IconArrowDown : svg_1.IconArrowRight}/>
                </react_native_1.View>
                {showAdvancedOptions && (<>
                        <react_native_1.View key='transcriptionSetting' style={styles.header}>
                            <react_native_paper_1.Text style={{
                    ..._dialogStyles.text,
                    ...styles.title
                }}>
                                {t('recording.recordTranscription')}
                            </react_native_paper_1.Text>
                            <Switch_1.default checked={shouldRecordTranscription} onChange={this._onTranscriptionSwitchChange} style={styles.switch}/>
                        </react_native_1.View>
                        <react_native_1.View key='audioVideoSetting' style={styles.header}>
                            <react_native_paper_1.Text style={{
                    ..._dialogStyles.text,
                    ...styles.title
                }}>
                                {t('recording.recordAudioAndVideo')}
                            </react_native_paper_1.Text>
                            <Switch_1.default checked={shouldRecordAudioAndVideo} onChange={this._onRecordAudioAndVideoSwitchChange} style={styles.switch}/>
                        </react_native_1.View>
                    </>)}
            </>);
    }
    /**
     * Renders the content in case no integrations were enabled.
     *
     * @returns {React$Component}
     */
    _renderNoIntegrationsContent() {
        const { _dialogStyles, _styles: styles, integrationsEnabled, isValidating, selectedRecordingService, shouldRecordAudioAndVideo, t } = this.props;
        if (!this._shouldRenderNoIntegrationsContent()) {
            return null;
        }
        const switchContent = integrationsEnabled
            ? (<Switch_1.default checked={selectedRecordingService === constants_1.RECORDING_TYPES.JITSI_REC_SERVICE} disabled={isValidating || !shouldRecordAudioAndVideo} onChange={this._onRecordingServiceSwitchChange} style={styles.switch}/>) : null;
        return (<react_native_1.View key='noIntegrationSetting' style={styles.header}>
                <react_native_1.Image source={styles_native_1.ICON_CLOUD} style={styles.recordingIcon}/>
                <react_native_paper_1.Text style={{
                ..._dialogStyles.text,
                ...styles.title
            }}>
                    {t('recording.serviceDescription')}
                </react_native_paper_1.Text>
                {switchContent}
            </react_native_1.View>);
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
        const { _dialogStyles, _styles: styles, isValidating, onSharingSettingChanged, sharingSetting, shouldRecordAudioAndVideo, t } = this.props;
        return (<react_native_1.View key='fileSharingSetting' style={styles.header}>
                <react_native_1.Image source={styles_native_1.ICON_USERS} style={styles.recordingIcon}/>
                <react_native_paper_1.Text style={{
                ..._dialogStyles.text,
                ...styles.title
            }}>
                    {t('recording.fileSharingdescription')}
                </react_native_paper_1.Text>
                <Switch_1.default checked={sharingSetting} disabled={isValidating || !shouldRecordAudioAndVideo} onChange={onSharingSettingChanged} style={styles.switch}/>
            </react_native_1.View>);
    }
    /**
     * Renders the info in case recording is uploaded to the cloud.
     *
     * @returns {React$Component}
     */
    _renderUploadToTheCloudInfo() {
        const { _dialogStyles, _hideStorageWarning, _styles: styles, isVpaas, selectedRecordingService, t } = this.props;
        if (!(isVpaas && selectedRecordingService === constants_1.RECORDING_TYPES.JITSI_REC_SERVICE) || _hideStorageWarning) {
            return null;
        }
        return (<react_native_1.View key='cloudUploadInfo' style={styles.headerInfo}>
                <react_native_1.Image source={styles_native_1.ICON_INFO} style={styles.recordingInfoIcon}/>
                <react_native_paper_1.Text style={{
                ..._dialogStyles.text,
                ...styles.titleInfo
            }}>
                    {t('recording.serviceDescriptionCloudInfo')}
                </react_native_paper_1.Text>
            </react_native_1.View>);
    }
    /**
     * Renders a spinner component.
     *
     * @returns {React$Component}
     */
    _renderSpinner() {
        return (<LoadingIndicator_1.default size='small'/>);
    }
    /**
     * Renders the screen with the account information of a logged in user.
     *
     * @returns {React$Component}
     */
    _renderSignOut() {
        const { _styles: styles, spaceLeft, t, userName } = this.props;
        const duration = (0, functions_2.getRecordingDurationEstimation)(spaceLeft);
        return (<react_native_1.View style={styles.loggedIn}>
                <react_native_paper_1.Text style={[
                styles.text,
                styles.recordingText
            ]}>
                    {t('recording.loggedIn', { userName })}
                </react_native_paper_1.Text>
                <react_native_paper_1.Text style={[
                styles.text,
                styles.recordingText
            ]}>
                    {t('recording.availableSpace', {
                spaceLeft,
                duration
            })}
                </react_native_paper_1.Text>
            </react_native_1.View>);
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
        const { _dialogStyles, _styles: styles, fileRecordingsServiceEnabled, isTokenValid, isValidating, selectedRecordingService, shouldRecordAudioAndVideo, t } = this.props;
        let content = null;
        let switchContent = null;
        if (isValidating) {
            content = this._renderSpinner();
            switchContent = <react_native_1.View />;
        }
        else if (isTokenValid) {
            content = this._renderSignOut();
            switchContent = (<Button_1.default accessibilityLabel='recording.signOut' labelKey='recording.signOut' onClick={this._onSignOut} type={constants_native_1.BUTTON_TYPES.SECONDARY}/>);
        }
        else {
            switchContent = (<Button_1.default accessibilityLabel='recording.signIn' labelKey='recording.signIn' onClick={this._onSignIn} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>);
        }
        if (fileRecordingsServiceEnabled) {
            switchContent = (<Switch_1.default checked={selectedRecordingService === constants_1.RECORDING_TYPES.DROPBOX} disabled={isValidating || !shouldRecordAudioAndVideo} onChange={this._onDropboxSwitchChange} style={styles.switch}/>);
        }
        return (<react_native_1.View>
                <react_native_1.View style={styles.headerIntegrations}>
                    <react_native_1.Image source={styles_native_1.DROPBOX_LOGO} style={styles.recordingIcon}/>
                    <react_native_paper_1.Text style={{
                ..._dialogStyles.text,
                ...styles.title
            }}>
                        {t('recording.authDropboxText')}
                    </react_native_paper_1.Text>
                    {switchContent}
                </react_native_1.View>
                <react_native_1.View>
                    {content}
                </react_native_1.View>
            </react_native_1.View>);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractStartRecordingDialogContent_1.mapStateToProps)(StartRecordingDialogContent));
