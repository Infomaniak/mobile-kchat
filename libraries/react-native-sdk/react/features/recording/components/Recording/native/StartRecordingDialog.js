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
const JitsiScreen_1 = __importDefault(require("../../../../base/modal/components/JitsiScreen"));
const HeaderNavigationButton_1 = __importDefault(require("../../../../mobile/navigation/components/HeaderNavigationButton"));
const ConferenceNavigationContainerRef_1 = require("../../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const constants_1 = require("../../../constants");
const AbstractStartRecordingDialog_1 = __importStar(require("../AbstractStartRecordingDialog"));
const styles_native_1 = __importDefault(require("../styles.native"));
const StartRecordingDialogContent_1 = __importDefault(require("./StartRecordingDialogContent"));
/**
 * React Component for getting confirmation to start a file recording session in
 * progress.
 *
 * @augments Component
 */
class StartRecordingDialog extends AbstractStartRecordingDialog_1.default {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onStartPress = this._onStartPress.bind(this);
    }
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        super.componentDidMount();
        const { navigation, t } = this.props;
        navigation.setOptions({
            headerRight: () => (<HeaderNavigationButton_1.default disabled={this.isStartRecordingDisabled()} label={t('dialog.start')} onPress={this._onStartPress} twoActions={true}/>)
        });
    }
    /**
     * Implements React's {@link Component#componentDidUpdate()}. Invoked
     * immediately after this component is updated.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        super.componentDidUpdate(prevProps);
        const { navigation, t } = this.props;
        navigation.setOptions({
            // eslint-disable-next-line react/no-multi-comp
            headerRight: () => (<HeaderNavigationButton_1.default disabled={this.isStartRecordingDisabled()} label={t('dialog.start')} onPress={this._onStartPress} twoActions={true}/>)
        });
    }
    /**
     * Starts recording session and goes back to the previous screen.
     *
     * @returns {void}
     */
    _onStartPress() {
        this._onSubmit() && (0, ConferenceNavigationContainerRef_1.goBack)();
    }
    /**
     * Disables start recording button.
     *
     * @returns {boolean}
     */
    isStartRecordingDisabled() {
        const { isTokenValid, selectedRecordingService, shouldRecordAudioAndVideo, shouldRecordTranscription } = this.state;
        if (!shouldRecordAudioAndVideo && !shouldRecordTranscription) {
            return true;
        }
        // Start button is disabled if recording service is only shown;
        // When validating dropbox token, if that is not enabled, we either always
        // show the start button or, if just dropbox is enabled, start button
        // is available when there is token.
        if (selectedRecordingService === constants_1.RECORDING_TYPES.JITSI_REC_SERVICE) {
            return false;
        }
        else if (selectedRecordingService === constants_1.RECORDING_TYPES.DROPBOX) {
            return !isTokenValid;
        }
        return true;
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { isTokenValid, isValidating, selectedRecordingService, sharingEnabled, shouldRecordAudioAndVideo, shouldRecordTranscription, spaceLeft, userName } = this.state;
        const { _fileRecordingsServiceEnabled, _fileRecordingsServiceSharingEnabled } = this.props;
        return (<JitsiScreen_1.default style={styles_native_1.default.startRecodingContainer}>
                <StartRecordingDialogContent_1.default fileRecordingsServiceEnabled={_fileRecordingsServiceEnabled} fileRecordingsServiceSharingEnabled={_fileRecordingsServiceSharingEnabled} integrationsEnabled={this._areIntegrationsEnabled()} isTokenValid={isTokenValid} isValidating={isValidating} onChange={this._onSelectedRecordingServiceChanged} onRecordAudioAndVideoChange={this._onRecordAudioAndVideoChange} onSharingSettingChanged={this._onSharingSettingChanged} onTranscriptionChange={this._onTranscriptionChange} selectedRecordingService={selectedRecordingService} sharingSetting={sharingEnabled} shouldRecordAudioAndVideo={shouldRecordAudioAndVideo} shouldRecordTranscription={shouldRecordTranscription} spaceLeft={spaceLeft} userName={userName}/>
            </JitsiScreen_1.default>);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractStartRecordingDialog_1.mapStateToProps)(StartRecordingDialog));
