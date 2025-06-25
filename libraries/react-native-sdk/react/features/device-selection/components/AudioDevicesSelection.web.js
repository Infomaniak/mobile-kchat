"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const actions_web_1 = require("../../base/devices/actions.web");
const AbstractDialogTab_1 = __importDefault(require("../../base/dialog/components/web/AbstractDialogTab"));
const functions_1 = require("../../base/i18n/functions");
const functions_web_1 = require("../../base/lib-jitsi-meet/functions.web");
const Checkbox_1 = __importDefault(require("../../base/ui/components/web/Checkbox"));
const functions_2 = require("../../visitors/functions");
const logger_1 = __importDefault(require("../logger"));
const AudioInputPreview_1 = __importDefault(require("./AudioInputPreview"));
const AudioOutputPreview_1 = __importDefault(require("./AudioOutputPreview"));
const DeviceHidContainer_web_1 = __importDefault(require("./DeviceHidContainer.web"));
const DeviceSelector_web_1 = __importDefault(require("./DeviceSelector.web"));
const styles = (theme) => {
    return {
        container: {
            display: 'flex',
            flexDirection: 'column',
            padding: '0 2px',
            width: '100%'
        },
        inputContainer: {
            marginBottom: theme.spacing(3)
        },
        outputContainer: {
            margin: `${theme.spacing(5)} 0`,
            display: 'flex',
            alignItems: 'flex-end'
        },
        outputButton: {
            marginLeft: theme.spacing(3)
        },
        noiseSuppressionContainer: {
            marginBottom: theme.spacing(5)
        }
    };
};
/**
 * React {@code Component} for previewing audio and video input/output devices.
 *
 * @augments Component
 */
class AudioDevicesSelection extends AbstractDialogTab_1.default {
    /**
     * Initializes a new DeviceSelection instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            previewAudioTrack: null
        };
        this._unMounted = true;
    }
    /**
     * Generate the initial previews for audio input and video input.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._unMounted = false;
        Promise.all([
            this._createAudioInputTrack(this.props.selectedAudioInputId)
        ])
            .catch(err => logger_1.default.warn('Failed to initialize preview tracks', err))
            .then(() => {
            this.props.dispatch((0, actions_web_1.getAvailableDevices)());
        });
    }
    /**
     * Checks if audio / video permissions were granted. Updates audio input and
     * video input previews.
     *
     * @param {Object} prevProps - Previous props this component received.
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        if (prevProps.selectedAudioInputId
            !== this.props.selectedAudioInputId) {
            this._createAudioInputTrack(this.props.selectedAudioInputId);
        }
    }
    /**
     * Ensure preview tracks are destroyed to prevent continued use.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this._unMounted = true;
        this._disposeAudioInputPreview();
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { hasAudioPermission, hideAudioInputPreview, hideAudioOutputPreview, hideDeviceHIDContainer, hideNoiseSuppression, iAmVisitor, noiseSuppressionEnabled, selectedAudioOutputId, t } = this.props;
        const { audioInput, audioOutput } = this._getSelectors();
        const classes = mui_1.withStyles.getClasses(this.props);
        return (react_1.default.createElement("div", { className: classes.container },
            !iAmVisitor && react_1.default.createElement("div", { "aria-live": 'polite', className: classes.inputContainer }, this._renderSelector(audioInput)),
            !hideAudioInputPreview && hasAudioPermission && !iAmVisitor
                && react_1.default.createElement(AudioInputPreview_1.default, { track: this.state.previewAudioTrack }),
            react_1.default.createElement("div", { "aria-live": 'polite', className: classes.outputContainer },
                this._renderSelector(audioOutput),
                !hideAudioOutputPreview && hasAudioPermission
                    && react_1.default.createElement(AudioOutputPreview_1.default, { className: classes.outputButton, deviceId: selectedAudioOutputId })),
            !hideNoiseSuppression && !iAmVisitor && (react_1.default.createElement("div", { className: classes.noiseSuppressionContainer },
                react_1.default.createElement(Checkbox_1.default, { checked: noiseSuppressionEnabled, label: t('toolbar.enableNoiseSuppression'), 
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange: () => super._onChange({
                        noiseSuppressionEnabled: !noiseSuppressionEnabled
                    }) }))),
            !hideDeviceHIDContainer && !iAmVisitor
                && react_1.default.createElement(DeviceHidContainer_web_1.default, null)));
    }
    /**
     * Creates the JitsiTrack for the audio input preview.
     *
     * @param {string} deviceId - The id of audio input device to preview.
     * @private
     * @returns {void}
     */
    _createAudioInputTrack(deviceId) {
        const { hideAudioInputPreview } = this.props;
        if (hideAudioInputPreview) {
            return;
        }
        return this._disposeAudioInputPreview()
            .then(() => (0, functions_web_1.createLocalTrack)('audio', deviceId, 5000))
            .then(jitsiLocalTrack => {
            if (this._unMounted) {
                jitsiLocalTrack.dispose();
                return;
            }
            this.setState({
                previewAudioTrack: jitsiLocalTrack
            });
        })
            .catch(() => {
            this.setState({
                previewAudioTrack: null
            });
        });
    }
    /**
     * Utility function for disposing the current audio input preview.
     *
     * @private
     * @returns {Promise}
     */
    _disposeAudioInputPreview() {
        return this.state.previewAudioTrack
            ? this.state.previewAudioTrack.dispose() : Promise.resolve();
    }
    /**
     * Creates a DeviceSelector instance based on the passed in configuration.
     *
     * @private
     * @param {Object} deviceSelectorProps - The props for the DeviceSelector.
     * @returns {ReactElement}
     */
    _renderSelector(deviceSelectorProps) {
        return deviceSelectorProps ? (react_1.default.createElement(DeviceSelector_web_1.default, { ...deviceSelectorProps, key: deviceSelectorProps.id })) : null;
    }
    /**
     * Returns object configurations for audio input and output.
     *
     * @private
     * @returns {Object} Configurations.
     */
    _getSelectors() {
        const { availableDevices, hasAudioPermission } = this.props;
        const audioInput = {
            devices: availableDevices.audioInput,
            hasPermission: hasAudioPermission,
            icon: 'icon-microphone',
            isDisabled: this.props.disableAudioInputChange || this.props.disableDeviceChange,
            key: 'audioInput',
            id: 'audioInput',
            label: 'settings.selectMic',
            onSelect: (selectedAudioInputId) => super._onChange({ selectedAudioInputId }),
            selectedDeviceId: this.state.previewAudioTrack
                ? this.state.previewAudioTrack.getDeviceId() : this.props.selectedAudioInputId
        };
        let audioOutput;
        if (!this.props.hideAudioOutputSelect) {
            audioOutput = {
                devices: availableDevices.audioOutput,
                hasPermission: hasAudioPermission,
                icon: 'icon-speaker',
                isDisabled: this.props.disableDeviceChange,
                key: 'audioOutput',
                id: 'audioOutput',
                label: 'settings.selectAudioOutput',
                onSelect: (selectedAudioOutputId) => super._onChange({ selectedAudioOutputId }),
                selectedDeviceId: this.props.selectedAudioOutputId
            };
        }
        return { audioInput,
            audioOutput };
    }
}
const mapStateToProps = (state) => {
    return {
        availableDevices: state['features/base/devices'].availableDevices ?? {},
        iAmVisitor: (0, functions_2.iAmVisitor)(state)
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)((0, mui_1.withStyles)((0, functions_1.translate)(AudioDevicesSelection), styles));
